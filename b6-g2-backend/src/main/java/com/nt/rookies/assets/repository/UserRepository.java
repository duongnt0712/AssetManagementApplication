package com.nt.rookies.assets.repository;

import com.nt.rookies.assets.entity.Location;
import com.nt.rookies.assets.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, String>, JpaSpecificationExecutor<User> {

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    User findFirstByUsernameContainingOrderByCreatedDateDesc(String username);

    User findFirstByOrderByStaffCodeDesc();

    Page<User> findAll(Specification<User> specification, Pageable pageable);

    List<User> findAllByLocationAndStatus(Location location, boolean status);
}
