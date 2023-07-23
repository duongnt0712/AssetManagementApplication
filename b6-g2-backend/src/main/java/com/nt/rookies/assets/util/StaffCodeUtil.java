package com.nt.rookies.assets.util;

public class StaffCodeUtil {
    public static String staffCodeGenerator(int i) {
        String firstPattern = "SD";
        i++;
        String secondPattern = String.format("%04d", i);
        String newStaffcode = firstPattern + secondPattern;
        return newStaffcode;
    }
}
