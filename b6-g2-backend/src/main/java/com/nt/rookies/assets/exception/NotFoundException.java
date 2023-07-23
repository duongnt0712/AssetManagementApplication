package com.nt.rookies.assets.exception;

public class NotFoundException extends RuntimeException{
    public NotFoundException() {}
    public NotFoundException(Throwable cause) {
        super(cause);
    }
    public NotFoundException(String msg) {
        super(msg);
    }
}
