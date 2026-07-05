package com.campushire.pict.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ApplicationStatusUpdatedEvent extends ApplicationEvent {
    private final Long applicationId;
    private final String studentEmail;
    private final String driveTitle;
    private final String status;
    private final String remarks;

    public ApplicationStatusUpdatedEvent(Object source, Long applicationId, String studentEmail, String driveTitle, String status, String remarks) {
        super(source);
        this.applicationId = applicationId;
        this.studentEmail = studentEmail;
        this.driveTitle = driveTitle;
        this.status = status;
        this.remarks = remarks;
    }
}
