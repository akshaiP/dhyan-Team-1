package com.dhyanProject.career_site.repo;

import com.dhyanProject.career_site.model.JobApplications;
import com.dhyanProject.career_site.model.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StageRepository extends JpaRepository<Stage,Long> {
    Optional<Stage> findByApplicationAndStageName(JobApplications application, String stageName);
}
