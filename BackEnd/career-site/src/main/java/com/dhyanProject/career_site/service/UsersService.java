package com.dhyanProject.career_site.service;

import com.dhyanProject.career_site.model.Users;
import com.dhyanProject.career_site.repo.UsersRepository;
import com.dhyanProject.career_site.security.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public void registerUser(Users user) {
        System.out.println("Registering user: " + user);
        user.setPassword(encoder.encode(user.getPassword()));
        usersRepository.save(user);
    }

    public String loginUser(Users user) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public Optional<Users> getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    public Optional<Users> getUserByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

}
