package com.campushire.pict.drive;

import com.campushire.pict.drive.dto.*;
import com.campushire.pict.student.Student;

import java.util.List;

public interface DriveService {
    DriveResponse createDrive(DriveRequest request, Long userId);
    List<DriveResponse> getAllDrives();
    DriveResponse getDriveById(Long id);
    List<DriveResponse> getEligibleDrivesForStudent(Long userId);
    boolean isStudentEligible(Student student, Drive drive);
}
