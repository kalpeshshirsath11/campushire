package com.campushire.pict.drive;

import com.campushire.pict.common.Auditable;
import com.campushire.pict.company.Company;
import com.campushire.pict.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "drives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Drive extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(name = "minimum_cgpa", nullable = false)
    private Double minimumCgpa;

    @Column(name = "allowed_backlogs", nullable = false)
    private Integer allowedBacklogs;

    @Column(name = "minimum_tenth_percentage", nullable = false)
    private Double minimumTenthPercentage;

    @Column(name = "minimum_twelfth_percentage", nullable = false)
    private Double minimumTwelfthPercentage;

    @Column(name = "eligible_branches", nullable = false)
    private String eligibleBranches; // Stored as comma-separated values (e.g. "CS,IT,ENTC")

    @Column(name = "bond_details", columnDefinition = "TEXT")
    private String bondDetails;

    @Column(name = "drive_date")
    private LocalDate driveDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}
