package com.dhyanProject.career_site.service;

import com.dhyanProject.career_site.dto.ApplicationRequest;
import com.dhyanProject.career_site.dto.JobApplicationStatusResponse;
import com.dhyanProject.career_site.model.*;
import com.dhyanProject.career_site.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobApplicationsService {

    @Autowired
    private JobApplicationsRepository applicationRepository;
    @Autowired
    private JobPostingRepository jobPostingRepository;
    @Autowired
    private UsersRepository userRepository;
    @Autowired
    private StageRepository stageRepository;
    @Autowired
    private UserProfileRepository userProfileRepository;

    // Fetch all active job postings
    public List<JobPosting> getAllActiveJobs() {
        return jobPostingRepository.findByStatus(JobPosting.JobStatus.ACTIVE);
    }

    // Apply for a job
    public JobApplications applyForJob(ApplicationRequest request) {
        // Check if an application already exists
        if (applicationRepository.existsByUserIdAndJobPosting_Id(request.getUserId(), request.getJobId())) {
            throw new IllegalStateException("Application already exists for this job");
        }

        JobPosting job = jobPostingRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Users user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile userProfile = userProfileRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        JobApplications application = new JobApplications();
        application.setJobPosting(job);
        application.setUser(user);
        application.setUserProfile(userProfile);
        application.setStatus(JobApplications.ApplicationStatus.PENDING);
        application.setCurrentStage(JobApplications.CurrentStage.APPLIED);
        application.setSubmittedAt(LocalDateTime.now());

        // Save application first to generate an ID
        JobApplications savedApplication = applicationRepository.save(application);

        // Create an initial stage entry
        Stage initialStage = new Stage();
        initialStage.setApplication(savedApplication);
        initialStage.setStageName(JobApplications.CurrentStage.APPLIED.name());
        initialStage.setStageStatus(Stage.StageStatus.PENDING);
        initialStage.setCompletedAt(null);
        stageRepository.save(initialStage);

        return savedApplication;
    }

    // Retrieve all applications of a specific user
    public List<JobApplications> getUserApplications(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<JobApplications> getAllApplications() {
        return applicationRepository.findAll();
    }

    // Fetch an application by ID
    public JobApplications getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    // Method to update the status of an application
    public JobApplications updateApplicationStatus(Long applicationId, JobApplications.ApplicationStatus newStatus) {
        JobApplications application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(newStatus);

        return applicationRepository.save(application);
    }

    // Method to update the stage of an accepted application
    public JobApplications updateApplicationStage(Long applicationId, JobApplications.CurrentStage newStage, Stage.StageStatus stageStatus) {
        JobApplications application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Prevent stage updates if the application is rejected
        if (application.getStatus() == JobApplications.ApplicationStatus.REJECTED) {
            throw new RuntimeException("Cannot update stage for a rejected application");
        }

        // Ensure application is accepted before updating the stage
        if (application.getStatus() != JobApplications.ApplicationStatus.ACCEPTED) {
            throw new RuntimeException("Application must be in ACCEPTED status to update stage");
        }

        // Mark the previous stage as completed if moving to a new stage
        if (application.getCurrentStage() != null && !application.getCurrentStage().equals(newStage)) {
            Stage previousStage = stageRepository.findByApplicationAndStageName(application, application.getCurrentStage().name())
                    .orElseThrow(() -> new RuntimeException("Previous stage not found"));
            previousStage.setStageStatus(Stage.StageStatus.COMPLETED);
            previousStage.setCompletedAt(LocalDateTime.now());
            stageRepository.save(previousStage);
        }
        // Update current stage
        application.setCurrentStage(newStage);

        // Update or create a new stage in Stage table
        Stage stage = stageRepository.findByApplicationAndStageName(application, newStage.name())
                .orElse(new Stage()); // Create a new stage if not found

        stage.setApplication(application);
        stage.setStageName(newStage.name());
        stage.setStageStatus(stageStatus);

        if (stageStatus == Stage.StageStatus.COMPLETED || stageStatus == Stage.StageStatus.REJECTED) {
            stage.setCompletedAt(LocalDateTime.now());
        } else {
            stage.setCompletedAt(null);
        }
        stageRepository.save(stage);

        // If the stage is rejected, update the overall application status
        if (stageStatus == Stage.StageStatus.REJECTED) {
            application.setStatus(JobApplications.ApplicationStatus.REJECTED);
        }
        return applicationRepository.save(application);
    }

    public List<JobApplicationStatusResponse> getUserApplicationsWithStages(Long userId) {
        List<JobApplications> applications = applicationRepository.findByUserId(userId);
        List<JobApplicationStatusResponse> applicationStatusResponses = new ArrayList<>();

        for (JobApplications application : applications) {
            JobApplicationStatusResponse response = new JobApplicationStatusResponse();
            response.setApplicationId(application.getId());
            response.setJobTitle(application.getJobPosting().getJobTitle());
            response.setCompanyName(application.getJobPosting().getCompanyName());
            response.setSubmittedAt(application.getSubmittedAt());
            response.setApplicationStatus(application.getStatus());
            response.setCurrentStage(application.getCurrentStage());

            // Fetch stages for each application
            List<Stage> stages = stageRepository.findByApplication(application);
            List<JobApplicationStatusResponse.StageResponse> stageResponses = new ArrayList<>();

            for (Stage stage : stages) {
                JobApplicationStatusResponse.StageResponse stageResponse = new JobApplicationStatusResponse.StageResponse();
                stageResponse.setStageName(stage.getStageName());
                stageResponse.setStageStatus(stage.getStageStatus());
                stageResponse.setCompletedAt(stage.getCompletedAt());
                stageResponses.add(stageResponse);
            }

            response.setStages(stageResponses);
            applicationStatusResponses.add(response);
        }

        return applicationStatusResponses;
    }

    public List<JobApplications> getApplicationsByJobId(Long jobId) {
        return applicationRepository.findByJobPostingId(jobId);
    }

    @Transactional
    public void removeApplication(ApplicationRequest request) {
        JobApplications application = applicationRepository.findByJobPosting_IdAndUser_Id(request.getJobId(), request.getUserId());

        if (application != null) {
            // Remove all stages associated with this application
            List<Stage> stages = stageRepository.findByApplication(application);
            stageRepository.deleteAll(stages); // Delete stages

            // Now remove the application itself
            applicationRepository.delete(application);
        } else {
            throw new IllegalStateException("Application not found");
        }
    }
}