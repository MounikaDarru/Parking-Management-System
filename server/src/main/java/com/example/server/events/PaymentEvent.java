package com.example.server.events;

import org.springframework.context.ApplicationEvent;

import com.example.server.Model.ParkingSlot;

public class PaymentEvent extends ApplicationEvent {
    private final String id;
    private final ParkingSlot slot;
    private final String paymentMode;
    

    public PaymentEvent(Object source, String id, ParkingSlot slot, String paymentMode) {
        super(source);
        this.id = id;
        this.slot = slot;
        this.paymentMode = paymentMode;
    }

    public String getId() {
        return id;
    }

    public ParkingSlot getSlot() {
        return slot;
    }
}
