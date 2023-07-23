package com.nt.rookies.assets.service;

import com.nt.rookies.assets.dto.AssignmentDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AssignmentService {

    public AssignmentDto create(AssignmentDto assignmentDto);

    public AssignmentDto update(Integer id, AssignmentDto assignmentDto);

    public AssignmentDto respond(Integer id, AssignmentDto assignmentDto);

    public Page<AssignmentDto> getAllAssignments(Pageable pageable, LocalDate assignedDate, String state, String search);

    public AssignmentDto getAssignment(Integer id);

    public Page<AssignmentDto> getCurrentUsersAssignments(Pageable pageable, LocalDate assignedDate, String state, String search, String username);
}
