package com.example.server.events;

import java.time.LocalDateTime;

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
        if (this.slot.getPaymentMode() == null) {
            this.slot.setPaymentMode(paymentMode);
        }
    }

    public String getId() {
        return id;
    }

    public ParkingSlot getSlot() {
        return slot;
    }

    public String getPaymentMode() {        
        return paymentMode;
    }
}
