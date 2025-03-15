package com.example.server.DTO;

import com.example.server.Model.ParkingSlot;

public class ParkingSlotDTO {
    private String checkInTime;
    private String checkOutTime;

    public ParkingSlotDTO(ParkingSlot slot) {
        this.checkInTime = slot.getCheckInTime().toString();
        this.checkOutTime = (slot.getCheckOutTime() != null) ? slot.getCheckOutTime().toString() : "N/A";
    }
}
