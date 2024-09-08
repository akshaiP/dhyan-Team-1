package com.dhyanProject.career_site.model;

import jakarta.persistence.*;
import jdk.jfr.Enabled;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notification")
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String message;

    private String type; // NEW_JOB_POST, APPLICATION_STAGE_CHANGED, etc.

    @Column(nullable = false)
    private boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
