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

    @Column(length = 1000)
    private String jobDescription;

    @Column(length = 1000)
    private String requirements;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate lastDateToApply;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    public enum JobStatus {
        ACTIVE,
        CLOSED,
        DRAFT
    }
}
