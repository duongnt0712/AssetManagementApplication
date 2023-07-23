package com.nt.rookies.assets.util;

import com.nt.rookies.assets.dto.UserDto;

public class UsernameUtil {

    public static String usernameGenerator(UserDto user) {
        String[] firstPatternArr = user.getFirstName().toLowerCase().trim().split(" ");
        String firstPattern = String.join("", firstPatternArr);
        StringBuilder initials = new StringBuilder();
        for (String s : user.getLastName().toLowerCase().split(" ")) {
            initials.append(s.charAt(0));
        }
        String[] secondPatternArr = initials.toString().trim().split(" ");
        String secondPattern = String.join("", secondPatternArr);
        String newUsername = StringConvert.convert(firstPattern + secondPattern);
        return newUsername;
    }
    public static int value(int i)
    {
        i++;
        return i;
    }
    public static boolean isInteger(String str) {
        if (str == null) {
            return false;
        }
        int length = str.length();
        if (length == 0) {
            return false;
        }
        int i = 0;
        if (str.charAt(0) == '-') {
            if (length == 1) {
                return false;
            }
            i = 1;
        }
        for (; i < length; i++) {
            char c = str.charAt(i);
            if (c < '0' || c > '9') {
                return false;
            }
        }
        return true;
    }
}
