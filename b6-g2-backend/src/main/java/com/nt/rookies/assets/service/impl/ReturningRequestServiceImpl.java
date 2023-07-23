package com.nt.rookies.assets.service.impl;

import com.nt.rookies.assets.dto.ReturningRequestDto;
import com.nt.rookies.assets.dto.UserDto;
import com.nt.rookies.assets.entity.*;
import com.nt.rookies.assets.mapper.AssetMapper;
import com.nt.rookies.assets.mapper.AssignmentMapper;
import com.nt.rookies.assets.mapper.ReturningRequestMapper;
import com.nt.rookies.assets.repository.AssetRepository;
import com.nt.rookies.assets.repository.AssignmentRepository;
import com.nt.rookies.assets.exception.BadRequestException;
import com.nt.rookies.assets.mapper.ReturningRequestMapper;
import com.nt.rookies.assets.mapper.UserMapper;
import com.nt.rookies.assets.repository.ReturningRequestRepository;
import com.nt.rookies.assets.repository.UserRepository;
import com.nt.rookies.assets.service.AssignmentService;
import com.nt.rookies.assets.service.ReturningRequestService;
import net.bytebuddy.implementation.bind.annotation.AllArguments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ReturningRequestServiceImpl implements ReturningRequestService {
    @Autowired
    public ReturningRequestRepository returningRequestRepository;

    @Autowired
    public AssignmentRepository assignmentRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public AssignmentService assignmentService;

    @Override
    public ReturningRequestDto create(ReturningRequestDto returningRequestDto) {
        try {
            String userUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            Assignment assignment = assignmentRepository.findById(returningRequestDto.getAssignment().getId()).get();
            assignment.setState("Returning");
            returningRequestDto.setAssignment(AssignmentMapper.toDto(assignment));
            returningRequestDto.setRequestedBy(UserMapper.toDto(userRepository.findByUsername(userUsername).get()));
            returningRequestDto.setState("Waiting for returning");
            returningRequestDto.setCreatedBy(userUsername);
            returningRequestDto.setCreatedDate(LocalDateTime.now());
            returningRequestDto.setLastUpdatedBy(userUsername);
            returningRequestDto.setLastUpdatedDate(LocalDateTime.now());
            return ReturningRequestMapper.toDto(returningRequestRepository.save(ReturningRequestMapper.toEntity(returningRequestDto)));
        } catch (NullPointerException e) {
            throw Objects.nonNull(e.getMessage()) ? new BadRequestException(e.getMessage()) : new BadRequestException(e);
        }
    }

    @Override
    public ReturningRequestDto completeReturnRequest(Integer id) {
        ReturningRequest returningRequest = returningRequestRepository.findById(id).get();
        if (returningRequest != null) {
            ReturningRequestDto returningRequestDto = ReturningRequestMapper.toDto(returningRequest);
            returningRequestDto.setReturnedDate(LocalDate.now());
            returningRequestDto.setState("Completed");
            Assignment assignment = assignmentRepository.findById(returningRequestDto.getAssignment().getId()).get();
            assignment.setState("Closed");
            Asset asset = assetRepository.findByCode(returningRequestDto.getAssignment().getAsset().getCode()).get();
            asset.setState("Available");
            assignment.setAsset(asset);
            returningRequestDto.setAssignment(AssignmentMapper.toDto(assignment));
            String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(adminUsername).get();
            returningRequestDto.setAcceptedBy(UserMapper.toDto(user));
            return ReturningRequestMapper.toDto(returningRequestRepository.save(ReturningRequestMapper.toEntity(returningRequestDto)));
        }
        return null;
    }

    @Override
    public Boolean cancelReturnRequest(Integer id) {
        ReturningRequest returningRequest = returningRequestRepository.findById(id).get();
        if (returningRequest != null) {
            Assignment assignment = returningRequest.getAssignment();
            assignment.setState("Accepted");
            assignmentService.update(assignment.getId(), AssignmentMapper.toDto(assignment));
            returningRequestRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Page<ReturningRequestDto> getAllReturningRequests(Pageable pageable, LocalDate returnedDate, String state, String search) {
        // Get current admin location
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).get();
        Location location = currentUser.getLocation();

        // check if search have value
        // verify if search keyword contains only space characters
        List<String> keywords = StringUtils.hasLength(search.trim()) ?
                Arrays.stream(search.split(",")).map(keyword -> keyword.trim()).collect(Collectors.toList()) :
                Arrays.asList(search.split(","));

        // if current User is admin
        Page<ReturningRequestDto> returningRequestDtos = returningRequestRepository.findAll((root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            // search by asset code or asset name, requesters' username
            if (keywords != null) {
                List<Predicate> predicatesKeyword = new ArrayList<>();
                for (String keyword : keywords) {
                    // search by asset's code
                    predicatesKeyword.add(builder.like(builder.lower(root.get("assignment").get("asset").get("code")), "%" + keyword.toLowerCase() + "%"));
                    // search by asset's name
                    predicatesKeyword.add(builder.like(builder.lower(root.get("assignment").get("asset").get("name")), "%" + keyword.toLowerCase() + "%"));
                    // search by requesters' username
                    predicatesKeyword.add(builder.like(builder.lower(root.get("requestedBy").get("username")), "%" + keyword.toLowerCase() + "%"));
                }
                predicates.add(builder.or(predicatesKeyword.toArray(new Predicate[0])));
            }
            // search by returnedDate
            if (returnedDate != null) {
                predicates.add(builder.equal(root.get("returnedDate"), returnedDate));
            }
            // search by state
            if (StringUtils.hasLength(state)) {
                predicates.add(builder.equal(root.get("state"), state));
            }
            // search by admin's location
            predicates.add(builder.equal(root.get("requestedBy").get("location"), location));
            return builder.and(predicates.toArray(new Predicate[]{}));
        }, pageable).map(ReturningRequestMapper::toDto);
        return returningRequestDtos;
    }

    @Override
    public ReturningRequestDto getReturningRequest(Integer id) {
        ReturningRequest fromDB = returningRequestRepository.findById(id).orElse(null);
        if (fromDB != null) {
            return ReturningRequestMapper.toDto(fromDB);
        }
        return null;
    }
}
