package com.nt.rookies.assets.service;

import com.nt.rookies.assets.dto.CategoryDto;
import com.nt.rookies.assets.dto.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {

    public CategoryDto create(CategoryDto categoryDto);

    public List<CategoryDto> findAll();

    public Page<Report> findReportWithPagination(Pageable pageable, String search);

    public List<Report> findAllReport ();
}
