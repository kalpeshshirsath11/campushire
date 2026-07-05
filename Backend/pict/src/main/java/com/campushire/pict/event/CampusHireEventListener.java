package com.campushire.pict.event;

import com.campushire.pict.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class CampusHireEventListener {

    private static final Logger LOGGER = Logger.getLogger(CampusHireEventListener.class.getName());

    @Autowired
    private EmailService emailService;

    @Async
    @EventListener
    public void handleStudentCreated(StudentCreatedEvent event) {
        LOGGER.info("Asynchronously handling StudentCreatedEvent for student: " + event.getUser().getEmail());
        emailService.sendCredentials(event.getUser().getEmail(), event.getRawPassword());
    }

    @Async
    @EventListener
    public void handleDriveCreated(DriveCreatedEvent event) {
        LOGGER.info("Asynchronously handling DriveCreatedEvent for drive: " + event.getDriveTitle() + 
                " from company: " + event.getCompanyName());
        // Future extension: Send push notifications or email alerts to all eligible students
    }

    @Async
    @EventListener
    public void handleApplicationSubmitted(ApplicationSubmittedEvent event) {
        LOGGER.info("Asynchronously handling ApplicationSubmittedEvent. Student ID: " + 
                event.getStudentId() + " applied for Drive ID: " + 
                event.getDriveId());
        // Future extension: Send email confirmations to student
    }

    @Async
    @EventListener
    public void handleApplicationStatusUpdated(ApplicationStatusUpdatedEvent event) {
        LOGGER.info("Asynchronously handling ApplicationStatusUpdatedEvent. Application ID: " + 
                event.getApplicationId() + " status updated to: " + 
                event.getStatus());
        
        String subject = "CampusHire - Application Status Update";
        String body = "Hello,\n\n" +
                "Your application status for recruitment drive '" + event.getDriveTitle() + "' has been updated.\n" +
                "New Status: " + event.getStatus() + "\n" +
                (event.getRemarks() != null ? "Remarks: " + event.getRemarks() + "\n\n" : "\n") +
                "Regards,\n" +
                "Training & Placement Team";
                
        emailService.sendEmail(event.getStudentEmail(), subject, body);
    }
}
