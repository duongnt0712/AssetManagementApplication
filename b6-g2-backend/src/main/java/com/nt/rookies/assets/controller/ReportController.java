package com.nt.rookies.assets.controller;

import com.nt.rookies.assets.dto.Report;
import com.nt.rookies.assets.response.ResponseDataConfiguration;
import com.nt.rookies.assets.service.CategoryService;
import com.nt.rookies.assets.util.ExcelExporter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/reports")
public class ReportController {

    @Autowired
    public CategoryService categoryService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity getReportWithPagination(@PageableDefault Pageable pageable, @RequestParam(value = "search", required = false) String search) {
        return ResponseDataConfiguration.success(categoryService.findReportWithPagination(pageable, search));
    }

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> exportReport() {

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Disposition", "attachment; filename=" + "report.xlsx");
        List<Report> reports = categoryService.findAllReport();
        ExcelExporter excelExporter = new ExcelExporter(reports);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .headers(httpHeaders)
                .body(excelExporter.export());
    }
}
