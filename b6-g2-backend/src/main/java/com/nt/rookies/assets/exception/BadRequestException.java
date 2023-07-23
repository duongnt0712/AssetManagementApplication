package com.nt.rookies.assets.exception;

public class BadRequestException extends RuntimeException{
    public BadRequestException() {}
    public BadRequestException(Throwable cause) {
        super(cause);
    }
    public BadRequestException(String msg) {
        super(msg);
    }
}
