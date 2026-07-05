package com.campushire.pict.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private Long id;
    private String name;
    private String roleOffered;
    private Double packageLpa;
    private String location;
    private String jobDescription;
    private String companyWebsite;
    private String createdByEmail; // Avoid returning the full User entity to API clients
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
