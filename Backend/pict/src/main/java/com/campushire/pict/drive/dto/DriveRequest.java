package com.campushire.pict.drive.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DriveRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotBlank(message = "Drive title is required")
    private String title;

    private String description;

    @NotNull(message = "Application deadline is required")
    private LocalDateTime deadline;

    @NotNull(message = "Minimum CGPA is required")
    @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
    private Double minimumCgpa;

    @NotNull(message = "Allowed backlog count is required")
    @Min(value = 0, message = "Backlog count cannot be negative")
    private Integer allowedBacklogs;

    @NotNull(message = "Minimum 10th percentage is required")
    @DecimalMin(value = "0.0", message = "Percentage cannot be negative")
    private Double minimumTenthPercentage;

    @NotNull(message = "Minimum 12th percentage is required")
    @DecimalMin(value = "0.0", message = "Percentage cannot be negative")
    private Double minimumTwelfthPercentage;

    @NotEmpty(message = "Eligible branches are required")
    private List<String> eligibleBranches;

    private String bondDetails;

    private LocalDate driveDate;
}
