package com.campushire.pict.drive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriveResponse {
    private Long id;
    private Long companyId;
    private String companyName;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private Double minimumCgpa;
    private Integer allowedBacklogs;
    private Double minimumTenthPercentage;
    private Double minimumTwelfthPercentage;
    private List<String> eligibleBranches;
    private String bondDetails;
    private LocalDate driveDate;
    private String createdByEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
