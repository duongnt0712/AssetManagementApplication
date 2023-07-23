package com.nt.rookies.assets.mapper;

import com.nt.rookies.assets.dto.LocationDto;
import com.nt.rookies.assets.entity.Location;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class LocationMapper {
    public static LocationDto toDto(Location location) {
        LocationDto locationDto = new LocationDto();
        locationDto.setId(location.getId());
        locationDto.setName(location.getName());
        return locationDto;
    }

    public static Location toEntity(LocationDto locationDto) {
        Location location = new Location();
        location.setId(locationDto.getId());
        location.setName(locationDto.getName());
        return location;
    }

    public static List<LocationDto> toDtoList(List<Location> locations) {
        return locations.stream().map(LocationMapper::toDto).collect(Collectors.toList());
    }

    public static List<LocationDto> toDtoList(Iterable<Location> locations) {
        List<LocationDto> locationDtoList = new LinkedList<>();
        locations.forEach(location -> locationDtoList.add(toDto(location)));
        return locationDtoList;
    }
}
