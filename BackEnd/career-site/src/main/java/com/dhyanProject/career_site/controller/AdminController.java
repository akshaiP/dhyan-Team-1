package com.dhyanProject.career_site.controller;

import com.dhyanProject.career_site.model.JobApplications;
import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.model.Stage;
import com.dhyanProject.career_site.model.UserProfile;
import com.dhyanProject.career_site.service.JobApplicationsService;
import com.dhyanProject.career_site.service.JobPostingService;
import com.dhyanProject.career_site.service.UserProfileService;
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
    @Autowired
    private JobApplicationsService jobApplicationsService;
    @Autowired
    private UserProfileService userProfileService;

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

    @DeleteMapping("/job-posting/{id}")
    public ResponseEntity<Void> deleteJobPosting(@PathVariable Long id) {
        jobPostingService.deleteJobPosting(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplications>> getAllApplications() {
        return ResponseEntity.ok(jobApplicationsService.getAllApplications());
    }

    // View a specific application by ID
    @GetMapping("/applications/{id}")
    public ResponseEntity<JobApplications> getApplicationById(@PathVariable Long id) {
        JobApplications application = jobApplicationsService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    // Update the status of an application
    @PutMapping("/applications/{id}/status")
    public ResponseEntity<JobApplications> updateApplicationStatus(@PathVariable Long id,
                                                                   @RequestParam JobApplications.ApplicationStatus status) {
        return ResponseEntity.ok(jobApplicationsService.updateApplicationStatus(id, status));
    }

    // Update the stage and status of an accepted application
    @PutMapping("/applications/{id}/stage")
    public ResponseEntity<JobApplications> updateApplicationStage(@PathVariable Long id,
                                                                  @RequestParam JobApplications.CurrentStage newStage,
                                                                  @RequestParam Stage.StageStatus stageStatus) {
        return ResponseEntity.ok(jobApplicationsService.updateApplicationStage(id, newStage, stageStatus));
    }

    // View applications by job ID
    @GetMapping("/applications/job/{jobId}")
    public ResponseEntity<List<JobApplications>> getApplicationsByJobId(@PathVariable Long jobId) {
        List<JobApplications> applications = jobApplicationsService.getApplicationsByJobId(jobId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/user-profile/{id}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable Long id) {
        UserProfile userProfile = userProfileService.getUserProfileById(id);
        return ResponseEntity.ok(userProfile);
    }

}
