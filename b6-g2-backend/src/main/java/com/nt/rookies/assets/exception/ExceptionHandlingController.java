package com.nt.rookies.assets.exception;

import com.nt.rookies.assets.response.ResponseDataConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class ExceptionHandlingController {

    @ExceptionHandler({Exception.class, RuntimeException.class})
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ResponseEntity<?> handleException(Exception ex) {
        log.error(ex.getMessage(), ex);
        if (ex.toString().contains("AccessDeniedException")) {
            return ResponseDataConfiguration.error(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }
        return ResponseDataConfiguration.error(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler({BusinessException.class, ResponseStatusException.class})
    @ResponseBody
    protected ResponseEntity<?> handleBusinessException(BusinessException ex) {
        log.error(ex.getMessage(), ex);
        if (ex.getHttpStatus() == null) {
            return ResponseDataConfiguration.error(HttpStatus.BAD_REQUEST, ex.getError(), ex.getContent());
        } else {
            return ResponseDataConfiguration.error(ex.getHttpStatus(), ex.getError(), ex.getContent());
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseDataConfiguration.error(HttpStatus.BAD_REQUEST, errors);
    }

    @ExceptionHandler({UsernameNotFoundException.class, AuthenticationException.class})
    @ResponseBody
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException ex) {
        log.error(ex.getMessage(), ex);
        return ResponseDataConfiguration.error(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }
}