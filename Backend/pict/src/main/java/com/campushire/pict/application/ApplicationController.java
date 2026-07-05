package com.campushire.pict.application;

import com.campushire.pict.application.dto.*;
import com.campushire.pict.common.ApiResponse;
import com.campushire.pict.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/drives/{driveId}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyToDrive(
            @PathVariable Long driveId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ApplicationResponse response = applicationService.applyToDrive(driveId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Successfully applied to placement drive", response));
    }

    @PutMapping("/applications/{id}/status")
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        ApplicationResponse response = applicationService.updateApplicationStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Application status updated successfully", response));
    }

    @GetMapping("/applications/drives/{driveId}")
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicationsByDrive(
            @PathVariable Long driveId) {
        List<ApplicationResponse> response = applicationService.getApplicationsByDrive(driveId);
        return ResponseEntity.ok(ApiResponse.success("Applications fetched successfully", response));
    }

    @GetMapping("/applications/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ApplicationResponse> response = applicationService.getStudentApplications(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("My applications fetched successfully", response));
    }

    @GetMapping("/applications/reports")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicationsReport() {
        List<ApplicationResponse> response = applicationService.getApplicationsReport();
        return ResponseEntity.ok(ApiResponse.success("Applications report fetched successfully", response));
    }
}
