package com.nt.rookies.assets.mapper;

import com.nt.rookies.assets.dto.AssetDetailsDto;
import com.nt.rookies.assets.entity.Asset;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class AssetDetailsMapper {
    public static AssetDetailsDto toDto(Asset asset) {
        AssetDetailsDto assetDetailsDto = new AssetDetailsDto();
        assetDetailsDto.setCode(asset.getCode());
        assetDetailsDto.setCategory(CategoryMapper.toDto(asset.getCategory()));
        assetDetailsDto.setName(asset.getName());
        assetDetailsDto.setSpecification(asset.getSpecification());
        assetDetailsDto.setInstalledDate(asset.getInstalledDate());
        assetDetailsDto.setState(asset.getState());
        assetDetailsDto.setLocation(LocationMapper.toDto(asset.getLocation()));
        assetDetailsDto.setCreatedBy(asset.getCreatedBy());
        assetDetailsDto.setCreatedDate(asset.getCreatedDate());
        assetDetailsDto.setLastUpdatedBy(asset.getLastUpdatedBy());
        assetDetailsDto.setLastUpdatedDate(asset.getLastUpdatedDate());
        assetDetailsDto.setAssignments(AssignmentDetailsMapper.toDtoList(asset.getAssignments()));
        return assetDetailsDto;
    }

    public static List<AssetDetailsDto> toDtoList(List<Asset> assets) {
        return assets.stream().map(AssetDetailsMapper::toDto).collect(Collectors.toList());
    }

    public static List<AssetDetailsDto> toDtoList(Iterable<Asset> assets) {
        List<AssetDetailsDto> assetDtoList = new LinkedList<>();
        assets.forEach(asset -> assetDtoList.add(toDto(asset)));
        return assetDtoList;
    }
}
