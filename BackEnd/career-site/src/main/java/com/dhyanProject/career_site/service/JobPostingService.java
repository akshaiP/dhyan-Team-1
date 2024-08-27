package com.dhyanProject.career_site.service;

import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.repo.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobPostingService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

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

}
