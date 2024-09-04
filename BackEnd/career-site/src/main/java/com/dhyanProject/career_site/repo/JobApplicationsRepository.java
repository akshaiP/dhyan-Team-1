package com.dhyanProject.career_site.repo;

import com.dhyanProject.career_site.model.JobApplications;
import com.dhyanProject.career_site.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationsRepository extends JpaRepository<JobApplications,Long> {
    List<JobApplications> findByUserId(Long userId);
    boolean existsByUserIdAndJobPosting_Id(Long userId, Long jobId);
    List<JobApplications> findByJobPostingId(Long jobId);
    void deleteByJobPosting(JobPosting jobPosting);
    List<JobApplications> findByJobPosting(JobPosting jobPosting);
    JobApplications findByJobPosting_IdAndUser_Id(Long jobId, Long userId);
}
