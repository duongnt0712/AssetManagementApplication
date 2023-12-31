package com.nt.rookies.assets.repository;

import com.nt.rookies.assets.entity.ReturningRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturningRequestRepository extends CrudRepository<ReturningRequest, Integer> {
    Page<ReturningRequest> findAll(Specification<ReturningRequest> specification, Pageable pageable);
}
