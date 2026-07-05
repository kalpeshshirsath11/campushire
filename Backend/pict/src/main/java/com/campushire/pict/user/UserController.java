package com.campushire.pict.user;

import com.campushire.pict.common.ApiResponse;
import com.campushire.pict.user.dto.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('TPO')")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/tp-member")
    public ResponseEntity<ApiResponse<UserResponse>> createTpMember(@Valid @RequestBody UserCreateRequest request) {
        UserResponse response = userService.createTpMember(request);
        return ResponseEntity.ok(ApiResponse.success("TP Member created successfully", response));
    }

    @DeleteMapping("/tp-member/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTpMember(@PathVariable Long id) {
        userService.deleteTpMember(id);
        return ResponseEntity.ok(ApiResponse.success("TP Member deactivated successfully"));
    }
}
