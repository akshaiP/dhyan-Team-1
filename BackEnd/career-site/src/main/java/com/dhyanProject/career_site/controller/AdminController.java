package com.dhyanProject.career_site.controller;

import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.service.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private JobPostingService jobPostingService;

    @PostMapping("/job-posting")
    public ResponseEntity<JobPosting> createJobPosting(@RequestBody JobPosting jobPosting) {
        System.out.println("Received signup request: " + jobPosting);
        return ResponseEntity.ok(jobPostingService.createJobPosting(jobPosting));
    }

    @GetMapping("/job-posting")
    public ResponseEntity<List<JobPosting>> getAllJobPostings() {
        return ResponseEntity.ok(jobPostingService.getAllJobPostings());
    }

    @PutMapping("/job-posting/{id}")
    public ResponseEntity<JobPosting> updateJobPosting(@PathVariable Long id, @RequestBody JobPosting jobPosting) {
        jobPosting.setId(id);
        return ResponseEntity.ok(jobPostingService.updateJobPosting(jobPosting));
    }
}
