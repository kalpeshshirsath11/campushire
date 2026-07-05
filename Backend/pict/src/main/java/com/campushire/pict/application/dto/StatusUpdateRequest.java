package com.campushire.pict.application.dto;

import com.campushire.pict.application.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private String remarks;
}
