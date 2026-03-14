package com.example.student.management.dto;

import lombok.Data;

import java.util.List;


@Data
public class StudentResponseDTO {
    private Long id;
    private String name;
    private List<SubjectDTO> subjects;
    private Double total;
    private Double average;
    private String grade;
}
