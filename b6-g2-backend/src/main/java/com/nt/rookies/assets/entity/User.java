package com.nt.rookies.assets.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "joined_date")
    private LocalDate joinedDate;

    @Column(name = "gender")
    private String gender;

    @Column(name = "type")
    private String type;

    @Column(name = "staff_code")
    private String staffCode;

    @Column(name = "status")
    private Boolean status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="location_id")
    private Location location;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "last_updated_by")
    private String lastUpdatedBy;

    @Column(name = "last_updated_date")
    private LocalDateTime lastUpdatedDate;

    @OneToMany(mappedBy="assignedBy")
    private List<Assignment> reporters;

    @OneToMany(mappedBy="assignedTo")
    private List<Assignment> assignees;

    @OneToMany(mappedBy="requestedBy")
    private List<ReturningRequest> requesters;

    @OneToMany(mappedBy="acceptedBy")
    private List<ReturningRequest> acceptors;

    public User(String username, String password, String type) {
        this.username = username;
        this.password = password;
        this.type = type;
    }

    public User(String username, String password, String type, Boolean status) {
        this.username = username;
        this.password = password;
        this.type = type;
        this.status = status;
    }
}
