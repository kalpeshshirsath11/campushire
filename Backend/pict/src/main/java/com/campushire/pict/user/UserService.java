package com.campushire.pict.user;

import com.campushire.pict.user.dto.*;

public interface UserService {
    UserResponse createTpMember(UserCreateRequest request);
    void deleteTpMember(Long id);
}
