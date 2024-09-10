package com.dhyanProject.career_site.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private long companiesCount;
    private long activeUsersCount;
    private long jobPostingsCount;
    private long totalApplications;
    private Map<String, Integer> jobTitleApplications;
    private Map<String, Integer> statusCounts;
}
