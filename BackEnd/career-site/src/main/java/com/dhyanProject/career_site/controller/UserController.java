package com.dhyanProject.career_site.controller;

import com.dhyanProject.career_site.dto.ApplicationRequest;
import com.dhyanProject.career_site.dto.JobApplicationStatusResponse;
import com.dhyanProject.career_site.model.*;
import com.dhyanProject.career_site.service.FavoriteJobService;
import com.dhyanProject.career_site.service.JobApplicationsService;
import com.dhyanProject.career_site.service.NotificationService;
import com.dhyanProject.career_site.security.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private JobApplicationsService applicationService;

    @Autowired
    private FavoriteJobService favoriteJobService;

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/jobs")
    public ResponseEntity<List<JobPosting>> getAllActiveJobs() {
        return ResponseEntity.ok(applicationService.getAllActiveJobs());
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestBody ApplicationRequest request) {
        try {
            JobApplications application = applicationService.applyForJob(request);
            return ResponseEntity.ok(application);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/apply")
    public ResponseEntity<?> unApplyForJob(@RequestBody ApplicationRequest request) {
        try {
            applicationService.removeApplication(request);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplications>> getUserApplications(@RequestParam Long userId) {
        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }

    @PostMapping("/favorite")
    public ResponseEntity<FavoriteJob> addToFavorites(@RequestParam Long userId, @RequestParam Long jobId) {
        return ResponseEntity.ok(favoriteJobService.addToFavorites(userId, jobId));
    }

    @DeleteMapping("/favorite")
    public ResponseEntity<Void> removeFromFavorites(@RequestParam Long userId, @RequestParam Long jobId) {
        favoriteJobService.removeFromFavorites(userId, jobId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorite")
    public ResponseEntity<List<FavoriteJob>> getFavoriteJobs(@RequestParam Long userId) {
        return ResponseEntity.ok(favoriteJobService.getFavoriteJobs(userId));
    }

    @GetMapping("/application-status")
    public ResponseEntity<List<JobApplicationStatusResponse>> getApplicationStatus(@RequestParam Long userId) {
        List<JobApplicationStatusResponse> applicationStatuses = applicationService.getUserApplicationsWithStages(userId);
        return ResponseEntity.ok(applicationStatuses);
    }

    @PostMapping("/profile")
    public ResponseEntity<UserProfile> createOrUpdateProfile(@RequestBody UserProfile userProfile) {
        UserProfile updatedProfile = userProfileService.createOrUpdateProfile(userProfile);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getUserProfile(@RequestParam Long userId) {
        Optional<UserProfile> userProfile = userProfileService.getUserProfile(userId);
        return userProfile.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@RequestParam Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotificationsForUser(userId));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id) {
        notificationService.markNotificationAsRead(id);
        return ResponseEntity.noContent().build();
    }
}
