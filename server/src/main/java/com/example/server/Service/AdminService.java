package com.example.server.Service;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.Model.Admin;
import com.example.server.Model.ParkingSlot;
import com.example.server.Repository.AdminRepository;
import com.example.server.events.CheckInEvent;
import com.example.server.events.CheckOutEvent;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    @Lazy
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final Map<String, List<Map<String, String>>> checkedInUsersCache = new ConcurrentHashMap<>();


    public Admin registerAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    public Optional<Admin> findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public List<Admin> findByLocation(String location) {
        return adminRepository.findByLocation(location);
    }

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public Optional<Admin> findById(String id) {
        return adminRepository.findById(id); // Directly return the result
    }

    @EventListener
    public void handleCheckInEvent(CheckInEvent event) {
        String id = event.getId();
        ParkingSlot slot = event.getSlot();

        if (id == null || slot == null) {
            System.out.println("⚠️ Check-in event missing adminId or slot!");
            return;
        }

        checkedInUsersCache.putIfAbsent(id, new ArrayList<>());

        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("checkInTime", slot.getCheckInTime().toString());
        userInfo.put("slotId", slot.getSlotId());
        userInfo.put("username", slot.getBookedBy());

        checkedInUsersCache.get(id).add(userInfo);

        System.out.println("✅ AdminService updated: " + checkedInUsersCache);

    }    

    @EventListener
    public void handleCheckOutEvent(CheckOutEvent event) {
        String id = event.getId();
        ParkingSlot slot = event.getSlot();


        if (!checkedInUsersCache.containsKey(id)) {
            System.out.println("⚠️ Invalid admin ID provided!");
            return;
        }

        List<Map<String, String>> checkedInUsers = checkedInUsersCache.get(id);

        for (Map<String, String> userInfo : checkedInUsers) {
            if (userInfo.get("slotId").equals(slot.getSlotId())) {
                userInfo.put("checkOutTime", (slot.getCheckOutTime() != null) ? slot.getCheckOutTime().toString() : "N/A");
                break;
            }
        }

        System.out.println(slot.getCheckOutTime());

        checkedInUsersCache.put(id, checkedInUsers);
        System.out.println("✅ AdminService updated: User checked out from slot " + slot.getSlotId() + " At " + slot.getCheckOutTime());
    }

    
    public List<Map<String, String>> getCheckedInUsers() {
        
        if (checkedInUsersCache.keySet() == null || checkedInUsersCache.keySet().isEmpty()) {
            System.out.println("⚠️ Invalid admin ID provided!");
            return Collections.emptyList();
        }

        List<Map<String, String>> result = new ArrayList<>();
        for (String key : checkedInUsersCache.keySet()) {
            result.addAll(checkedInUsersCache.getOrDefault(key, Collections.emptyList()));
        }
        return result;
    }
    
}
