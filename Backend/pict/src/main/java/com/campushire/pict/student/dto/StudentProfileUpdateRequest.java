package com.campushire.pict.student.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentProfileUpdateRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Branch is required")
    private String branch;

    @NotNull(message = "CGPA is required")
    @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "CGPA cannot exceed 10.0")
    private Double cgpa;

    @NotNull(message = "10th percentage is required")
    @DecimalMin(value = "0.0", message = "Percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Percentage cannot exceed 100.0")
    private Double tenthPercentage;

    @NotNull(message = "12th percentage is required")
    @DecimalMin(value = "0.0", message = "Percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Percentage cannot exceed 100.0")
    private Double twelfthPercentage;

    @NotNull(message = "Backlog count is required")
    @Min(value = 0, message = "Backlog count cannot be negative")
    private Integer backlogs;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Personal email is required")
    private String personalEmail;

    private String linkedinUrl;
    private String githubUrl;
    private String address;

    // Document links
    @NotBlank(message = "Resume Google Drive link is required")
    private String resumeLink;
    @NotBlank(message = "Resume file name is required")
    private String resumeFileName;

    @NotBlank(message = "10th marksheet link is required")
    private String tenthMarksheetLink;
    @NotBlank(message = "10th marksheet file name is required")
    private String tenthMarksheetFileName;

    @NotBlank(message = "12th marksheet link is required")
    private String twelfthMarksheetLink;
    @NotBlank(message = "12th marksheet file name is required")
    private String twelfthMarksheetFileName;

    private String diplomaMarksheetLink;
    private String diplomaMarksheetFileName;

    @NotBlank(message = "Degree result link is required")
    private String degreeResultLink;
    @NotBlank(message = "Degree result file name is required")
    private String degreeResultFileName;

    @NotBlank(message = "Aadhaar link is required")
    private String aadhaarLink;
    @NotBlank(message = "Aadhaar file name is required")
    private String aadhaarFileName;

    @NotBlank(message = "Photo link is required")
    private String photoLink;
    @NotBlank(message = "Photo file name is required")
    private String photoFileName;
}
