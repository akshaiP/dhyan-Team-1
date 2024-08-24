package com.dhyanProject.career_site.service;

import com.dhyanProject.career_site.dto.ApplicationRequest;
import com.dhyanProject.career_site.model.JobApplications;
import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.model.Stage;
import com.dhyanProject.career_site.model.Users;
import com.dhyanProject.career_site.repo.JobApplicationsRepository;
import com.dhyanProject.career_site.repo.JobPostingRepository;
import com.dhyanProject.career_site.repo.StageRepository;
import com.dhyanProject.career_site.repo.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    // Fetch all active job postings
    public List<JobPosting> getAllActiveJobs() {
        return jobPostingRepository.findByStatus(JobPosting.JobStatus.ACTIVE);
    }

    // Apply for a job
    public JobApplications applyForJob(ApplicationRequest request) {
        JobPosting job = jobPostingRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Users user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobApplications application = new JobApplications();
        application.setJobPosting(job);
        application.setUser(user);
        application.setResume(request.getResume());
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

}
