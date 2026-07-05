package com.campushire.pict.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger LOGGER = Logger.getLogger(EmailServiceImpl.class.getName());

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String body) {
        LOGGER.info("Attempting to send email to: " + to + " with subject: " + subject);
        if (mailSender == null) {
            LOGGER.warning("JavaMailSender bean is not initialized. Logging mail content instead.");
            logMockEmail(to, subject, body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            LOGGER.info("Email sent successfully to: " + to);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Failed to send email to " + to + ". Error: " + ex.getMessage(), ex);
            LOGGER.warning("Falling back to logging email for development.");
            logMockEmail(to, subject, body);
        }
    }

    @Override
    public void sendCredentials(String to, String rawPassword) {
        String subject = "Welcome to CampusHire - Your Account Credentials";
        String body = "Hello,\n\n" +
                "Your CampusHire student account has been created.\n" +
                "Please use the following credentials to login:\n" +
                "Username/Email: " + to + "\n" +
                "Password: " + rawPassword + "\n\n" +
                "IMPORTANT: You are required to change your password upon your first login.\n\n" +
                "Regards,\n" +
                "Training & Placement Office";
        sendEmail(to, subject, body);
    }

    @Override
    public void sendPasswordReset(String to, String token) {
        String subject = "CampusHire - Password Reset Request";
        String body = "Hello,\n\n" +
                "You requested to reset your password. Use the following reset token:\n" +
                "Token: " + token + "\n\n" +
                "This token is valid for 15 minutes.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Regards,\n" +
                "CampusHire Team";
        sendEmail(to, subject, body);
    }

    private void logMockEmail(String to, String subject, String body) {
        System.out.println("========== MOCK EMAIL SENT ==========");
        System.out.println("TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("BODY:\n" + body);
        System.out.println("=====================================");
    }
}
