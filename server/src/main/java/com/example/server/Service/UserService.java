package com.example.server.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.Model.Admin;
import com.example.server.Model.ParkingSlot;
import com.example.server.Model.User;
import com.example.server.Repository.AdminRepository;
import com.example.server.Repository.UserRepository;
import com.example.server.events.CheckInEvent;
import com.example.server.events.CheckOutEvent;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final ApplicationEventPublisher eventPublisher;
    private final Map<String, ScheduledFuture<?>> cancellationTasks = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Autowired
    public UserService(AdminRepository adminRepository, ApplicationEventPublisher eventPublisher) {
        this.adminRepository = adminRepository;
        this.eventPublisher = eventPublisher;
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<ParkingSlot> getParkingSlots(String id) {
        System.out.println("🔹 getParkingSlots() called with ID: " + id);  // Debug Log
    
        Optional<Admin> adminOptional = adminRepository.findById(id);
        if (adminOptional.isEmpty()) {
            System.out.println("⚠️ Admin not found!");
            return Collections.emptyList();
        }
    
        Admin admin = adminOptional.get();
        List<ParkingSlot> slots = admin.getParkingSlots();
    
        // Debugging: Print slot details
        for (ParkingSlot slot : slots) {
            System.out.println("✅ Slot ID: " + slot.getSlotId() + ", Booked By: " + slot.getBookedBy() + ", Status: " + slot.isBooked());
        }
    
        return slots;
    }
    
    public boolean reserveSlot(String id, String slotId, String username) {
    Optional<Admin> adminOptional = adminRepository.findById(id);
    if (adminOptional.isEmpty()) {
        System.out.println("❌ Admin not found!");
        return false;
    }

    Admin admin = adminOptional.get();
    List<ParkingSlot> slots = admin.getParkingSlots();

    for (ParkingSlot slot : slots) {
        if (slot.getSlotId().equals(slotId)) {
            if (slot.isBooked()) {
                System.out.println("❌ Slot is already booked!");
                return false;
            }
            slot.setBooked(true);
            slot.setBookedBy(username);
            slot.setBookingTime(LocalDateTime.now());  // Store booking time
            adminRepository.save(admin);
            scheduleCancellation(slot, admin);  // Start auto-cancel timer
            return true;
        }
    }

    System.out.println("❌ Slot not found!");
    return false;
}

    private void scheduleCancellation(ParkingSlot slot, Admin admin) {
        ScheduledFuture<?> task = scheduler.schedule(() -> {
            if (slot.getCheckInTime() == null) { // If no check-in
                slot.setBooked(false);
                slot.setBookedBy(null);
                slot.setBookingTime(null);
                adminRepository.save(admin);
                System.out.println("⏳ Booking expired. Slot is now available.");
                cancellationTasks.remove(slot.getSlotId());
            }
        }, 1, TimeUnit.MINUTES);

        cancellationTasks.put(slot.getSlotId(), task);
    }

    public boolean checkIn(String id, String slotId, String username) {
        Optional<Admin> adminOptional = adminRepository.findById(id);
        if (adminOptional.isEmpty()) return false;

        Admin admin = adminOptional.get();
        for (ParkingSlot slot : admin.getParkingSlots()) {
            if (slot.getSlotId().equals(slotId) && slot.getBookedBy().equals(username)) {
                slot.setCheckInTime(LocalDateTime.now());
                adminRepository.save(admin);

                // ✅ Cancel scheduled cancellation task
                ScheduledFuture<?> task = cancellationTasks.remove(slotId);
                if (task != null) {
                    task.cancel(false);
                    System.out.println("✅ Booking cancellation prevented for slot: " + slotId);
                }

                // ✅ Publish event instead of directly calling AdminService
                eventPublisher.publishEvent(new CheckInEvent(this, id, slot));

                return true;
            }
        }
        return false;
    }

    public Map<String, Object> checkOut(String id, String slotId, String username) {
        Optional<Admin> adminOptional = adminRepository.findById(id);
        if (adminOptional.isEmpty()) throw new RuntimeException("Admin not found");
    
        Admin admin = adminOptional.get();
        for (ParkingSlot slot : admin.getParkingSlots()) {
            if (slot.getSlotId().equals(slotId) && slot.getBookedBy().equals(username)) {
                slot.setCheckOutTime(LocalDateTime.now());
    
                // ✅ Ensure Check-in Time Exists
                if (slot.getCheckInTime() == null) {
                    throw new RuntimeException("Check-in time is missing. Cannot calculate duration.");
                }
    
                // ✅ Save Check-out Time Before Duration Calculation
                adminRepository.save(admin);
                
                long durationMinutes = ChronoUnit.MINUTES.between(slot.getCheckInTime(), slot.getCheckOutTime());
                double ratePerMinute = 0.5; // Example rate: $0.5 per minute
                double totalAmount = durationMinutes * ratePerMinute;
                
                // ✅ Publish CheckOut Event
                eventPublisher.publishEvent(new CheckOutEvent(this, id, slot));

                adminRepository.save(admin);
    
                // ✅ Prepare Billing Details
                Map<String, Object> billDetails = new HashMap<>();
                billDetails.put("duration", durationMinutes);
                billDetails.put("amount", totalAmount);
                billDetails.put("checkInTime", slot.getCheckInTime().toString());
                billDetails.put("checkOutTime", slot.getCheckOutTime().toString());

                // ✅ Reset Slot After Returning Bill
                slot.setBooked(false);
                slot.setBookedBy(null);
                slot.setBookingTime(null);
                slot.setCheckInTime(null);
                slot.setCheckOutTime(null);
    
                adminRepository.save(admin);
                return billDetails;
            }
        }
        throw new RuntimeException("No slot reserved for check-out");
    }

}
