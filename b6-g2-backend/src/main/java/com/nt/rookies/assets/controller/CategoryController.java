package com.nt.rookies.assets.controller;

import com.nt.rookies.assets.dto.CategoryDto;
import com.nt.rookies.assets.response.ResponseDataConfiguration;
import com.nt.rookies.assets.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/v1/categories")
public class CategoryController {
    @Autowired
    public CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity create(@RequestBody @Valid CategoryDto categoryDto) {
        return ResponseDataConfiguration.success(categoryService.create(categoryDto));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getAllCategories() {
        return ResponseDataConfiguration.success(categoryService.findAll());
    }
}
