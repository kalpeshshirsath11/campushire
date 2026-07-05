package com.campushire.pict.student;

import com.campushire.pict.common.Auditable;
import com.campushire.pict.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String prn; // Permanent Registration Number

    @Column(name = "full_name")
    private String fullName;

    private String branch;

    private Double cgpa;

    @Column(name = "tenth_percentage")
    private Double tenthPercentage;

    @Column(name = "twelfth_percentage")
    private Double twelfthPercentage;

    private Integer backlogs;

    private String phone;

    @Column(name = "personal_email")
    private String personalEmail;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    private String address;

    // Document links and filenames (stored as GDrive URLs as per prompt)
    @Column(name = "resume_link")
    private String resumeLink;

    @Column(name = "resume_file_name")
    private String resumeFileName;

    @Column(name = "tenth_marksheet_link")
    private String tenthMarksheetLink;

    @Column(name = "tenth_marksheet_file_name")
    private String tenthMarksheetFileName;

    @Column(name = "twelfth_marksheet_link")
    private String twelfthMarksheetLink;

    @Column(name = "twelfth_marksheet_file_name")
    private String twelfthMarksheetFileName;

    @Column(name = "diploma_marksheet_link")
    private String diplomaMarksheetLink;

    @Column(name = "diploma_marksheet_file_name")
    private String diplomaMarksheetFileName;

    @Column(name = "degree_result_link")
    private String degreeResultLink;

    @Column(name = "degree_result_file_name")
    private String degreeResultFileName;

    @Column(name = "aadhaar_link")
    private String aadhaarLink;

    @Column(name = "aadhaar_file_name")
    private String aadhaarFileName;

    @Column(name = "photo_link")
    private String photoLink;

    @Column(name = "photo_file_name")
    private String photoFileName;

    @Column(name = "profile_completed", nullable = false)
    @Builder.Default
    private Boolean profileCompleted = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    private String remarks;
}
