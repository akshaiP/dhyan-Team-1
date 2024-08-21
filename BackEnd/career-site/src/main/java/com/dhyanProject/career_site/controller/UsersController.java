package com.dhyanProject.career_site.controller;

import com.dhyanProject.career_site.model.Users;
import com.dhyanProject.career_site.service.JWTService;
import com.dhyanProject.career_site.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ResponseEntity<String> login(@RequestBody Users user) {
        try {
            String token = userService.loginUser(user);
            Optional<Users> foundUser = userService.getUserByUsername(user.getUsername());

            if (foundUser.isPresent()) {
                if (foundUser.get().getRole() == Users.Role.ADMIN) {
                    return ResponseEntity.ok("Login successful. Token: " + token + ". Redirect to Admin Dashboard");
                } else {
                    return ResponseEntity.ok("Login successful. Token: " + token + ". Redirect to User Dashboard");
                }
            } else {
                return ResponseEntity.status(401).body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Users user) {
        System.out.println("Received signup request: " + user);
        Optional<Users> existingUser = userService.getUserByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        } else {
            user.setRole(Users.Role.USER);
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> usersList = userService.getAllUsers();
        return ResponseEntity.ok(usersList);
    }
}
