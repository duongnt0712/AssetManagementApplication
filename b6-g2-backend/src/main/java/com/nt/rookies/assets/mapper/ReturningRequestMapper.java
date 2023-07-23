package com.nt.rookies.assets.mapper;

import com.nt.rookies.assets.dto.ReturningRequestDto;
import com.nt.rookies.assets.entity.ReturningRequest;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class ReturningRequestMapper {
    public static ReturningRequestDto toDto(ReturningRequest returningRequest) {
        ReturningRequestDto returningRequestDto = new ReturningRequestDto();
        returningRequestDto.setId(returningRequest.getId());
        returningRequestDto.setAssignment(AssignmentMapper.toDto(returningRequest.getAssignment()));
        returningRequestDto.setRequestedBy(UserMapper.toDto(returningRequest.getRequestedBy()));
        returningRequestDto.setReturnedDate(returningRequest.getReturnedDate());
        returningRequestDto.setState(returningRequest.getState());
        returningRequestDto.setCreatedBy(returningRequest.getCreatedBy());
        returningRequestDto.setCreatedDate(returningRequest.getCreatedDate());
        returningRequestDto.setLastUpdatedBy(returningRequest.getLastUpdatedBy());
        returningRequestDto.setLastUpdatedDate(returningRequest.getLastUpdatedDate());
        if (returningRequest.getAcceptedBy()!= null) {
            returningRequestDto.setAcceptedBy(UserMapper.toDto(returningRequest.getAcceptedBy()));
        }
        return returningRequestDto;
    }

    public static ReturningRequest toEntity(ReturningRequestDto returningRequestDto) {
        ReturningRequest returningRequest = new ReturningRequest();
        returningRequest.setId(returningRequestDto.getId());
        returningRequest.setAssignment(AssignmentMapper.toEntity(returningRequestDto.getAssignment()));
        returningRequest.setRequestedBy(UserMapper.toEntity(returningRequestDto.getRequestedBy()));
        returningRequest.setReturnedDate(returningRequestDto.getReturnedDate());
        returningRequest.setState(returningRequestDto.getState());
        returningRequest.setCreatedBy(returningRequestDto.getCreatedBy());
        returningRequest.setCreatedDate(returningRequestDto.getCreatedDate());
        returningRequest.setLastUpdatedBy(returningRequestDto.getLastUpdatedBy());
        returningRequest.setLastUpdatedDate(returningRequestDto.getLastUpdatedDate());
        if (returningRequestDto.getAcceptedBy() != null) {
            returningRequest.setAcceptedBy(UserMapper.toEntity(returningRequestDto.getAcceptedBy()));
        }
        return returningRequest;
    }
    public static List<ReturningRequestDto> toDtoList(List<ReturningRequest> returningRequests) {
        return returningRequests.stream().map(ReturningRequestMapper::toDto).collect(Collectors.toList());
    }

    public static List<ReturningRequestDto> toDtoList(Iterable<ReturningRequest> returningRequests) {
        List<ReturningRequestDto> returningRequestDtoList = new LinkedList<>();
        returningRequests.forEach(asset -> returningRequestDtoList.add(toDto(asset)));
        return returningRequestDtoList;
    }
}
