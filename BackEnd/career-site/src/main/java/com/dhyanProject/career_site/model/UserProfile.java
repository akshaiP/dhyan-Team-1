package com.dhyanProject.career_site.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;

import java.util.Date;

@Data
@Entity
@Setter
@Table(name = "user_profile")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Users user;

    // Basic Information
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String profilePicture;

    // Education Details
    private String highestQualification;
    private String fieldOfStudy;
    private String college;
    private Integer graduationYear;
    private String grades;

    // Work Experience
    private String totalExperience;
    private String currentEmployer;
    private String currentPosition;
    @Column(columnDefinition = "TEXT")
    private String employmentHistory;

    // Resume and Documents
    private String resume;
    private String portfolio;

    // Additional Information
    private String location;
    private String linkedinProfile;
}