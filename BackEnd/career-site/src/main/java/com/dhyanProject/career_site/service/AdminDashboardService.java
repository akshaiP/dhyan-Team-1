package com.dhyanProject.career_site.service;

import com.dhyanProject.career_site.dto.AdminDashboardDTO;
import com.dhyanProject.career_site.model.JobApplications;
import com.dhyanProject.career_site.model.JobPosting;
import com.dhyanProject.career_site.repo.JobApplicationsRepository;
import com.dhyanProject.career_site.repo.JobPostingRepository;
import com.dhyanProject.career_site.repo.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {
    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private JobApplicationsRepository applicationRepository;

    @Autowired
    private UsersRepository userRepository;

    public AdminDashboardDTO getDashboardData() {
        AdminDashboardDTO dto = new AdminDashboardDTO();

        List<JobPosting> jobPostings = jobPostingRepository.findAll();
        Set<String> uniqueCompanies = new HashSet<>();
        for (JobPosting jobPosting : jobPostings) {
            uniqueCompanies.add(jobPosting.getCompanyName());
        }
        dto.setCompaniesCount(uniqueCompanies.size());
        long activeUsersCount = userRepository.count();
        dto.setActiveUsersCount(activeUsersCount);
        dto.setJobPostingsCount(jobPostingRepository.count());

        List<JobApplications> applications = applicationRepository.findAll();
        dto.setTotalApplications(applications.size());

        Map<String, Integer> jobTitleApplications = new HashMap<>();
        for (JobApplications app : applications) {
            String jobTitle = app.getJobPosting().getJobTitle();
            jobTitleApplications.put(jobTitle, jobTitleApplications.getOrDefault(jobTitle, 0) + 1);
        }

        Map<String, Integer> topJobTitleApplications = jobTitleApplications.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(7)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
        dto.setJobTitleApplications(topJobTitleApplications);

        Map<String, Integer> statusCounts = new HashMap<>();
        for (JobApplications app : applications) {
            String status = app.getStatus().name();
            statusCounts.put(status, statusCounts.getOrDefault(status, 0) + 1);
        }
        dto.setStatusCounts(statusCounts);

        return dto;
    }
}
