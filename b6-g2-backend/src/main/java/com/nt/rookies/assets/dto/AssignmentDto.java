package com.nt.rookies.assets.dto;

import com.nt.rookies.assets.entity.Asset;
import com.nt.rookies.assets.entity.User;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentDto {

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
}
