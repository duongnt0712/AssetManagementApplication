package com.nt.rookies.assets.controller;

import com.nt.rookies.assets.dto.UserDto;
import com.nt.rookies.assets.response.ResponseDataConfiguration;
import com.nt.rookies.assets.service.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/v1/users")
public class UserController {
    @Autowired
    public UserService userService;

    @GetMapping(value = "", params = {"page", "sort", "type", "search"})
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getAllUsers(@PageableDefault Pageable pageable, @RequestParam(value="type", required = false) String type,
                                      @RequestParam(value="search", required = false) String search,
                                      @RequestParam(value="status", required = false) Boolean status) {
        return ResponseDataConfiguration.success(userService.getAllUsers(pageable, type, search, status));
    }

    @GetMapping("/{username}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getUser(@PathVariable("username") String username) {
        return ResponseDataConfiguration.success(userService.getUser(username));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserDto> create(@RequestBody @Valid UserDto user) {
        return new ResponseEntity<>(userService.create(user), HttpStatus.OK);
    }

    @PostMapping("/password")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity changePassword(@RequestParam("password") String password, @RequestParam(required = false, value = "oldPassword") String oldPassword) {
        return ResponseDataConfiguration.success(userService.changePassword(password, oldPassword));
    }

    @PostMapping("/{username}/disable")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity disableUser(@PathVariable("username") String username) {
        return ResponseDataConfiguration.success(userService.disableUser(username));
    }

    @PutMapping("/{username}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserDto> update(@PathVariable String username, @RequestBody @Valid UserDto userDto) {
        return new ResponseEntity<>(userService.update(username, userDto), HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getAllUsersWithoutFilters() {
        return ResponseDataConfiguration.success(userService.getAllUsersWithoutFilters());
    }
}
