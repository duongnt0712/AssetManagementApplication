package com.nt.rookies.assets.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssetDetailsDto {
    private String code;

    private CategoryDto category;

    private String name;

    private String specification;

    private LocalDate installedDate;

    private String state;

    private LocationDto location;

    private String createdBy;

    private LocalDateTime createdDate;

    private String lastUpdatedBy;

    private LocalDateTime lastUpdatedDate;

    private List<AssignmentDetailsDto> assignments;
}
