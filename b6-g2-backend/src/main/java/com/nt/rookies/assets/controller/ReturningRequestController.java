package com.nt.rookies.assets.controller;

import com.nt.rookies.assets.dto.ReturningRequestDto;
import com.nt.rookies.assets.dto.UserDto;
import com.nt.rookies.assets.response.ResponseDataConfiguration;
import com.nt.rookies.assets.service.ReturningRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/v1/returning-requests")
public class ReturningRequestController {
    @Autowired
    public ReturningRequestService returningRequestService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ReturningRequestDto> create(@RequestBody @Valid ReturningRequestDto returningRequestDto) {
        return new ResponseEntity<>(returningRequestService.create(returningRequestDto), HttpStatus.OK);
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ReturningRequestDto> completeReturnRequest(@PathVariable Integer id) {
        return ResponseDataConfiguration.success(returningRequestService.completeReturnRequest(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity cancelReturnRequest(@PathVariable Integer id) {
        return ResponseDataConfiguration.success(returningRequestService.cancelReturnRequest(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity getAllAssignments(@PageableDefault Pageable pageable, @RequestParam(value = "state", required = false) String state,
                                            @RequestParam(value = "returnedDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate returnedDate,
                                            @RequestParam(value = "search", required = false) String search) {
        return ResponseDataConfiguration.success(returningRequestService.getAllReturningRequests(pageable, returnedDate, state, search));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getReturningRequest(@PathVariable("id") Integer id) {
        return ResponseDataConfiguration.success(returningRequestService.getReturningRequest(id));
    }
}
