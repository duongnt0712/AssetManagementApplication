package com.nt.rookies.assets.util;

import com.nt.rookies.assets.dto.Report;
import org.apache.commons.codec.binary.Base64;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class ExcelExporter {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;

    private List<Report> records;

    public ExcelExporter(List<Report> records) {
        this.records = records;
        workbook = new XSSFWorkbook();
        sheet = workbook.createSheet("Report");
    }

    private void writeHeaderRow() {
        // Background color
        XSSFCellStyle style = workbook.createCellStyle();
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
        style.setBorderBottom(BorderStyle.MEDIUM);
        style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderRight(BorderStyle.MEDIUM);
        style.setRightBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderLeft(BorderStyle.MEDIUM);
        style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderTop(BorderStyle.MEDIUM);
        style.setTopBorderColor(IndexedColors.BLACK.getIndex());

        //Header text style
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);

        Row row = sheet.createRow(0);

        Cell cell = row.createCell(0);
        cell.setCellValue("Category");
        cell.setCellStyle(style);

        cell = row.createCell(1);
        cell.setCellValue("Total");
        cell.setCellStyle(style);

        cell = row.createCell(2);
        cell.setCellValue("Assigned");
        cell.setCellStyle(style);

        cell = row.createCell(3);
        cell.setCellValue("Available");
        cell.setCellStyle(style);

        cell = row.createCell(4);
        cell.setCellValue("Not available");
        cell.setCellStyle(style);

        cell = row.createCell(5);
        cell.setCellValue("Recycled");
        cell.setCellStyle(style);

        cell = row.createCell(6);
        cell.setCellValue("Waiting for acceptance");
        cell.setCellStyle(style);

        cell = row.createCell(7);
        cell.setCellValue("Waiting for recycling");
        cell.setCellStyle(style);
    }

    private void writeDataRows() {
        // Styling border of cell.
        XSSFCellStyle borderStyle = workbook.createCellStyle();
        borderStyle.setBorderBottom(BorderStyle.MEDIUM);
        borderStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        borderStyle.setBorderRight(BorderStyle.MEDIUM);
        borderStyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
        borderStyle.setBorderLeft(BorderStyle.MEDIUM);
        borderStyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        borderStyle.setBorderTop(BorderStyle.MEDIUM);
        borderStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());

        int rowCount = 1;

        for (Report record : records) {
            Row row = sheet.createRow(rowCount++);

            Cell cell = row.createCell(0);
            cell.setCellValue(record.getCategory());
            sheet.autoSizeColumn(0);
            cell.setCellStyle(borderStyle);

            cell = row.createCell(1);
            cell.setCellValue(record.getTotal());
            sheet.autoSizeColumn(1);
            cell.setCellStyle(borderStyle);

            cell = row.createCell(2);
            cell.setCellValue(record.getAssigned());
            sheet.autoSizeColumn(2);
            cell.setCellStyle(borderStyle);

            cell = row.createCell(3);
            cell.setCellValue(record.getAvailable());
            sheet.autoSizeColumn(3);
            cell.setCellStyle(borderStyle);

            cell = row.createCell(4);
            cell.setCellValue(record.getNotAvailable());
            sheet.autoSizeColumn(4);
            cell.setCellStyle(borderStyle);

            cell = row.createCell(5);
            cell.setCellValue(record.getRecycled());
            sheet.autoSizeColumn(5);
            cell.setCellStyle(borderStyle);

            cell = row.createCell(6);
            cell.setCellValue(record.getWaitingForAcceptance());
            sheet.autoSizeColumn(6);
            cell.setCellStyle(borderStyle);

            cell = row.createCell(7);
            cell.setCellValue(record.getWaitingForRecycling());
            sheet.autoSizeColumn(7);
            cell.setCellStyle(borderStyle);

        }
    }

    public String export(){
        writeHeaderRow();
        writeDataRows();

        try(ByteArrayOutputStream byteArrayOutputStream =new ByteArrayOutputStream()){
            workbook.write(byteArrayOutputStream);
            return Base64.encodeBase64String(byteArrayOutputStream.toByteArray());
        }catch (IOException e){
            e.printStackTrace();
            throw new RuntimeException("Error while generating excel.");
        }
    }
}
