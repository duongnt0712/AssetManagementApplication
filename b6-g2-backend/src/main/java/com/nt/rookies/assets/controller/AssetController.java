package com.nt.rookies.assets.controller;

import com.nt.rookies.assets.response.ResponseDataConfiguration;
import com.nt.rookies.assets.service.AssetService;
import com.nt.rookies.assets.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.nt.rookies.assets.dto.AssetDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/v1/assets")
public class AssetController {

    @Autowired
    public AssetService assetService;

    @PostMapping("/{code}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity deleteAsset(@PathVariable("code") String code) {
        return ResponseDataConfiguration.success(assetService.deleteAsset(code));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AssetDto> create(@RequestBody @Valid AssetDto asset) {
        return new ResponseEntity<>(assetService.create(asset), HttpStatus.OK);
    }

    @GetMapping(value = "", params = {"page", "sort", "category", "state", "search"})
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getAllAssets(@PageableDefault Pageable pageable, @RequestParam(value = "category", required = false) String category,
                                       @RequestParam(value = "state", required = false) String state, @RequestParam(value = "search", required = false) String search,
                                       @RequestParam(value = "assetCode", required = false) String assetCode) {
        return ResponseDataConfiguration.success(assetService.getAllAssets(pageable, category, state, search, assetCode));
    }

    @GetMapping("/{code}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getAsset(@PathVariable("code") String code) {
        return ResponseDataConfiguration.success(assetService.getAsset(code));
    }

    @PutMapping("/{code}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AssetDto> update(@PathVariable String code, @RequestBody @Valid AssetDto assetDto) {
        return new ResponseEntity<>(assetService.update(code, assetDto), HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getAllAssetsWithoutFilters() {
        return ResponseDataConfiguration.success(assetService.getAllAssetsWithoutFilters());
    }
}
