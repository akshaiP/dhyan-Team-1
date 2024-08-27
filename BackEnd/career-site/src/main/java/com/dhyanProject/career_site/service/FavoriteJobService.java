package com.dhyanProject.career_site.service;

import com.dhyanProject.career_site.model.FavoriteJob;
import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.model.Users;
import com.dhyanProject.career_site.repo.FavoriteJobRepository;
import com.dhyanProject.career_site.repo.JobPostingRepository;
import com.dhyanProject.career_site.repo.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteJobService {

    @Autowired
    private FavoriteJobRepository favoriteJobRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Transactional
    public FavoriteJob addToFavorites(Long userId, Long jobId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        FavoriteJob favoriteJob = new FavoriteJob();
        favoriteJob.setUser(user);
        favoriteJob.setJobPosting(jobPosting);

        return favoriteJobRepository.save(favoriteJob);
    }

    @Transactional
    public void removeFromFavorites(Long userId, Long jobId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        favoriteJobRepository.deleteByUserAndJobPosting(user, jobPosting);
    }

    public List<FavoriteJob> getFavoriteJobs(Long userId) {
        return favoriteJobRepository.findByUserId(userId);
    }
}
