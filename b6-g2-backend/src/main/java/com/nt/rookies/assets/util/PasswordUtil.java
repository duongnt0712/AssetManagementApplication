package com.nt.rookies.assets.util;

import com.nt.rookies.assets.dto.UserDto;

import java.time.format.DateTimeFormatter;

public class PasswordUtil {
    public final static DateTimeFormatter DATE_FORMATTER = DateTimeFormatter
            .ofPattern("dd/MM/yyyy");
    public static String passwordFormatter(UserDto user) {
        String firstPattern = user.getUsername();
        String secondPattern = "@";
        String thirdPattern = DATE_FORMATTER.format(user.getDob()).replace("/", "");
        String newPassword = firstPattern + secondPattern + thirdPattern;
        return newPassword;

    }
}
