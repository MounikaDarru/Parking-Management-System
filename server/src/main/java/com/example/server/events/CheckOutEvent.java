package com.example.server.events;

import java.time.LocalDateTime;

import org.springframework.context.ApplicationEvent;

import com.example.server.Model.ParkingSlot;

public class CheckOutEvent extends ApplicationEvent {
    private final String id;
    private final ParkingSlot slot;

    public CheckOutEvent(Object source, String id, ParkingSlot slot) {
        super(source);
        this.id = id;
        this.slot = slot;

        if (this.slot.getCheckOutTime() == null) {
            this.slot.setCheckOutTime(LocalDateTime.now());
        }
    }

    public String getId() {
        return id;
    }

    public ParkingSlot getSlot() {
        return slot;
    }

}    
