package com.nt.rookies.assets.service.impl;

import com.nt.rookies.assets.entity.Assignment;
import com.nt.rookies.assets.entity.User;
import com.nt.rookies.assets.repository.AssignmentRepository;
import com.nt.rookies.assets.dto.UserDto;
import com.nt.rookies.assets.entity.Location;
import com.nt.rookies.assets.exception.BadRequestException;
import com.nt.rookies.assets.mapper.LocationMapper;
import com.nt.rookies.assets.mapper.UserMapper;
import com.nt.rookies.assets.repository.UserRepository;
import com.nt.rookies.assets.service.UserService;
import com.nt.rookies.assets.util.PasswordUtil;
import com.nt.rookies.assets.util.StaffCodeUtil;
import com.nt.rookies.assets.util.UsernameUtil;
import com.nt.rookies.assets.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import java.time.LocalDateTime;

import java.util.Objects;
import java.util.stream.Collectors;


@Service
public class UserServiceImpl implements UserService {
    @Autowired
    public UserRepository userRepository;

    @Autowired
    public AssignmentRepository assignmentRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public Page<UserDto> getAllUsers(Pageable pageable, String type, String search, Boolean status) {
        // Get current admin location
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).get();
        Location location = currentUser.getLocation();

        // check if search have value
        // verify if search keyword contains only space characters
        List<String> keywords = StringUtils.hasLength(search.trim()) ?
                Arrays.stream(search.split(",")).map(keyword -> keyword.trim()).collect(Collectors.toList()) :
                Arrays.asList(search.split(","));

        Page<UserDto> userDtos = userRepository.findAll((root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            // search by keywords
            if (keywords != null) {
                List<Predicate> predicatesKeyword = new ArrayList<>();
                for (String keyword : keywords) {
                    // search staffCode
                    predicatesKeyword.add(builder.like(builder.lower(root.get("staffCode")), "%" + keyword.toLowerCase() + "%"));
                    // search name with order: firstName then lastName
                    Expression<String> nameConcat = builder.function("CONCAT_WS", String.class, builder.literal(" "),
                            root.get("firstName"), root.get("lastName"));
                    predicatesKeyword.add(builder.like(builder.lower(nameConcat), "%" + keyword.toLowerCase() + "%"));
                    // search name with reverse order: lastName then firstName
                    Expression<String> nameConcatInverse = builder.function("CONCAT_WS", String.class, builder.literal(" "),
                            root.get("lastName"), root.get("firstName"));
                    predicatesKeyword.add(builder.like(builder.lower(nameConcatInverse), "%" + keyword.toLowerCase() + "%"));
                }
                predicates.add(builder.or(predicatesKeyword.toArray(new Predicate[0])));
            }
            // search by type
            if (StringUtils.hasLength(type)) {
                predicates.add(builder.equal(root.get("type"), type));
            }
            // search by admin's location
            predicates.add(builder.equal(root.get("location"), location));

            // search by status
            if (status != null && status) {
                predicates.add(builder.equal(root.get("status"), 1));
            } else {
                // not allow disabled user
                predicates.add(builder.or(builder.equal(root.get("status"), 1), builder.isNull(root.get("status"))));
            }
            return builder.and(predicates.toArray(new Predicate[]{}));
        }, pageable).map(UserMapper::toDto);
        return userDtos;
    }

    @Override
    public UserDto getUser(String username) {
        return UserMapper.toDto(userRepository.findByUsername(username).get());
    }

    /**
     * if this is the first time user login (status == null)
     * if user input password that is duplicate with password in db
     * return error
     * else
     * change password and set user status to 1 - active
     * else
     * if user input old password that is duplicate with password in db
     * return error
     * else
     * change password
     */
    @Override
    public UserDto changePassword(String password, String oldPassword) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).get();

        if (user.getStatus() == null) {
            boolean validateNewPassword = passwordEncoder.matches(password, user.getPassword());
            if (validateNewPassword) {
                throw new BusinessException("The new password is already used. Please change your password.");
            }
            user.setStatus(true);
        } else if (user.getStatus()) {
            boolean validateOldPassword = passwordEncoder.matches(oldPassword, user.getPassword());
            if (!validateOldPassword) {
                throw new BusinessException("Password is incorrect");
            }
            if (password.equals(oldPassword)) {
                throw new BusinessException("Do not input the same password");
            }
        }
        user.setPassword(new BCryptPasswordEncoder().encode(password));
        user.setLastUpdatedBy(username);
        user.setLastUpdatedDate(LocalDateTime.now());
        return UserMapper.toDto(userRepository.save(user));
    }

    @Override
    public Boolean disableUser(String username) {
        //Get user by username
        User user = userRepository.findByUsername(username).orElse(null);
        List<Assignment> assignments = assignmentRepository.findAllByAssignedTo(user);
        /*type of state in db is string.
         * If we change to type boolean, we must to change the type of compare State Assignment*/
        //Check user null or no
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        //Check list assignment is content any element
        if (assignments.size() <= 0) {
            user.setStatus(false);
            userRepository.save(user);
            return true;
        }
        //Set all element in assignment list find by username (AssignedBy)
        boolean flag = false;
        for (Assignment assignment : assignments) {
            //Check state is equal String accepted or not
            if (assignment.getState().equalsIgnoreCase("Accepted") || assignment.getState().equalsIgnoreCase("Waiting for acceptance") || assignment.getState().equalsIgnoreCase("Returning")) {
                flag = true;
            }
        }
        if (flag != true) {
            user.setStatus(false);
            userRepository.save(user);
            return true;
        }
        return false;
    }


    @Override
    public UserDto create(UserDto user) {
        try {
            //Generate username by first name and last name
            String username = UsernameUtil.usernameGenerator(user);
            //Find the newest user with username contains the generated username above
            User newestUser = userRepository.findFirstByUsernameContainingOrderByCreatedDateDesc(username);

            //In case the user not exists in the db, set the username for the new user as the generated username
            if (newestUser == null) {
                user.setUsername(username);
            } else {
                //If user is existed with the same username, add 1 besides the username and set it as the username for the new user
                if (newestUser.getUsername().equals(username)) {
                    user.setUsername(username + UsernameUtil.value(0));
                } else {
                    //If the user is existed with the username different to the username generated, check if the different part is integer or not
                    if (UsernameUtil.isInteger(newestUser.getUsername().replace(username, ""))) {
                        //If the different part is integer, add 1 to it and set the username for the new user as the username generated with the number after addition besides
                        int i = Integer.parseInt(newestUser.getUsername().replace(username, ""));
                        user.setUsername(username + UsernameUtil.value(i));
                    } else {
                        //If the different part is not integer, set the username for new user as the username generated
                        user.setUsername(username);
                    }
                }
            }
            //Find the admin username who logged in to the system to create user
            String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            //Find the location of the admin by username
            Location adminLocation = userRepository.findByUsername(adminUsername).get().getLocation();
            //Find the first staff code with descending order
            String newestStaffCode = userRepository.findFirstByOrderByStaffCodeDesc().getStaffCode();
            //Create the new staff code by adding 1 to the number part of the newest staff code
            int i = Integer.parseInt(newestStaffCode.replace("SD", ""));
            String newStaffCode = StaffCodeUtil.staffCodeGenerator(i);
            String newPassword = PasswordUtil.passwordFormatter(user);
            //Set location of new user as the location of admin creating them
            user.setLocation(LocationMapper.toDto(adminLocation));
            user.setStaffCode(newStaffCode);
            user.setCreatedBy(adminUsername);
            user.setCreatedDate(LocalDateTime.now());
            user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
            return UserMapper.toDto(userRepository.save(UserMapper.toEntity(user)));
        } catch (NullPointerException e) {
            throw Objects.nonNull(e.getMessage()) ? new BadRequestException(e.getMessage()) : new BadRequestException(e);
        }
    }

    @Override
    public UserDto update(String username, UserDto userDto) {
        User fromDB = userRepository.findByUsername(username).get();
        if (fromDB == null) {
            return null;
        }
        userDto.setUsername(username);
        userDto.setPassword(fromDB.getPassword());
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        LocalDateTime lastUpdatedDate = LocalDateTime.now();
        userDto.setLastUpdatedBy(adminUsername);
        userDto.setLastUpdatedDate(lastUpdatedDate);
        return UserMapper.toDto(userRepository.save(UserMapper.toEntity(userDto)));
    }

    @Override
    public List<UserDto> getAllUsersWithoutFilters() {
        // Get current admin location
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).get();
        Location location = currentUser.getLocation();

        // get all active user from admin location
        return UserMapper.toDtoList(userRepository.findAllByLocationAndStatus(location, true));
    }
}
