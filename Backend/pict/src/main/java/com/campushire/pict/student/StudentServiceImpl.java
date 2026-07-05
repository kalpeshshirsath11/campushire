package com.campushire.pict.student;

import com.campushire.pict.event.StudentCreatedEvent;
import com.campushire.pict.exception.BadRequestException;
import com.campushire.pict.exception.ResourceNotFoundException;
import com.campushire.pict.student.dto.*;
import com.campushire.pict.user.Role;
import com.campushire.pict.user.User;
import com.campushire.pict.user.UserRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public BulkUploadResult bulkUploadStudents(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded CSV file is empty");
        }

        int total = 0;
        int success = 0;
        int failure = 0;
        List<String> errors = new ArrayList<>();

        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord record : csvRecords) {
                total++;
                String prn = record.get("prn");
                String email = record.get("email");
                String password = record.get("password");

                if (prn == null || prn.isBlank() || email == null || email.isBlank() || password == null || password.isBlank()) {
                    failure++;
                    errors.add("Row " + total + ": Missing prn, email or password fields");
                    continue;
                }

                if (userRepository.existsByEmail(email)) {
                    failure++;
                    errors.add("Row " + total + ": Email '" + email + "' is already registered");
                    continue;
                }

                if (studentRepository.existsByPrn(prn)) {
                    failure++;
                    errors.add("Row " + total + ": PRN '" + prn + "' already exists");
                    continue;
                }

                try {
                    // Create User
                    User user = User.builder()
                            .email(email)
                            .password(passwordEncoder.encode(password))
                            .role(Role.ROLE_STUDENT)
                            .isActive(true)
                            .firstLogin(true)
                            .build();

                    User savedUser = userRepository.save(user);

                    // Create Student
                    Student student = Student.builder()
                            .user(savedUser)
                            .prn(prn)
                            .profileCompleted(false)
                            .verificationStatus(VerificationStatus.PENDING)
                            .build();

                    studentRepository.save(student);

                    // Publish Event for asynchronous email credentials sending
                    eventPublisher.publishEvent(new StudentCreatedEvent(this, savedUser, password));

                    success++;
                } catch (Exception e) {
                    failure++;
                    errors.add("Row " + total + ": Failed to process. Error: " + e.getMessage());
                }
            }

        } catch (Exception e) {
            throw new BadRequestException("Failed to parse CSV file: " + e.getMessage());
        }

        return BulkUploadResult.builder()
                .totalRecords(total)
                .successCount(success)
                .failureCount(failure)
                .errors(errors)
                .build();
    }

    @Override
    @Transactional
    public StudentProfileResponse createStudentManually(StudentManualCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        if (studentRepository.existsByPrn(request.getPrn())) {
            throw new BadRequestException("PRN already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_STUDENT)
                .isActive(true)
                .firstLogin(true)
                .build();

        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .user(savedUser)
                .prn(request.getPrn())
                .profileCompleted(false)
                .verificationStatus(VerificationStatus.PENDING)
                .build();

        Student savedStudent = studentRepository.save(student);

        // Publish Event for async credentials email
        eventPublisher.publishEvent(new StudentCreatedEvent(this, savedUser, request.getPassword()));

        return mapToStudentProfileResponse(savedStudent);
    }

    @Override
    @Transactional
    public StudentProfileResponse updateProfile(Long userId, StudentProfileUpdateRequest request) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        student.setFullName(request.getFullName());
        student.setBranch(request.getBranch());
        student.setCgpa(request.getCgpa());
        student.setTenthPercentage(request.getTenthPercentage());
        student.setTwelfthPercentage(request.getTwelfthPercentage());
        student.setBacklogs(request.getBacklogs());
        student.setPhone(request.getPhone());
        student.setPersonalEmail(request.getPersonalEmail());
        student.setLinkedinUrl(request.getLinkedinUrl());
        student.setGithubUrl(request.getGithubUrl());
        student.setAddress(request.getAddress());

        // File uploads as links
        student.setResumeLink(request.getResumeLink());
        student.setResumeFileName(request.getResumeFileName());
        student.setTenthMarksheetLink(request.getTenthMarksheetLink());
        student.setTenthMarksheetFileName(request.getTenthMarksheetFileName());
        student.setTwelfthMarksheetLink(request.getTwelfthMarksheetLink());
        student.setTwelfthMarksheetFileName(request.getTwelfthMarksheetFileName());
        student.setDiplomaMarksheetLink(request.getDiplomaMarksheetLink());
        student.setDiplomaMarksheetFileName(request.getDiplomaMarksheetFileName());
        student.setDegreeResultLink(request.getDegreeResultLink());
        student.setDegreeResultFileName(request.getDegreeResultFileName());
        student.setAadhaarLink(request.getAadhaarLink());
        student.setAadhaarFileName(request.getAadhaarFileName());
        student.setPhotoLink(request.getPhotoLink());
        student.setPhotoFileName(request.getPhotoFileName());

        student.setProfileCompleted(true);
        // Resets verification status back to PENDING when profile is updated/completed
        student.setVerificationStatus(VerificationStatus.PENDING);

        Student updatedStudent = studentRepository.save(student);
        return mapToStudentProfileResponse(updatedStudent);
    }

    @Override
    public StudentProfileResponse getProfileByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return mapToStudentProfileResponse(student);
    }

    @Override
    public StudentProfileResponse getProfileById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + id));
        return mapToStudentProfileResponse(student);
    }

    @Override
    @Transactional
    public StudentProfileResponse verifyProfile(Long id, VerificationStatus status, String remarks) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + id));

        student.setVerificationStatus(status);
        student.setRemarks(remarks);

        Student updatedStudent = studentRepository.save(student);
        return mapToStudentProfileResponse(updatedStudent);
    }

    @Override
    public List<StudentProfileResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToStudentProfileResponse)
                .toList();
    }

    private StudentProfileResponse mapToStudentProfileResponse(Student student) {

        return StudentProfileResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .email(student.getUser().getEmail())
                .prn(student.getPrn())
                .fullName(student.getFullName())
                .branch(student.getBranch())
                .cgpa(student.getCgpa())
                .tenthPercentage(student.getTenthPercentage())
                .twelfthPercentage(student.getTwelfthPercentage())
                .backlogs(student.getBacklogs())
                .phone(student.getPhone())
                .personalEmail(student.getPersonalEmail())
                .linkedinUrl(student.getLinkedinUrl())
                .githubUrl(student.getGithubUrl())
                .address(student.getAddress())
                .resumeLink(student.getResumeLink())
                .resumeFileName(student.getResumeFileName())
                .tenthMarksheetLink(student.getTenthMarksheetLink())
                .tenthMarksheetFileName(student.getTenthMarksheetFileName())
                .twelfthMarksheetLink(student.getTwelfthMarksheetLink())
                .twelfthMarksheetFileName(student.getTwelfthMarksheetFileName())
                .diplomaMarksheetLink(student.getDiplomaMarksheetLink())
                .diplomaMarksheetFileName(student.getDiplomaMarksheetFileName())
                .degreeResultLink(student.getDegreeResultLink())
                .degreeResultFileName(student.getDegreeResultFileName())
                .aadhaarLink(student.getAadhaarLink())
                .aadhaarFileName(student.getAadhaarFileName())
                .photoLink(student.getPhotoLink())
                .photoFileName(student.getPhotoFileName())
                .profileCompleted(student.getProfileCompleted())
                .verificationStatus(student.getVerificationStatus())
                .remarks(student.getRemarks())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}
