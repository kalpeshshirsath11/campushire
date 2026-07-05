package com.campushire.pict.drive;

import com.campushire.pict.company.Company;
import com.campushire.pict.company.CompanyRepository;
import com.campushire.pict.drive.dto.*;
import com.campushire.pict.event.DriveCreatedEvent;
import com.campushire.pict.exception.BadRequestException;
import com.campushire.pict.exception.ResourceNotFoundException;
import com.campushire.pict.student.Student;
import com.campushire.pict.student.StudentRepository;
import com.campushire.pict.student.VerificationStatus;
import com.campushire.pict.user.User;
import com.campushire.pict.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriveServiceImpl implements DriveService {

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public DriveResponse createDrive(DriveRequest request, Long userId) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));

        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator user not found"));

        String branches = String.join(",", request.getEligibleBranches());

        Drive drive = Drive.builder()
                .company(company)
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .minimumCgpa(request.getMinimumCgpa())
                .allowedBacklogs(request.getAllowedBacklogs())
                .minimumTenthPercentage(request.getMinimumTenthPercentage())
                .minimumTwelfthPercentage(request.getMinimumTwelfthPercentage())
                .eligibleBranches(branches)
                .bondDetails(request.getBondDetails())
                .driveDate(request.getDriveDate())
                .createdBy(creator)
                .build();

        Drive savedDrive = driveRepository.save(drive);

        // Publish event for potential notifications
        eventPublisher.publishEvent(new DriveCreatedEvent(
                this, 
                savedDrive.getId(), 
                savedDrive.getTitle(), 
                savedDrive.getCompany().getName()
        ));

        return mapToDriveResponse(savedDrive);
    }

    @Override
    public List<DriveResponse> getAllDrives() {
        return driveRepository.findAll().stream()
                .map(this::mapToDriveResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DriveResponse getDriveById(Long id) {
        Drive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found with id: " + id));
        return mapToDriveResponse(drive);
    }

    @Override
    public List<DriveResponse> getEligibleDrivesForStudent(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        // Only verified and completed student profiles can view/be eligible for drives
        if (!student.getProfileCompleted() || student.getVerificationStatus() != VerificationStatus.VERIFIED) {
            return Collections.emptyList();
        }

        List<Drive> allDrives = driveRepository.findAll();

        return allDrives.stream()
                .filter(drive -> isStudentEligible(student, drive))
                .map(this::mapToDriveResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isStudentEligible(Student student, Drive drive) {
        // 1. CGPA check
        if (student.getCgpa() == null || student.getCgpa() < drive.getMinimumCgpa()) {
            return false;
        }

        // 2. Backlogs check
        if (student.getBacklogs() == null || student.getBacklogs() > drive.getAllowedBacklogs()) {
            return false;
        }

        // 3. 10th Percentage check
        if (student.getTenthPercentage() == null || student.getTenthPercentage() < drive.getMinimumTenthPercentage()) {
            return false;
        }

        // 4. 12th Percentage check
        if (student.getTwelfthPercentage() == null || student.getTwelfthPercentage() < drive.getMinimumTwelfthPercentage()) {
            return false;
        }

        // 5. Branch eligibility check
        if (student.getBranch() == null || student.getBranch().isBlank()) {
            return false;
        }

        String[] branchArray = drive.getEligibleBranches().split(",");
        boolean branchMatches = Arrays.stream(branchArray)
                .map(String::trim)
                .anyMatch(branch -> branch.equalsIgnoreCase(student.getBranch().trim()));

        return branchMatches;
    }

    private DriveResponse mapToDriveResponse(Drive drive) {
        List<String> branchesList = Arrays.stream(drive.getEligibleBranches().split(","))
                .map(String::trim)
                .collect(Collectors.toList());

        return DriveResponse.builder()
                .id(drive.getId())
                .companyId(drive.getCompany().getId())
                .companyName(drive.getCompany().getName())
                .title(drive.getTitle())
                .description(drive.getDescription())
                .deadline(drive.getDeadline())
                .minimumCgpa(drive.getMinimumCgpa())
                .allowedBacklogs(drive.getAllowedBacklogs())
                .minimumTenthPercentage(drive.getMinimumTenthPercentage())
                .minimumTwelfthPercentage(drive.getMinimumTwelfthPercentage())
                .eligibleBranches(branchesList)
                .bondDetails(drive.getBondDetails())
                .driveDate(drive.getDriveDate())
                .createdByEmail(drive.getCreatedBy().getEmail())
                .createdAt(drive.getCreatedAt())
                .updatedAt(drive.getUpdatedAt())
                .build();
    }
}
