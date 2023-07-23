package com.nt.rookies.assets.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseData implements Serializable {

    private String error;
    private Boolean success;
    private Object content;

    public ResponseData (Object content) {
        this.content = content;
        this.success = true;
    }

    public ResponseData(String error) {
        this.error = error;
        this.success = false;
    }

    public ResponseData (Boolean isSuccess, Object content) {
        this.content = content;
        this.success = isSuccess;
    }

    public ResponseData (Boolean isSuccess, String error, Object content) {
        this.content = content;
        this.success = isSuccess;
        this.error = error;
    }
}