package com.dhyanProject.career_site.security;

import com.dhyanProject.career_site.model.UserProfile;
import com.dhyanProject.career_site.repo.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    public UserProfile createOrUpdateProfile(UserProfile userProfile) {
        Optional<UserProfile> existingProfile = userProfileRepository.findByUserId(userProfile.getUser().getId());

        if (existingProfile.isPresent()) {
            UserProfile profileToUpdate = existingProfile.get();
            profileToUpdate.setFirstName(userProfile.getFirstName());
            profileToUpdate.setLastName(userProfile.getLastName());
            profileToUpdate.setEmail(userProfile.getEmail());
            profileToUpdate.setPhoneNumber(userProfile.getPhoneNumber());
            profileToUpdate.setProfilePicture(userProfile.getProfilePicture());
            profileToUpdate.setHighestQualification(userProfile.getHighestQualification());
            profileToUpdate.setFieldOfStudy(userProfile.getFieldOfStudy());
            profileToUpdate.setCollege(userProfile.getCollege());
            profileToUpdate.setGraduationYear(userProfile.getGraduationYear());
            profileToUpdate.setGrades(userProfile.getGrades());
            profileToUpdate.setTotalExperience(userProfile.getTotalExperience());
            profileToUpdate.setCurrentEmployer(userProfile.getCurrentEmployer());
            profileToUpdate.setCurrentPosition(userProfile.getCurrentPosition());
            profileToUpdate.setEmploymentHistory(userProfile.getEmploymentHistory());
            profileToUpdate.setResume(userProfile.getResume());
            profileToUpdate.setPortfolio(userProfile.getPortfolio());
            profileToUpdate.setLocation(userProfile.getLocation());
            profileToUpdate.setLinkedinProfile(userProfile.getLinkedinProfile());
            return userProfileRepository.save(profileToUpdate);
        } else {
            return userProfileRepository.save(userProfile);
        }
    }

    public Optional<UserProfile> getUserProfile(Long userId) {
        return userProfileRepository.findByUserId(userId);
    }

    public UserProfile getUserProfileById(Long id) {
        return userProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User Profile not found"));
    }
}
