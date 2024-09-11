package com.dhyanProject.career_site.controller;

import com.dhyanProject.career_site.model.Users;
import com.dhyanProject.career_site.security.JWTService;
import com.dhyanProject.career_site.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class UsersController {

    @Autowired
    private UsersService userService;

    @Autowired
    private JWTService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        try {
            String token = userService.loginUser(user);
            Optional<Users> foundUser = userService.getUserByUsername(user.getUsername());

            if (foundUser.isPresent()) {
                String role = foundUser.get().getRole().name();
                String redirectUrl = role.equals("ADMIN") ? "Admin Dashboard" : "User Dashboard";
                Long userId = foundUser.get().getId();

                return ResponseEntity.ok().body(Map.of(
                        "message", "Login successful",
                        "token", token,
                        "role", role,
                        "userId", userId,
                        "redirect", redirectUrl
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Users user) {
        System.out.println("Received signup request: " + user);
        Optional<Users> existingUserByEmail = userService.getUserByEmail(user.getEmail());
        if (existingUserByEmail.isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        Optional<Users> existingUserByUsername = userService.getUserByUsername(user.getUsername());
        if (existingUserByUsername.isPresent()) {
            return ResponseEntity.badRequest().body("Username already in use");
        }
        user.setRole(Users.Role.USER);
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

}
