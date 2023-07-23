package com.nt.rookies.assets.mapper;

import com.nt.rookies.assets.dto.UserDto;
import com.nt.rookies.assets.entity.User;
import com.nt.rookies.assets.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    @Autowired
    public static UserDto toDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setDob(user.getDob());
        userDto.setJoinedDate(user.getJoinedDate());
        userDto.setGender(user.getGender());
        userDto.setType(user.getType());
        userDto.setStaffCode(user.getStaffCode());
        userDto.setStatus(user.getStatus());
        userDto.setCreatedBy(user.getCreatedBy());
        userDto.setCreatedDate(user.getCreatedDate());
        userDto.setLastUpdatedBy(user.getLastUpdatedBy());
        userDto.setLastUpdatedDate(user.getLastUpdatedDate());
        userDto.setLocation(LocationMapper.toDto(user.getLocation()));
        return userDto;
    }

    public static User toEntity(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setDob(userDto.getDob());
        user.setJoinedDate(userDto.getJoinedDate());
        user.setGender(userDto.getGender());
        user.setType(userDto.getType());
        user.setStaffCode(userDto.getStaffCode());
        user.setStatus(userDto.getStatus());
        user.setCreatedBy(userDto.getCreatedBy());
        user.setCreatedDate(userDto.getCreatedDate());
        user.setLastUpdatedBy(userDto.getLastUpdatedBy());
        user.setLastUpdatedDate(userDto.getLastUpdatedDate());
        user.setLocation(LocationMapper.toEntity(userDto.getLocation()));
        return user;
    }

    public static List<UserDto> toDtoList(List<User> users) {
        return users.stream().map(UserMapper::toDto).collect(Collectors.toList());
    }

    public static List<UserDto> toDtoList(Iterable<User> users) {
        List<UserDto> userDtoList = new LinkedList<>();
        users.forEach(user -> userDtoList.add(toDto(user)));
        return userDtoList;
    }
}
