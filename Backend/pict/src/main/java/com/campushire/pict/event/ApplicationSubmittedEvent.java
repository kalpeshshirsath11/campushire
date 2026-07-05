package com.campushire.pict.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ApplicationSubmittedEvent extends ApplicationEvent {
    private final Long applicationId;
    private final Long studentId;
    private final Long driveId;

    public ApplicationSubmittedEvent(Object source, Long applicationId, Long studentId, Long driveId) {
        super(source);
        this.applicationId = applicationId;
        this.studentId = studentId;
        this.driveId = driveId;
    }
}
