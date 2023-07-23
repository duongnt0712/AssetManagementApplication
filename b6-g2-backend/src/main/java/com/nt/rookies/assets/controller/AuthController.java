package com.nt.rookies.assets.controller;

import com.nt.rookies.assets.entity.RefreshToken;
import com.nt.rookies.assets.entity.User;
import com.nt.rookies.assets.exception.TokenRefreshException;
import com.nt.rookies.assets.security.jwt.JwtUtils;
import com.nt.rookies.assets.repository.UserRepository;
import com.nt.rookies.assets.request.LoginRequest;
import com.nt.rookies.assets.request.TokenRefreshRequest;
import com.nt.rookies.assets.response.JwtResponse;
import com.nt.rookies.assets.response.TokenRefreshResponse;
import com.nt.rookies.assets.security.UserDetailsImpl;
import com.nt.rookies.assets.security.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(userDetails);
        String role = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority()).findFirst().get();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());

        // check if isFirstTimeLogin
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
        // if user status in db is null,
        boolean isFirstTimeLogin = user != null && user.getStatus() == null;

        return ResponseEntity.ok(new JwtResponse(jwt,
                refreshToken.getToken(),
                userDetails.getUsername(),
                role,
                isFirstTimeLogin));
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateTokenFromUsername(user.getUsername());
                    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());
                    return ResponseEntity.ok(new TokenRefreshResponse(token, refreshToken.getToken()));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));
    }
}
