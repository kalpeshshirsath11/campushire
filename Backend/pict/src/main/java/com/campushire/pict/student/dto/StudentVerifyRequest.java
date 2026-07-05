package com.campushire.pict.student.dto;

import com.campushire.pict.student.VerificationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentVerifyRequest {
    @NotNull(message = "Verification status is required")
    private VerificationStatus status;

    private String remarks;
}
