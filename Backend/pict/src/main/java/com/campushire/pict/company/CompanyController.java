package com.campushire.pict.company;

import com.campushire.pict.common.ApiResponse;
import com.campushire.pict.company.dto.*;
import com.campushire.pict.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER')")
    public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CompanyRequest request) {
        CompanyResponse response = companyService.createCompany(request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Company registered successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<List<CompanyResponse>>> getAllCompanies() {
        List<CompanyResponse> response = companyService.getAllCompanies();
        return ResponseEntity.ok(ApiResponse.success("Companies fetched successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(@PathVariable Long id) {
        CompanyResponse response = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.success("Company fetched successfully", response));
    }
}
