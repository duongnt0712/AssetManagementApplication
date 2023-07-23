package com.nt.rookies.assets.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {


    private String username;

    @JsonIgnore
    private String password;

    @NotEmpty
    @Size(max = 50, message = "First Name is less than 50 characters")
    private String firstName;

    @NotEmpty
    @Size(max = 50, message = "Last Name is less than 50 characters")
    private String lastName;

    private LocalDate dob;

    private LocalDate joinedDate;

    @NotEmpty
    private String gender;

    @NotEmpty
    private String type;

    private String staffCode;

    private Boolean status;

    private LocationDto location;

    private String createdBy;

    private LocalDateTime createdDate;

    private String lastUpdatedBy;

    private LocalDateTime lastUpdatedDate;
}
