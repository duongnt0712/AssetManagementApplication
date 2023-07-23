package com.nt.rookies.assets.repository;

import com.nt.rookies.assets.dto.Report;
import com.nt.rookies.assets.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends CrudRepository<Category, String> {
    Category findFirstByIdContainingOrderByIdAsc(String id);

    Category findByName(String name);

    @Query(value = "SELECT c.name AS category, COUNT(c.name) AS total,\n" +
            "COUNT(CASE WHEN state = 'Assigned' THEN a.code END) AS assigned,\n" +
            "COUNT(CASE WHEN state = 'Available' THEN a.code END) AS available,\n" +
            "COUNT(CASE WHEN state = 'Not available' THEN a.code END) AS notAvailable,\n" +
            "COUNT(CASE WHEN state = 'Waiting for recycling' THEN a.code END) AS waitingForRecycling,\n" +
            "COUNT(CASE WHEN state = 'Waiting for acceptance' THEN a.code END) AS waitingForAcceptance,\n" +
            "COUNT(CASE WHEN state = 'Recycled' THEN a.code END) AS recycled\n" +
            "FROM categories AS c\n" +
            "LEFT JOIN assets AS a ON c.id = a.category\n" +
            "WHERE c.id = a.category AND a.location_id = :locationId " +
            "GROUP BY c.name",
            countQuery = "SELECT COUNT(*) FROM categories AS c\n" +
                    "LEFT JOIN assets AS a ON c.id = a.category\n" +
                    "WHERE c.id = a.category\n" +
                    "GROUP BY c.name",
            nativeQuery = true)
    Page<Report> findReportWithPagination(Pageable pageable, @Param("locationId") String locationId);

    @Query (value = "SELECT c.name AS category, COUNT(c.name) AS total,\n" +
            "COUNT(CASE WHEN state = 'Assigned' THEN a.code END) AS assigned,\n" +
            "COUNT(CASE WHEN state = 'Available' THEN a.code END) AS available,\n" +
            "COUNT(CASE WHEN state = 'Not available' THEN a.code END) AS notAvailable,\n" +
            "COUNT(CASE WHEN state = 'Waiting for recycling' THEN a.code END) AS waitingForRecycling,\n" +
            "COUNT(CASE WHEN state = 'Waiting for acceptance' THEN a.code END) AS waitingForAcceptance,\n" +
            "COUNT(CASE WHEN state = 'Recycled' THEN a.code END) AS recycled\n" +
            "FROM categories AS c\n" +
            "LEFT JOIN assets AS a ON c.id = a.category\n" +
            "WHERE c.id = a.category AND a.location_id = :locationId " +
            "GROUP BY c.name",
            nativeQuery = true)
    List<Report> findAllReport(@Param("locationId") String locationId);
}
