package com.campushire.pict.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkUploadResult {
    private int totalRecords;
    private int successCount;
    private int failureCount;
    
    @Builder.Default
    private List<String> errors = new ArrayList<>();
}
