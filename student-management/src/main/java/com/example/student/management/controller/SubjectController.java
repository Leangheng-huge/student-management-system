package com.example.student.management.controller;

import com.example.student.management.dto.SubjectDTO;
import com.example.student.management.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    // GET /api/students/{studentId}/subjects
    @GetMapping("/students/{studentId}/subjects")
    public ResponseEntity<List<SubjectDTO>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(subjectService.getSubjectsByStudent(studentId));
    }

    // GET /api/subjects/{id}
    @GetMapping("/subjects/{id}")
    public ResponseEntity<SubjectDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    // DELETE /api/subjects/{id}
    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}