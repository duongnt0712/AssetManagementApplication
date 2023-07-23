package com.nt.rookies.assets.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReturningRequestDto {
    private Integer id;

    private AssignmentDto assignment;

    private UserDto requestedBy;

    private UserDto acceptedBy;

    private LocalDate returnedDate;

    private String state;

    private String createdBy;

    private LocalDateTime createdDate;

    private String lastUpdatedBy;

    private LocalDateTime lastUpdatedDate;
}
