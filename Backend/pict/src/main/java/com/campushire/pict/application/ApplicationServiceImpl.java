package com.campushire.pict.application;

import com.campushire.pict.application.dto.*;
import com.campushire.pict.drive.Drive;
import com.campushire.pict.drive.DriveRepository;
import com.campushire.pict.drive.DriveService;
import com.campushire.pict.event.ApplicationSubmittedEvent;
import com.campushire.pict.event.ApplicationStatusUpdatedEvent;
import com.campushire.pict.exception.BadRequestException;
import com.campushire.pict.exception.ResourceNotFoundException;
import com.campushire.pict.student.Student;
import com.campushire.pict.student.StudentRepository;
import com.campushire.pict.student.VerificationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private DriveService driveService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public ApplicationResponse applyToDrive(Long driveId, Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (!student.getProfileCompleted() || student.getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new BadRequestException("Your profile must be completed and verified by TPO before applying");
        }

        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found with id: " + driveId));

        if (LocalDateTime.now().isAfter(drive.getDeadline())) {
            throw new BadRequestException("Application deadline has passed for this drive");
        }

        if (applicationRepository.existsByStudentIdAndDriveId(student.getId(), driveId)) {
            throw new BadRequestException("You have already applied to this drive");
        }

        // Verify eligibility
        if (!driveService.isStudentEligible(student, drive)) {
            throw new BadRequestException("You do not meet the eligibility requirements for this drive");
        }

        Application application = Application.builder()
                .student(student)
                .drive(drive)
                .status(ApplicationStatus.APPLIED)
                .build();

        Application savedApplication = applicationRepository.save(application);

        // Publish Event
        eventPublisher.publishEvent(new ApplicationSubmittedEvent(
                this, 
                savedApplication.getId(), 
                student.getId(), 
                drive.getId()
        ));

        return mapToApplicationResponse(savedApplication);
    }

    @Override
    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, StatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        application.setStatus(request.getStatus());
        if (request.getRemarks() != null) {
            application.setRemarks(request.getRemarks());
        }

        Application updatedApplication = applicationRepository.save(application);

        // Publish Status Update Event (e.g. for notifications)
        eventPublisher.publishEvent(new ApplicationStatusUpdatedEvent(
                this, 
                updatedApplication.getId(), 
                updatedApplication.getStudent().getUser().getEmail(), 
                updatedApplication.getDrive().getTitle(), 
                updatedApplication.getStatus().name(), 
                updatedApplication.getRemarks()
        ));

        return mapToApplicationResponse(updatedApplication);
    }

    @Override
    public List<ApplicationResponse> getApplicationsByDrive(Long driveId) {
        return applicationRepository.findByDriveId(driveId).stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationResponse> getStudentApplications(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return applicationRepository.findByStudentId(student.getId()).stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationResponse> getApplicationsReport() {
        return applicationRepository.findAll().stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    private ApplicationResponse mapToApplicationResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .studentId(application.getStudent().getId())
                .studentName(application.getStudent().getFullName())
                .studentEmail(application.getStudent().getUser().getEmail())
                .studentPrn(application.getStudent().getPrn())
                .driveId(application.getDrive().getId())
                .driveTitle(application.getDrive().getTitle())
                .companyName(application.getDrive().getCompany().getName())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .remarks(application.getRemarks())
                .build();
    }
}
