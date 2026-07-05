package com.campushire.pict.student;

import com.campushire.pict.student.dto.*;
import org.springframework.web.multipart.MultipartFile;

public interface StudentService {
    BulkUploadResult bulkUploadStudents(MultipartFile file);
    StudentProfileResponse createStudentManually(StudentManualCreateRequest request);
    StudentProfileResponse updateProfile(Long userId, StudentProfileUpdateRequest request);
    StudentProfileResponse getProfileByUserId(Long userId);
    StudentProfileResponse getProfileById(Long id);
    StudentProfileResponse verifyProfile(Long id, VerificationStatus status, String remarks);
    java.util.List<StudentProfileResponse> getAllStudents();
}

