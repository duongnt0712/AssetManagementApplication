package com.nt.rookies.assets.entity;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@ToString(exclude = "assets")
@NoArgsConstructor
@Table(name = "categories")
public class Category {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy="category")
    private List<Asset> assets;
}
