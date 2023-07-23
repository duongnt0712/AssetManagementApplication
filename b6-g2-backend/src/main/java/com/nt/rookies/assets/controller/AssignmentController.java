package com.nt.rookies.assets.controller;

import com.nt.rookies.assets.response.ResponseDataConfiguration;
import com.nt.rookies.assets.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import com.nt.rookies.assets.dto.AssignmentDto;
import org.springframework.http.HttpStatus;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/assignments")
public class AssignmentController {
    @Autowired
    public AssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AssignmentDto> create(@RequestBody @Valid AssignmentDto assignmentDto) {
        return new ResponseEntity<>(assignmentService.create(assignmentDto), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AssignmentDto> update(@PathVariable Integer id, @RequestBody @Valid AssignmentDto assignmentDto) {
        return new ResponseEntity<>(assignmentService.update(id, assignmentDto), HttpStatus.OK);
    }

    @PostMapping("/{id}/respond")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<AssignmentDto> respond(@PathVariable Integer id, @RequestBody @Valid AssignmentDto assignmentDto) {
        return new ResponseEntity<>(assignmentService.respond(id, assignmentDto), HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getAllAssignments(@PageableDefault Pageable pageable, @RequestParam(value = "state", required = false) String state,
                                            @RequestParam(value = "assignedDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate assignedDate,
                                            @RequestParam(value = "search", required = false) String search) {
        return ResponseDataConfiguration.success(assignmentService.getAllAssignments(pageable, assignedDate, state, search));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getAssignment(@PathVariable("id") Integer id) {
        return ResponseDataConfiguration.success(assignmentService.getAssignment(id));
    }

    @GetMapping(value = "/{username}", params = {"page", "sort", "state", "assignedDate", "search"})
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity getCurrentUsersAssignments(@PageableDefault Pageable pageable, @RequestParam(value = "state", required = false) String state,
                                                     @RequestParam(value = "assignedDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate assignedDate,
                                                     @RequestParam(value = "search", required = false) String search, @PathVariable("username") String username) {
        return ResponseDataConfiguration.success(assignmentService.getCurrentUsersAssignments(pageable, assignedDate, state, search, username));
    }
}
