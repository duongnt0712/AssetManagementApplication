package com.nt.rookies.assets.repository;

import com.nt.rookies.assets.dto.UserDto;
import com.nt.rookies.assets.entity.Asset;
import com.nt.rookies.assets.entity.Assignment;
import com.nt.rookies.assets.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends CrudRepository<Assignment, Integer> {
    List<Assignment> findAllByAssignedTo(User user);

    List<Assignment> findAllByAsset(Asset asset);

    Page<Assignment> findAll(Specification<Assignment> specification, Pageable pageable);
}
