package com.example.server.Controller;

import org.springframework.web.bind.annotation.*;

import com.example.server.Model.Admin;
import com.example.server.Model.ParkingSlot;
import com.example.server.Model.User;
import com.example.server.Service.AdminService;
import com.example.server.Service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // To allow frontend access
public class UserController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    public UserController(UserService userService, AdminService adminService) {
        this.userService = userService;
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.findAll();
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/{id}/parking-slots")
    public ResponseEntity<List<ParkingSlot>> getParkingSlots(@PathVariable String id) {
        return adminService.findById(id)
            .map(admin -> ResponseEntity.ok(admin.getParkingSlots()))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList()));
    }

    @PostMapping("/{id}/reserve/{slotId}")
    public ResponseEntity<String> reserveSlot(@PathVariable String id,  @PathVariable String slotId, @RequestBody User user) {
        boolean success = userService.reserveSlot(id, slotId, user.getUsername());
        if (success) {
            return ResponseEntity.ok("✅ Slot booked successfully");
        } else {
            return ResponseEntity.status(400).body("❌ Slot is already booked or not found");
        }
    }

    @PostMapping("/{id}/checkin/{slotId}")
    public ResponseEntity<String> checkIn(@PathVariable String id, @PathVariable String slotId, @RequestBody User user) {
        boolean success = userService.checkIn(id, slotId, user.getUsername());
        if (success) return ResponseEntity.ok("Check-in successful.");
        return ResponseEntity.status(400).body("Check-in failed. Please check your booking details.");
    }

    @PostMapping("/{id}/checkout/{slotId}")
    public ResponseEntity<Map<String, Object>> checkOut(
        @PathVariable String id, 
        @PathVariable String slotId, 
        @RequestBody Map<String, String> request) {

            String username = request.get("username");
            if (username == null || username.isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Username is required"));
            }

            try {
                Map<String, Object> billDetails = userService.checkOut(id, slotId, username);
                return ResponseEntity.ok(billDetails);
            } catch (RuntimeException e) {
                return ResponseEntity.status(400).body(Collections.singletonMap("error", e.getMessage()));
            }
        }

}
