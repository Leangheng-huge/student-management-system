package com.example.student.management.controller;

import com.example.student.management.dto.StudentRequestDTO;
import com.example.student.management.dto.StudentResponseDTO;
import com.example.student.management.model.Student;
import com.example.student.management.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
    @Autowired
    private StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getALl(){
        return ResponseEntity.ok(studentService.getAllStudents());
    }
    @PostMapping
    public ResponseEntity<StudentResponseDTO> add(@Valid @RequestBody StudentRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studentService.addStudent(dto));
    }
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> update(@PathVariable Long id,
                                                     @Valid @RequestBody StudentRequestDTO dto){
        return ResponseEntity.ok(studentService.updateStudent(id, dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
