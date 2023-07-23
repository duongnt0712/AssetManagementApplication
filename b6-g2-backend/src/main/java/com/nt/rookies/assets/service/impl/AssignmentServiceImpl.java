package com.nt.rookies.assets.service.impl;

import com.nt.rookies.assets.dto.AssignmentDto;
import com.nt.rookies.assets.mapper.AssignmentMapper;
import com.nt.rookies.assets.entity.Assignment;
import com.nt.rookies.assets.entity.Location;
import com.nt.rookies.assets.entity.User;
import com.nt.rookies.assets.entity.Asset;
import com.nt.rookies.assets.exception.BadRequestException;
import com.nt.rookies.assets.mapper.AssetMapper;
import com.nt.rookies.assets.mapper.UserMapper;
import com.nt.rookies.assets.repository.AssetRepository;
import com.nt.rookies.assets.repository.AssignmentRepository;
import com.nt.rookies.assets.repository.ReturningRequestRepository;
import com.nt.rookies.assets.repository.UserRepository;
import com.nt.rookies.assets.service.AssetService;
import com.nt.rookies.assets.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDateTime;
import java.util.Objects;
@Service
public class AssignmentServiceImpl implements AssignmentService {
    @Autowired
    public AssignmentRepository assignmentRepository;

    @Autowired
    public ReturningRequestRepository returningRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public AssetRepository assetRepository;

    @Autowired
    public AssetService assetService;

    @Override
    public AssignmentDto create(AssignmentDto assignmentDto) {
        try {
            String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            if (assignmentDto.getNote() == null || assignmentDto.getNote().trim().length() == 0) {
                assignmentDto.setNote("Created by admin " + adminUsername);
            }
            String assetCode = assignmentDto.getAsset().getCode();
            Asset asset = assetRepository.findByCode(assetCode).get();
            asset.setState("Waiting for acceptance");
            assignmentDto.setAsset(AssetMapper.toDto(asset));
            assignmentDto.setState("Waiting for acceptance");
            assignmentDto.setAssignedBy(UserMapper.toDto(userRepository.findByUsername(adminUsername).get()));
            assignmentDto.setCreatedBy(adminUsername);
            assignmentDto.setCreatedDate(LocalDateTime.now());
            return AssignmentMapper.toDto(assignmentRepository.save(AssignmentMapper.toEntity(assignmentDto)));
        } catch (NullPointerException e) {
            throw Objects.nonNull(e.getMessage()) ? new BadRequestException(e.getMessage()) : new BadRequestException(e);
        }
    }

    @Override
    public AssignmentDto update(Integer id, AssignmentDto assignmentDto) {
        Assignment fromDB = assignmentRepository.findById(id).get();
        if (fromDB == null) {
            return null;
        }
        //If user change to the new asset
        if (!assignmentDto.getAsset().getCode().equals(fromDB.getAsset().getCode())) {
            //Set the old asset's state to 'Available'
            Asset asset = fromDB.getAsset();
            asset.setState("Available");
            assetService.update(asset.getCode(), AssetMapper.toDto(asset));
            //Set the new asset's state to 'Waiting for acceptance'
            Asset newAsset = AssetMapper.toEntity(assignmentDto.getAsset());
            newAsset.setState("Waiting for acceptance");
            assetService.update(newAsset.getCode(), AssetMapper.toDto(newAsset));
        }
        assignmentDto.setId(id);
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (assignmentDto.getNote() == null || assignmentDto.getNote().trim().length() == 0) {
            assignmentDto.setNote("Created by admin " + adminUsername);
        }
        assignmentDto.setLastUpdatedBy(adminUsername);
        assignmentDto.setLastUpdatedDate(LocalDateTime.now());
        return AssignmentMapper.toDto(assignmentRepository.save(AssignmentMapper.toEntity(assignmentDto)));
    }

    @Override
    public AssignmentDto respond(Integer id, AssignmentDto assignmentDto) {
        Assignment assignment = assignmentRepository.findById(id).get();
        assignment.setState(assignmentDto.getState());
        Asset asset = assignment.getAsset();
        if(assignmentDto.getState().equals("Accepted") ) {
            asset.setState("Assigned");
        }
        if(assignmentDto.getState().equals("Declined")) {
            asset.setState("Available");
        }
        assignment.setAsset(asset);
        return AssignmentMapper.toDto(assignmentRepository.save(assignment));
    }

    @Override
    public Page<AssignmentDto> getAllAssignments(Pageable pageable, LocalDate assignedDate, String state, String search) {
        // Get current admin location
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).get();
        Location location = currentUser.getLocation();

        // check if search have value
        // verify if search keyword contains only space characters
        List<String> keywords = StringUtils.hasLength(search.trim()) ?
                Arrays.stream(search.split(",")).map(keyword -> keyword.trim()).collect(Collectors.toList()) :
                Arrays.asList(search.split(","));

        Page<AssignmentDto> assignmentDtos = assignmentRepository.findAll((root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            // search by asset code or asset name, assignee's username
            if (keywords != null) {
                List<Predicate> predicatesKeyword = new ArrayList<>();
                for (String keyword : keywords) {
                    // search by asset's code
                    predicatesKeyword.add(builder.like(builder.lower(root.get("asset").get("code")), "%" + keyword.toLowerCase() + "%"));
                    // search by asset's name
                    predicatesKeyword.add(builder.like(builder.lower(root.get("asset").get("name")), "%" + keyword.toLowerCase() + "%"));
                    // search by assignee's username
                    predicatesKeyword.add(builder.like(builder.lower(root.get("assignedTo").get("username")), "%" + keyword.toLowerCase() + "%"));
                }
                predicates.add(builder.or(predicatesKeyword.toArray(new Predicate[0])));
            }
            // search by assignedDate
            if (assignedDate != null) {
                predicates.add(builder.equal(root.get("assignedDate"), assignedDate));
            }
            // search by state
            if (StringUtils.hasLength(state)) {
                predicates.add(builder.equal(root.get("state"), state));
            } else {
                predicates.add(builder.or(
                    builder.equal(root.get("state"), "Accepted"),
                    builder.equal(root.get("state"), "Waiting for acceptance"),
                    builder.equal(root.get("state"), "Returning")
                ));
            }
            // search by admin's location
            predicates.add(builder.equal(root.get("assignedBy").get("location"), location));
            return builder.and(predicates.toArray(new Predicate[]{}));
        }, pageable).map(AssignmentMapper::toDto);
        return assignmentDtos;
    }

    @Override
    public AssignmentDto getAssignment(Integer id) {
        Assignment fromDB = assignmentRepository.findById(id).orElse(null);
        if (fromDB != null) {
            return AssignmentMapper.toDto(fromDB);
        }
        return null;
    }

    @Override
    public Page<AssignmentDto> getCurrentUsersAssignments(Pageable pageable, LocalDate assignedDate, String state, String search, String username) {
        // check if username is valid
        String currentUserUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!username.equals(currentUserUsername)) {
            throw new UsernameNotFoundException("Username is incorrect. Please try again.");
        }
        // check if search have value
        // verify if search keyword contains only space characters
        List<String> keywords = StringUtils.hasLength(search.trim()) ?
                Arrays.stream(search.split(",")).map(keyword -> keyword.trim()).collect(Collectors.toList()) :
                Arrays.asList(search.split(","));

        Page<AssignmentDto> assignmentDtos = assignmentRepository.findAll((root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            // search by asset code or asset name, assignee's username
            if (keywords != null) {
                List<Predicate> predicatesKeyword = new ArrayList<>();
                for (String keyword : keywords) {
                    // search by asset's code
                    predicatesKeyword.add(builder.like(builder.lower(root.get("asset").get("code")), "%" + keyword.toLowerCase() + "%"));
                    // search by asset's name
                    predicatesKeyword.add(builder.like(builder.lower(root.get("asset").get("name")), "%" + keyword.toLowerCase() + "%"));
                    // search by assignee's username
                    predicatesKeyword.add(builder.like(builder.lower(root.get("assignedBy").get("username")), "%" + keyword.toLowerCase() + "%"));
                }
                predicates.add(builder.or(predicatesKeyword.toArray(new Predicate[0])));
            }
            // filter by state
            if (StringUtils.hasLength(state)) {
                predicates.add(builder.equal(root.get("state"), state));
            } else {
                predicates.add(builder.or(
                    builder.equal(root.get("state"), "Accepted"),
                    builder.equal(root.get("state"), "Waiting for acceptance"),
                    builder.equal(root.get("state"), "Returning")
                ));
            }
            // search by assignedDate
            if (assignedDate != null) {
                predicates.add(builder.equal(root.get("assignedDate"), assignedDate));
            }
            // search by assignedDate < current day
            predicates.add(builder.lessThanOrEqualTo(root.get("assignedDate"), LocalDate.now()));
            // display only current user's assignments
            predicates.add(builder.equal(root.get("assignedTo").get("username"), username));
            return builder.and(predicates.toArray(new Predicate[]{}));
        }, pageable).map(AssignmentMapper::toDto);
        return assignmentDtos;
    }
}
