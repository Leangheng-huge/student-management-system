package com.example.student.management.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class SubjectDTO {
  @NotBlank
    private String name;

  @Min(0)@Max(100)
    private Double score;
}
