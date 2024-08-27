package com.dhyanProject.career_site.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name="favoriteJob")
public class FavoriteJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Users user;
    @ManyToOne
    private JobPosting jobPosting;
}
