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
public class AssignmentDetailsDto {
    private Integer id;

    private UserDto assignedBy;

    private UserDto assignedTo;

    private AssetDto asset;

    private LocalDate assignedDate;

    private String state;

    private String note;

    private String createdBy;

    private LocalDateTime createdDate;

    private String lastUpdatedBy;

    private LocalDateTime lastUpdatedDate;

    private ReturningRequestDto returningRequest;
}
