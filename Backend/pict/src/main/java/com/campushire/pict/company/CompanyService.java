package com.campushire.pict.company;

import com.campushire.pict.company.dto.*;

import java.util.List;

public interface CompanyService {
    CompanyResponse createCompany(CompanyRequest request, Long userId);
    List<CompanyResponse> getAllCompanies();
    CompanyResponse getCompanyById(Long id);
}
