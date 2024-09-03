package com.dhyanProject.career_site.service;

import com.dhyanProject.career_site.model.FavoriteJob;
import com.dhyanProject.career_site.model.JobApplications;
import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.model.Stage;
import com.dhyanProject.career_site.repo.FavoriteJobRepository;
import com.dhyanProject.career_site.repo.JobApplicationsRepository;
import com.dhyanProject.career_site.repo.JobPostingRepository;
import com.dhyanProject.career_site.repo.StageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobPostingService {

    @Autowired
    private JobPostingRepository jobPostingRepository;
    @Autowired
    private JobApplicationsRepository jobApplicationsRepository;

    @Autowired
    private FavoriteJobRepository favoriteJobRepository;

    @Autowired
    private StageRepository stageRepository;

    public JobPosting createJobPosting(JobPosting jobPosting) {
        return jobPostingRepository.save(jobPosting);
    }

    public List<JobPosting> getAllJobPostings() {
        return jobPostingRepository.findAll();
    }

    public JobPosting updateJobPosting(JobPosting jobPosting) {
        if (jobPostingRepository.existsById(jobPosting.getId())) {
            return jobPostingRepository.save(jobPosting);
        } else {
            throw new RuntimeException("Job posting not found");
        }
    }

    @Transactional
    public void deleteJobPosting(Long id) {
            // Find the job posting
            JobPosting jobPosting = jobPostingRepository.findById(id).orElseThrow(() -> new RuntimeException("Job posting not found"));

            // Delete all stages related to job applications of this job posting
            List<JobApplications> jobApplications = jobApplicationsRepository.findByJobPosting(jobPosting);
            for (JobApplications application : jobApplications) {
                stageRepository.deleteByApplication(application);
            }

            // Delete all job applications related to the job posting
            jobApplicationsRepository.deleteByJobPosting(jobPosting);

            // Delete all favorite jobs related to the job posting
            favoriteJobRepository.deleteByJobPosting(jobPosting);

            // Delete the job posting
            jobPostingRepository.delete(jobPosting);
    }
}
