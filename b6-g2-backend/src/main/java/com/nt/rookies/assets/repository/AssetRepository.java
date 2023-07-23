package com.nt.rookies.assets.repository;

import com.nt.rookies.assets.entity.Asset;
import com.nt.rookies.assets.entity.Category;
import com.nt.rookies.assets.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends CrudRepository<Asset, String> {
    Optional<Asset> findByCode(String code);

    Asset findFirstByCategoryOrderByCreatedDateDesc(Category category);

    Page<Asset> findAll(Specification<Asset> specification, Pageable pageable);

    List<Asset> findAllByLocationAndState(Location location, String state);
}
