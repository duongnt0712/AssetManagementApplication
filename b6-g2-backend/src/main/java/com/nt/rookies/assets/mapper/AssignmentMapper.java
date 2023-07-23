package com.nt.rookies.assets.mapper;

import com.nt.rookies.assets.dto.AssignmentDto;
import com.nt.rookies.assets.entity.Assignment;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class AssignmentMapper {
    public static AssignmentDto toDto(Assignment assignment) {
        AssignmentDto assignmentDto = new AssignmentDto();
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
        return assignmentDto;
    }

    public static Assignment toEntity(AssignmentDto assignmentDto) {
        Assignment assignment = new Assignment();
        assignment.setId(assignmentDto.getId());
        assignment.setAssignedBy(UserMapper.toEntity(assignmentDto.getAssignedBy()));
        assignment.setAssignedTo(UserMapper.toEntity(assignmentDto.getAssignedTo()));
        assignment.setAsset(AssetMapper.toEntity(assignmentDto.getAsset()));
        assignment.setAssignedDate(assignmentDto.getAssignedDate());
        assignment.setState(assignmentDto.getState());
        assignment.setNote(assignmentDto.getNote());
        assignment.setCreatedBy(assignmentDto.getCreatedBy());
        assignment.setCreatedDate(assignmentDto.getCreatedDate());
        assignment.setLastUpdatedBy(assignmentDto.getLastUpdatedBy());
        assignment.setLastUpdatedDate(assignmentDto.getLastUpdatedDate());
        return assignment;
    }
    public static List<AssignmentDto> toDtoList(List<Assignment> assignments) {
        return assignments.stream().map(AssignmentMapper::toDto).collect(Collectors.toList());
    }

    public static List<AssignmentDto> toDtoList(Iterable<Assignment> assignments) {
        List<AssignmentDto> assignmentDtoList = new LinkedList<>();
        assignments.forEach(asset -> assignmentDtoList.add(toDto(asset)));
        return assignmentDtoList;
    }
}
