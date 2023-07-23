package com.nt.rookies.assets.service.impl;

import com.nt.rookies.assets.dto.CategoryDto;
import com.nt.rookies.assets.dto.Report;
import com.nt.rookies.assets.entity.Category;
import com.nt.rookies.assets.entity.Location;
import com.nt.rookies.assets.entity.User;
import com.nt.rookies.assets.exception.BusinessException;
import com.nt.rookies.assets.mapper.CategoryMapper;
import com.nt.rookies.assets.repository.CategoryRepository;
import com.nt.rookies.assets.repository.UserRepository;
import com.nt.rookies.assets.service.CategoryService;
import com.nt.rookies.assets.util.StringConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create new category with auto generated id (prefix)
     *
     * @param categoryDto
     * @return Extract category's name to get the id
     * if id is existed in db and also the name:
     * throw exception: Category is already existed
     * if id is existed in db but the name is different:
     * throw exception: Prefix is already existed
     */
    @Override
    public CategoryDto create(CategoryDto categoryDto) {
        String prefix = categoryDto.getName().substring(0, 2).toUpperCase();
        String name = categoryDto.getName();
        Category fromDB = categoryRepository.findByName(name);
        if (fromDB != null) {
            throw new BusinessException("Category is already existed. Please enter a different category");
        }
        //if category is found by id with its name
        if (categoryRepository.findById(name).isPresent()) {
            throw new BusinessException("Prefix is already existed. Please enter a different name");
        }
        //Remove space in name to perform finding method on category containing id by name
        String[] nameArr = name.trim().split(" ");
        name = String.join("", nameArr);
        //loop to find the latest category containing id in the database
        for (int i = name.length(); i > 1; i--) {
            //if found, set the new id for the category with the old id plus next character in the category name
            Category category = categoryRepository.findFirstByIdContainingOrderByIdAsc(name.substring(0, i));
            if (category != null) {
                int k = category.getId().length();
                k++;
                prefix = name.substring(0, k).toUpperCase();
                break;
            }
        }
        categoryDto.setId(StringConvert.convert(prefix));
        return CategoryMapper.toDto(categoryRepository.save(CategoryMapper.toEntity(categoryDto)));
    }

    @Override
    public List<CategoryDto> findAll() {
        return CategoryMapper.toDtoList(categoryRepository.findAll());
    }

    @Override
    public Page<Report> findReportWithPagination(Pageable pageable, String search) {
        // Get current admin location
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).get();
        Location location = currentUser.getLocation();

        return categoryRepository.findReportWithPagination(pageable, location.getId());
    }

    @Override
    public List<Report> findAllReport() {
        // Get current admin location
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).get();
        Location location = currentUser.getLocation();
        return categoryRepository.findAllReport(location.getId());
    }
}
