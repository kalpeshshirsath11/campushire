package com.campushire.pict.company;

import com.campushire.pict.common.Auditable;
import com.campushire.pict.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "role_offered", nullable = false)
    private String roleOffered;

    @Column(name = "package_lpa", nullable = false)
    private Double packageLpa;

    @Column(nullable = false)
    private String location;

    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription;

    @Column(name = "company_website")
    private String companyWebsite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}
