package com.example.server.events;

import org.springframework.context.ApplicationEvent;

import com.example.server.Model.ParkingSlot;

public class CheckInEvent extends ApplicationEvent {
    private final String id;
    private final ParkingSlot slot;

    public CheckInEvent(Object source, String id, ParkingSlot slot) {
        super(source);
        this.id = id;
        this.slot = slot;
    }

    public String getId() {
        return id;
    }

    public ParkingSlot getSlot() {
        return slot;
    }
}