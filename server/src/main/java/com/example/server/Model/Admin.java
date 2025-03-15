package com.example.server.Model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "admins")
public class Admin {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String location;
    private List<ParkingSlot> parkingSlots;

    public Admin() {}
    public Admin(String id, String username, String email, String password, List<ParkingSlot> parkingSlots) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.parkingSlots = parkingSlots;
    }
    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }

    public List<ParkingSlot> getParkingSlots() {
        return parkingSlots;
    }
    public void setParkingSlots(List<ParkingSlot> parkingSlots) {
        this.parkingSlots = parkingSlots;
    }
}
