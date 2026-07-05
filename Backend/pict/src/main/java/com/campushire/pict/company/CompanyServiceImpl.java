package com.campushire.pict.company;

import com.campushire.pict.company.dto.*;
import com.campushire.pict.exception.ResourceNotFoundException;
import com.campushire.pict.user.User;
import com.campushire.pict.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public CompanyResponse createCompany(CompanyRequest request, Long userId) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator user not found"));

        Company company = Company.builder()
                .name(request.getName())
                .roleOffered(request.getRoleOffered())
                .packageLpa(request.getPackageLpa())
                .location(request.getLocation())
                .jobDescription(request.getJobDescription())
                .companyWebsite(request.getCompanyWebsite())
                .createdBy(creator)
                .build();

        Company savedCompany = companyRepository.save(company);
        return mapToCompanyResponse(savedCompany);
    }

    @Override
    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToCompanyResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return mapToCompanyResponse(company);
    }

    private CompanyResponse mapToCompanyResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .roleOffered(company.getRoleOffered())
                .packageLpa(company.getPackageLpa())
                .location(company.getLocation())
                .jobDescription(company.getJobDescription())
                .companyWebsite(company.getCompanyWebsite())
                .createdByEmail(company.getCreatedBy().getEmail())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}
