package com.campushire.pict.company.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    @NotBlank(message = "Role offered is required")
    private String roleOffered;

    @NotNull(message = "Package LPA is required")
    @DecimalMin(value = "0.0", message = "Package LPA cannot be negative")
    private Double packageLpa;

    @NotBlank(message = "Location is required")
    private String location;

    private String jobDescription;
    
    private String companyWebsite;
}
