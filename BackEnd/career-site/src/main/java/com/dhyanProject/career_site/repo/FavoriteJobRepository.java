package com.dhyanProject.career_site.repo;

import com.dhyanProject.career_site.model.FavoriteJob;
import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteJobRepository extends JpaRepository<FavoriteJob,Long> {
    List<FavoriteJob> findByUserId(Long userId);
    void deleteByUserAndJobPosting(Users user, JobPosting jobPosting);
    void deleteByJobPosting(JobPosting jobPosting);
}
