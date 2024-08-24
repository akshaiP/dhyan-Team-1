package com.dhyanProject.career_site.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "stages")
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private JobApplications application;

    private String stageName;

    @Enumerated(EnumType.STRING)
    private StageStatus stageStatus;
    private LocalDateTime completedAt;

    public enum StageStatus {
        PENDING,
        COMPLETED,
        REJECTED
    }
}
