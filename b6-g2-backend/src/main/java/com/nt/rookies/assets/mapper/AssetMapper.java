package com.nt.rookies.assets.mapper;

import com.nt.rookies.assets.dto.AssetDto;
import com.nt.rookies.assets.entity.Asset;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class AssetMapper {
    public static AssetDto toDto(Asset asset) {
        AssetDto assetDto = new AssetDto();
        assetDto.setCode(asset.getCode());
        assetDto.setCategory(CategoryMapper.toDto(asset.getCategory()));
        assetDto.setName(asset.getName());
        assetDto.setSpecification(asset.getSpecification());
        assetDto.setInstalledDate(asset.getInstalledDate());
        assetDto.setState(asset.getState());
        assetDto.setLocation(LocationMapper.toDto(asset.getLocation()));
        assetDto.setCreatedBy(asset.getCreatedBy());
        assetDto.setCreatedDate(asset.getCreatedDate());
        assetDto.setLastUpdatedBy(asset.getLastUpdatedBy());
        assetDto.setLastUpdatedDate(asset.getLastUpdatedDate());
        return assetDto;
    }

    public static Asset toEntity(AssetDto assetDto) {
        Asset asset = new Asset();
        asset.setCode(assetDto.getCode());
        asset.setCategory(CategoryMapper.toEntity(assetDto.getCategory()));
        asset.setName(assetDto.getName());
        asset.setSpecification(assetDto.getSpecification());
        asset.setInstalledDate(assetDto.getInstalledDate());
        asset.setState(assetDto.getState());
        asset.setLocation(LocationMapper.toEntity(assetDto.getLocation()));
        asset.setCreatedBy(assetDto.getCreatedBy());
        asset.setCreatedDate(assetDto.getCreatedDate());
        asset.setLastUpdatedBy(assetDto.getLastUpdatedBy());
        asset.setLastUpdatedDate(assetDto.getLastUpdatedDate());
        return asset;
    }

    public static List<AssetDto> toDtoList(List<Asset> assets) {
        return assets.stream().map(AssetMapper::toDto).collect(Collectors.toList());
    }

    public static List<AssetDto> toDtoList(Iterable<Asset> assets) {
        List<AssetDto> assetDtoList = new LinkedList<>();
        assets.forEach(asset -> assetDtoList.add(toDto(asset)));
        return assetDtoList;
    }
}
