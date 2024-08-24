package com.dhyanProject.career_site.controller;

import com.dhyanProject.career_site.dto.ApplicationRequest;
import com.dhyanProject.career_site.model.JobApplications;
import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.service.JobApplicationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private JobApplicationsService applicationService;

    @GetMapping("/jobs")
    public ResponseEntity<List<JobPosting>> getAllActiveJobs() {
        return ResponseEntity.ok(applicationService.getAllActiveJobs());
    }

    @PostMapping("/apply")
    public ResponseEntity<JobApplications> applyForJob(@RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyForJob(request));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplications>> getUserApplications(@RequestParam Long userId) {
        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }
}
