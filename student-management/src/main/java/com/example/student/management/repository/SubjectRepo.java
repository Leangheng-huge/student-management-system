package com.example.student.management.repository;

import com.example.student.management.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepo extends JpaRepository<Subject,Long> {
    List<Subject> findByNameContainingIgnoreCase (String name);
    List<Subject> findByStudentId(Long studentId);
}
