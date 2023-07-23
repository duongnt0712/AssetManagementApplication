package com.nt.rookies.assets.mapper;

import com.nt.rookies.assets.dto.CategoryDto;
import com.nt.rookies.assets.entity.Category;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class CategoryMapper {
    public static CategoryDto toDto(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        return categoryDto;
    }

    public static Category toEntity(CategoryDto categoryDto) {
        Category category = new Category();
        category.setId(categoryDto.getId());
        category.setName(categoryDto.getName());
        return category;
    }

    public static List<CategoryDto> toDtoList(List<Category> categories) {
        return categories.stream().map(CategoryMapper::toDto).collect(Collectors.toList());
    }

    public static List<CategoryDto> toDtoList(Iterable<Category> categories) {
        List<CategoryDto> categoryDtoList = new LinkedList<>();
        categories.forEach(category -> categoryDtoList.add(toDto(category)));
        return categoryDtoList;
    }
}
