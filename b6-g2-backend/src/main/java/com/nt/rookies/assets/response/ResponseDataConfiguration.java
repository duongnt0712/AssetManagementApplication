package com.nt.rookies.assets.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseDataConfiguration {
    public static <T> ResponseEntity<T> success(T body) {
        ResponseData responseData = new ResponseData(body);
        return new ResponseEntity(responseData, HttpStatus.OK);
    }

    public static ResponseEntity error(HttpStatus httpStatus, String errorCode) {
        ResponseData responseData = new ResponseData(errorCode);
        return new ResponseEntity(responseData, httpStatus);
    }

    public static ResponseEntity error(HttpStatus httpStatus, Object content) {
        ResponseData responseData = new ResponseData(false, content);
        return new ResponseEntity(responseData, httpStatus);
    }

    public static ResponseEntity error(HttpStatus httpStatus, String errorCode, Object content) {
        ResponseData responseData = new ResponseData(false, errorCode, content);
        return new ResponseEntity(responseData, httpStatus);
    }
}
