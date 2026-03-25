package com.example.student.management.dto;

import com.example.student.management.model.Subject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class StudentRequestDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotEmpty(message = "At least one subject is required")
    private List<Subject> subjects;
}
