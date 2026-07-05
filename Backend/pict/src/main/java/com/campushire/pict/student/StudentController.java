package com.campushire.pict.student;

import com.campushire.pict.common.ApiResponse;
import com.campushire.pict.security.UserPrincipal;
import com.campushire.pict.student.dto.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER')")
    public ResponseEntity<ApiResponse<java.util.List<StudentProfileResponse>>> getAllStudents() {
        java.util.List<StudentProfileResponse> response = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Fetched all student profiles successfully", response));
    }


    @PostMapping(value = "/bulk-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<ApiResponse<BulkUploadResult>> bulkUpload(@RequestParam("file") MultipartFile file) {
        BulkUploadResult result = studentService.bulkUploadStudents(file);
        return ResponseEntity.ok(ApiResponse.success("CSV file processed successfully", result));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER')") // Spring SimpleGrantedAuthority retains ROLE_ prefix from DB mapping
    public ResponseEntity<ApiResponse<StudentProfileResponse>> createStudentManually(
            @Valid @RequestBody StudentManualCreateRequest request) {
        StudentProfileResponse response = studentService.createStudentManually(request);
        return ResponseEntity.ok(ApiResponse.success("Student profile created successfully", response));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody StudentProfileUpdateRequest request) {
        StudentProfileResponse response = studentService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @GetMapping("/profile/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfileMe(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        StudentProfileResponse response = studentService.getProfileByUserId(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Fetched student profile successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER')")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getStudentById(@PathVariable Long id) {
        StudentProfileResponse response = studentService.getProfileById(id);
        return ResponseEntity.ok(ApiResponse.success("Fetched student profile successfully", response));
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('TPO', 'ROLE_TP_MEMBER')")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> verifyStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentVerifyRequest request) {
        StudentProfileResponse response = studentService.verifyProfile(id, request.getStatus(), request.getRemarks());
        return ResponseEntity.ok(ApiResponse.success("Student verification updated successfully", response));
    }
}
