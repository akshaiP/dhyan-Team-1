package com.dhyanProject.career_site.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "jobApplications")
public class JobApplications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private JobPosting jobPosting;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    private String resume;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Enumerated(EnumType.STRING)
    private CurrentStage currentStage;
    private LocalDateTime submittedAt;

    public enum ApplicationStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    public enum CurrentStage {
        APPLIED,
        WRITTEN_TEST,
        TECHNICAL_INTERVIEW_1,
        TECHNICAL_INTERVIEW_2,
        HR_ROUND,
        JOB_OFFER
    }
}
