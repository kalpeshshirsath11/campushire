package com.campushire.pict.user.dto;

import com.campushire.pict.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private Role role;
    private Boolean isActive;
    private Boolean firstLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
