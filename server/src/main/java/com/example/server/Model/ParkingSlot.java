package com.example.server.Model;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ParkingSlot {
    @Id
    private String id;

    @Column(nullable = false, unique = true) // Ensure `slotId` is not null
    private String slotId;

    private boolean booked;
    private String bookedBy;
    private LocalDateTime bookingTime;  // 🕒 Stores when the slot was booked
    private LocalDateTime checkInTime;  // 🕒 Stores when the user checks in
    private LocalDateTime checkOutTime; // 🕒 Stores when the user checks out
    private String paymentMode;

    public ParkingSlot() {}
    public ParkingSlot(String slotId, boolean booked, String bookedBy, LocalDateTime bookingTime, LocalDateTime checkInTime, LocalDateTime checkOutTime, String paymentMode) {
        this.slotId = slotId;
        this.booked = booked;
        this.bookedBy = bookedBy;
        this.bookingTime = bookingTime;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.paymentMode = paymentMode;
    }

    @PrePersist
    public void generateSlotId() {
        if (this.slotId == null) {
            this.slotId = UUID.randomUUID().toString(); // Generate unique ID
        }
    }

}


