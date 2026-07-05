package com.campushire.pict.email;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
    void sendCredentials(String to, String rawPassword);
    void sendPasswordReset(String to, String token);
}
