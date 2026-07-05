package com.campushire.pict.drive;

import com.campushire.pict.common.ApiResponse;
import com.campushire.pict.drive.dto.*;
import com.campushire.pict.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/drives")
public class DriveController {

    @Autowired
    private DriveService driveService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER')")
    public ResponseEntity<ApiResponse<DriveResponse>> createDrive(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody DriveRequest request) {
        DriveResponse response = driveService.createDrive(request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Drive created successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<List<DriveResponse>>> getAllDrives() {
        List<DriveResponse> response = driveService.getAllDrives();
        return ResponseEntity.ok(ApiResponse.success("Drives fetched successfully", response));
    }

    @GetMapping("/eligible")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<DriveResponse>>> getEligibleDrives(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<DriveResponse> response = driveService.getEligibleDrivesForStudent(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Eligible drives fetched successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<DriveResponse>> getDriveById(@PathVariable Long id) {
        DriveResponse response = driveService.getDriveById(id);
        return ResponseEntity.ok(ApiResponse.success("Drive fetched successfully", response));
    }
}
