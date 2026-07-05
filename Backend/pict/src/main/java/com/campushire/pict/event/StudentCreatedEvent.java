package com.campushire.pict.event;

import com.campushire.pict.user.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class StudentCreatedEvent extends ApplicationEvent {
    private final User user;
    private final String rawPassword;

    public StudentCreatedEvent(Object source, User user, String rawPassword) {
        super(source);
        this.user = user;
        this.rawPassword = rawPassword;
    }
}
