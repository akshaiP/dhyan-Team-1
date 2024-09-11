package com.dhyanProject.career_site.controller;

import com.dhyanProject.career_site.dto.AdminDashboardDTO;
import com.dhyanProject.career_site.model.*;
import com.dhyanProject.career_site.security.UserProfileService;
import com.dhyanProject.career_site.service.*;
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
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UsersService usersService;
    @Autowired
    private AdminDashboardService dashboardService;

    @PostMapping("/job-posting")
    public ResponseEntity<JobPosting> createJobPosting(@RequestBody JobPosting jobPosting) {
        JobPosting createdJob = jobPostingService.createJobPosting(jobPosting);

        // Notify all users (with the USER role) of the new job posting
        List<Users> users = usersService.getAllUsers();

        users.stream()
                .filter(user -> user.getRole() == Users.Role.USER)  // Filter by role
                .forEach(user -> notificationService.createNotification(
                        user.getId(),
                        "New job posted: " + jobPosting.getJobTitle(),
                        "NEW_JOB_POST"
                ));

        return ResponseEntity.ok(createdJob);
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
        JobApplications updatedApplication = jobApplicationsService.updateApplicationStatus(id, status);

        UserProfile userProfile = updatedApplication.getUserProfile();
        if (userProfile != null && userProfile.getUser() != null) {
            // Include the company name in the notification message
            String companyName = updatedApplication.getJobPosting().getCompanyName();
            notificationService.createNotification(
                    userProfile.getUser().getId(),
                    "Your application for " + companyName + " has been " + status,
                    "APPLICATION_STATUS_CHANGED"
            );
        }
        return ResponseEntity.ok(updatedApplication);
    }

    // Update the stage and status of an accepted application
    @PutMapping("/applications/{id}/stage")
    public ResponseEntity<JobApplications> updateApplicationStage(@PathVariable Long id,
                                                                  @RequestParam JobApplications.CurrentStage newStage,
                                                                  @RequestParam Stage.StageStatus stageStatus) {

        JobApplications updatedApplication = jobApplicationsService.updateApplicationStage(id, newStage, stageStatus);

        UserProfile userProfile = updatedApplication.getUserProfile();
        if (userProfile != null && userProfile.getUser() != null) {
            String companyName = updatedApplication.getJobPosting().getCompanyName();
            notificationService.createNotification(
                    userProfile.getUser().getId(),
                    "Your application for " + companyName + " has been updated to stage: " + newStage,
                    "APPLICATION_STAGE_CHANGED"
            );
        }
        return ResponseEntity.ok(updatedApplication);
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

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboardData() {
        AdminDashboardDTO dto = dashboardService.getDashboardData();
        return ResponseEntity.ok(dto);
    }

}
