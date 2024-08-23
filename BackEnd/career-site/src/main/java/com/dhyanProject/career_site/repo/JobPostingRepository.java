package com.dhyanProject.career_site.repo;

import com.dhyanProject.career_site.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting,Long> {
}
