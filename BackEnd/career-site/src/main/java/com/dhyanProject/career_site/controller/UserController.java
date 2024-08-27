package com.dhyanProject.career_site.controller;

import com.dhyanProject.career_site.dto.ApplicationRequest;
import com.dhyanProject.career_site.model.FavoriteJob;
import com.dhyanProject.career_site.model.JobApplications;
import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.service.FavoriteJobService;
import com.dhyanProject.career_site.service.JobApplicationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private JobApplicationsService applicationService;

    @Autowired
    private FavoriteJobService favoriteJobService;

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
}
