package com.nt.rookies.assets.service;

import com.nt.rookies.assets.dto.AssetDetailsDto;
import com.nt.rookies.assets.dto.AssetDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AssetService {

    public AssetDto create(AssetDto asset);

    public Page<AssetDetailsDto> getAllAssets(Pageable pageable, String category, String state, String search, String assetCode);

    public AssetDetailsDto getAsset(String code);

    public AssetDto update(String code, AssetDto assetDto);

    Boolean deleteAsset(String username);

    public List<AssetDto> getAllAssetsWithoutFilters();
}
