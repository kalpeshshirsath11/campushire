package com.campushire.pict.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class DriveCreatedEvent extends ApplicationEvent {
    private final Long driveId;
    private final String driveTitle;
    private final String companyName;

    public DriveCreatedEvent(Object source, Long driveId, String driveTitle, String companyName) {
        super(source);
        this.driveId = driveId;
        this.driveTitle = driveTitle;
        this.companyName = companyName;
    }
}
