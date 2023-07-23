package com.nt.rookies.assets.mapper;

import com.nt.rookies.assets.dto.AssignmentDetailsDto;
import com.nt.rookies.assets.entity.Assignment;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class AssignmentDetailsMapper {
    public static AssignmentDetailsDto toDto(Assignment assignment) {
        AssignmentDetailsDto assignmentDto = new AssignmentDetailsDto();
        assignmentDto.setId(assignment.getId());
        assignmentDto.setAssignedBy(UserMapper.toDto(assignment.getAssignedBy()));
        assignmentDto.setAssignedTo(UserMapper.toDto(assignment.getAssignedTo()));
        assignmentDto.setAsset(AssetMapper.toDto(assignment.getAsset()));
        assignmentDto.setAssignedDate(assignment.getAssignedDate());
        assignmentDto.setState(assignment.getState());
        assignmentDto.setNote(assignment.getNote());
        assignmentDto.setCreatedBy(assignment.getCreatedBy());
        assignmentDto.setCreatedDate(assignment.getCreatedDate());
        assignmentDto.setLastUpdatedBy(assignment.getLastUpdatedBy());
        assignmentDto.setLastUpdatedDate(assignment.getLastUpdatedDate());
        if(assignment.getReturningRequest() != null) {
            assignmentDto.setReturningRequest(ReturningRequestMapper.toDto(assignment.getReturningRequest()));
        }
        return assignmentDto;
    }

    public static List<AssignmentDetailsDto> toDtoList(List<Assignment> assignments) {
        return assignments.stream().map(AssignmentDetailsMapper::toDto).collect(Collectors.toList());
    }

    public static List<AssignmentDetailsDto> toDtoList(Iterable<Assignment> assignments) {
        List<AssignmentDetailsDto> assignmentDetailsDtoList = new LinkedList<>();
        assignments.forEach(asset -> assignmentDetailsDtoList.add(toDto(asset)));
        return assignmentDetailsDtoList;
    }
}
