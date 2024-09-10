package com.dhyanProject.career_site.dto;

import com.dhyanProject.career_site.model.JobApplications;
import com.dhyanProject.career_site.model.Stage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationStatusResponse {
    private Long applicationId;
    private String jobTitle;
    private String companyName;
    private String companyLogoUrl;
    private LocalDateTime submittedAt;
    private JobApplications.ApplicationStatus applicationStatus;
    private JobApplications.CurrentStage currentStage;
    private List<StageResponse> stages;

    @Data
    public static class StageResponse {
        private String stageName;
        private Stage.StageStatus stageStatus;
        private LocalDateTime completedAt;
    }
}
