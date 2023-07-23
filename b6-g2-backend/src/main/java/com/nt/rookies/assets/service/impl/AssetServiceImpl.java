package com.nt.rookies.assets.service.impl;

import com.nt.rookies.assets.dto.AssetDetailsDto;
import com.nt.rookies.assets.entity.Asset;
import com.nt.rookies.assets.entity.Assignment;
import com.nt.rookies.assets.repository.AssetRepository;
import com.nt.rookies.assets.repository.AssignmentRepository;
import com.nt.rookies.assets.dto.AssetDto;
import com.nt.rookies.assets.entity.Category;
import com.nt.rookies.assets.entity.Location;
import com.nt.rookies.assets.entity.User;
import com.nt.rookies.assets.mapper.AssetDetailsMapper;
import com.nt.rookies.assets.mapper.AssetMapper;
import com.nt.rookies.assets.exception.BadRequestException;
import com.nt.rookies.assets.mapper.LocationMapper;
import com.nt.rookies.assets.repository.CategoryRepository;
import com.nt.rookies.assets.repository.UserRepository;
import com.nt.rookies.assets.service.AssetService;
import com.nt.rookies.assets.util.AssetCodeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AssetServiceImpl implements AssetService {
    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public AssignmentRepository assignmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Boolean deleteAsset(String code) {
        Asset asset = assetRepository.findByCode(code).orElse(null);
        List<Assignment> assignments = assignmentRepository.findAllByAsset(asset);
        if (asset != null) {
            if (assignments.isEmpty() && asset.getState().equalsIgnoreCase("Available")) {
                asset.setState("Recycled");
                assetRepository.save(asset);
                return true;
            } else {
                return false;
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "asset not found");
        }
    }

    @Override
    public AssetDto create(AssetDto asset) {
        try {
            //Get the category name of the asset
            String assetCategoryName = asset.getCategory().getName();
            //Get the category of the asset
            Category assetCategory = categoryRepository.findByName(assetCategoryName);
            //Find the first asset containing the pattern in its code in descending order
            Asset newestAssetContainsCategory = assetRepository.findFirstByCategoryOrderByCreatedDateDesc(assetCategory);
            //In case there is no asset containing the pattern in code
            if (newestAssetContainsCategory == null) {
                //Set the asset code with prefix of category and 1 at the end
                asset.setCode(AssetCodeUtil.assetCodeGenerator(asset, 0));
            } else {
                //Set the asset code with the prefix of category and add 1 to the code of the asset found
                String newestCode = newestAssetContainsCategory.getCode();
                int i = Integer.parseInt(newestCode.replace(newestAssetContainsCategory.getCategory().getId(), ""));
                asset.setCode(AssetCodeUtil.assetCodeGenerator(asset, i));
            }
            //Find the admin username who logged in to the system to create user
            String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            //Find the location of the admin by username
            Location adminLocation = userRepository.findByUsername(adminUsername).get().getLocation();
            //Set location of new asset as the location of admin creating them
            asset.setLocation(LocationMapper.toDto(adminLocation));
            asset.setCreatedDate(LocalDateTime.now());
            asset.setCreatedBy(adminUsername);
            asset.setLastUpdatedDate(LocalDateTime.now());
            asset.setLastUpdatedBy(adminUsername);
            return AssetMapper.toDto(assetRepository.save(AssetMapper.toEntity(asset)));
        } catch (NullPointerException e) {
            throw Objects.nonNull(e.getMessage()) ? new BadRequestException(e.getMessage()) : new BadRequestException(e);
        }
    }

    @Override
    public Page<AssetDetailsDto> getAllAssets(Pageable pageable, String category, String state, String search, String assetCode) {
        // Get current admin location
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).get();
        Location location = currentUser.getLocation();

        // Get search category
        Category categoryFromDb = categoryRepository.findById(category).orElse(null);

        // check if search have value
        // verify if search keyword contains only space characters
        List<String> keywords = StringUtils.hasLength(search.trim()) ?
                Arrays.stream(search.split(",")).map(keyword -> keyword.trim()).collect(Collectors.toList()) :
                Arrays.asList(search.split(","));

        Page<AssetDetailsDto> assetDetailsDtos = assetRepository.findAll((root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            // search by keywords
            if (keywords != null) {
                List<Predicate> predicatesKeyword = new ArrayList<>();
                for (String keyword : keywords) {
                    // search by code
                    predicatesKeyword.add(builder.like(builder.lower(root.get("code")), "%" + keyword.toLowerCase() + "%"));
                    // search by name
                    predicatesKeyword.add(builder.like(builder.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
                }
                predicates.add(builder.or(predicatesKeyword.toArray(new Predicate[0])));
            }
            // search by category
            if (StringUtils.hasLength(category) && categoryFromDb != null) {
                predicates.add(builder.equal(root.get("category"), categoryFromDb));
            }

            // search by state default by Available, Not available, Assigned
            if (StringUtils.hasLength(state) && !StringUtils.hasLength(assetCode)) {
                predicates.add(builder.equal(root.get("state"), state));
            // search by state Available only and return all records that matches Available state and the assetCode (for edit assignment)
            }
            if (StringUtils.hasLength(state) && StringUtils.hasLength(assetCode) && state.equals("Available")) {
                predicates.add(builder.or(
                    builder.equal(root.get("state"), "Available"),
                    builder.and(
                        builder.equal(root.get("state"), "Waiting for acceptance"),
                        builder.like(builder.lower(root.get("code")), "%" + assetCode.toLowerCase() + "%")
                    )
                ));
            }

            // search by admin's location
            predicates.add(builder.equal(root.get("location"), location));

            return builder.and(predicates.toArray(new Predicate[]{}));
        }, pageable).map(AssetDetailsMapper::toDto);
        return assetDetailsDtos;
    }

    @Override
    public AssetDetailsDto getAsset(String code) {
        Asset fromDB = assetRepository.findById(code).orElse(null);
        if (fromDB != null) {
            return AssetDetailsMapper.toDto(fromDB);
        }
        return null;
    }

    @Override
    public AssetDto update(String code, AssetDto assetDto) {
        Asset fromDB = assetRepository.findById(code).get();
        if (fromDB == null) {
            return null;
        }
        assetDto.setCode(code);
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        assetDto.setLastUpdatedBy(adminUsername);
        assetDto.setLastUpdatedDate(LocalDateTime.now());
        return AssetMapper.toDto(assetRepository.save(AssetMapper.toEntity(assetDto)));
    }

    @Override
    public List<AssetDto> getAllAssetsWithoutFilters() {
        // Get current admin location
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).get();
        Location location = currentUser.getLocation();

        // get all available asset from admin location
        return AssetMapper.toDtoList(assetRepository.findAllByLocationAndState(location, "Available"));
    }
}
