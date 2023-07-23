package com.nt.rookies.assets.dto;

public interface Report {
    String getCategory();
    Integer getTotal();
    Integer getAssigned();
    Integer getAvailable();
    Integer getNotAvailable();
    Integer getWaitingForRecycling();
    Integer getWaitingForAcceptance();
    Integer getRecycled();
}
