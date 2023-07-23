package com.nt.rookies.assets.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private String username;
    private String role;

    private Boolean isFirstTimeLogin;

    public JwtResponse(String token, String refreshToken, String username, String role, Boolean isFirstTimeLogin) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.username = username;
        this.role = role;
        this.isFirstTimeLogin = isFirstTimeLogin;
    }
}
