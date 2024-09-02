package com.dhyanProject.career_site.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "jobPosting")
@NoArgsConstructor
@ToString
public class JobPosting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String companyLogoUrl;
    private String location;
    private String jobTitle;

    @Column(length = 2000)
    private String jobDescription;

    @Column(length = 1000)
    private String requirements;

    private String employmentType; // Full-time, Part-time, Contract, Internship, etc.
    private String jobCategory; // IT, Marketing, Finance, etc.
    private String experienceLevel; // Entry-level, Mid-level, Senior-level, etc.

    private String educationRequirement; // e.g., Bachelor’s Degree, Master’s Degree
    private String skills; // Required skills, separated by commas

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate lastDateToApply;

    private String salaryRange; // e.g., "$50,000 - $70,000 per annum"
    private String currency; // e.g., USD, EUR

    private String contactEmail; // HR or recruiter contact
    private String contactPhone; // Optional: HR or recruiter phone number

    private String benefits; // List of benefits, separated by commas
    private String applicationProcess; // Information about the application process
    private String companyWebsite; // Link to the company's website

    @Column(length = 300)
    private String jobLocationType; // On-site, Remote, Hybrid

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    public enum JobStatus {
        ACTIVE,
        CLOSED,
        DRAFT
    }
}
