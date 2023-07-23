package com.nt.rookies.assets.entity;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "locations")
public class Location {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy="location")
    private List<User> users;

    @OneToMany(fetch = FetchType.LAZY,mappedBy="location")
    private List<Asset> assets;
}
