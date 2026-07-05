package com.campushire.pict.auth;

import com.campushire.pict.auth.dto.*;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    void changePassword(Long userId, PasswordChangeRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
