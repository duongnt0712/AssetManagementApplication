package com.nt.rookies.assets.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;

@Getter
@Setter
public class BusinessException extends RuntimeException {

    private String error;
    private HttpStatus httpStatus;
    private Object content;

    public BusinessException(String error) {
        this.error = error;
        content = new ArrayList<>();
    }

    public BusinessException(String error, Object content) {
        this.error = error;
        this.content = content;
    }

    public BusinessException(String error, Object content, HttpStatus httpStatus) {
        this.error = error;
        this.content = content;
        this.httpStatus = httpStatus;
    }
}
