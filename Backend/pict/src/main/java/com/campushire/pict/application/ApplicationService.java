package com.campushire.pict.application;

import com.campushire.pict.application.dto.*;

import java.util.List;

public interface ApplicationService {
    ApplicationResponse applyToDrive(Long driveId, Long userId);
    ApplicationResponse updateApplicationStatus(Long applicationId, StatusUpdateRequest request);
    List<ApplicationResponse> getApplicationsByDrive(Long driveId);
    List<ApplicationResponse> getStudentApplications(Long userId);
    List<ApplicationResponse> getApplicationsReport();
}
