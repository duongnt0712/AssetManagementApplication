package com.nt.rookies.assets.service;

import com.nt.rookies.assets.dto.ReturningRequestDto;
import com.nt.rookies.assets.entity.ReturningRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface ReturningRequestService {
    public ReturningRequestDto create(ReturningRequestDto returningRequestDto);

    ReturningRequestDto completeReturnRequest(Integer id);

    Boolean cancelReturnRequest(Integer id);

    public Page<ReturningRequestDto> getAllReturningRequests(Pageable pageable, LocalDate returnedDate, String state, String search);

    public ReturningRequestDto getReturningRequest(Integer id);
}
