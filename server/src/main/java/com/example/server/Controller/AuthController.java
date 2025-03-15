package com.example.server.Controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.DTO.LoginRequest;
import com.example.server.Model.Admin;
import com.example.server.Model.User;
import com.example.server.Service.AdminService;
import com.example.server.Service.UserService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public String register() {
        return "Register Page";
    }

    @GetMapping("/login")
    public String login() {
        return "Login Page";
    }

    @GetMapping("/joinus")
    public String joinUs() {
        return "Join Us Page";
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/joinus")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        if (userService.findByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }
        return ResponseEntity.ok(adminService.registerAdmin(admin));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        Optional<User> user = userService.findByEmail(request.getEmail());
        Optional<Admin> admin = adminService.findByEmail(request.getEmail());

        if (user.isPresent() && passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "role", "user", "username", user.get().getUsername()));
        } else if (admin.isPresent() && passwordEncoder.matches(request.getPassword(), admin.get().getPassword())) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "role", "admin", "id", admin.get().getId(), "username", admin.get().getUsername()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }


}
