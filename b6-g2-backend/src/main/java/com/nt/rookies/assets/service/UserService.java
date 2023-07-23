package com.nt.rookies.assets.service;

import com.nt.rookies.assets.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    Page<UserDto> getAllUsers(Pageable pageable, String type, String search, Boolean status);

    UserDto getUser(String username);

    public UserDto changePassword(String password, String oldPassword);

    Boolean disableUser(String username);

    public UserDto create(UserDto user);

    public UserDto update(String username, UserDto userDto);

    public List<UserDto> getAllUsersWithoutFilters();
}
