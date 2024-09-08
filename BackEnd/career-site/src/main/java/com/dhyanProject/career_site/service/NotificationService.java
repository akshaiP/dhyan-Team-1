package com.dhyanProject.career_site.service;

import com.dhyanProject.career_site.model.Notification;
import com.dhyanProject.career_site.repo.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    public void createNotification(Long userId, String message, String type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);
    }

    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
