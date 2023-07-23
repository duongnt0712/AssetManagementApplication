package com.nt.rookies.assets.util;

import com.nt.rookies.assets.dto.AssetDto;

public class AssetCodeUtil {
    public static String assetCodeGenerator(AssetDto asset, int i) {
        String firstPattern = asset.getCategory().getId();
        i++;
        String secondPattern = String.format("%06d", i);
        String newAssetCode = StringConvert.convert(firstPattern + secondPattern);
        return newAssetCode;
    }
}
