package com.campushire.pict.student.dto;

import com.campushire.pict.student.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String prn;
    private String fullName;
    private String branch;
    private Double cgpa;
    private Double tenthPercentage;
    private Double twelfthPercentage;
    private Integer backlogs;
    private String phone;
    private String personalEmail;
    private String linkedinUrl;
    private String githubUrl;
    private String address;

    // Document links
    private String resumeLink;
    private String resumeFileName;
    private String tenthMarksheetLink;
    private String tenthMarksheetFileName;
    private String twelfthMarksheetLink;
    private String twelfthMarksheetFileName;
    private String diplomaMarksheetLink;
    private String diplomaMarksheetFileName;
    private String degreeResultLink;
    private String degreeResultFileName;
    private String aadhaarLink;
    private String aadhaarFileName;
    private String photoLink;
    private String photoFileName;

    private Boolean profileCompleted;
    private VerificationStatus verificationStatus;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
