package com.example.student.management.service;

import com.example.student.management.dto.SubjectDTO;
import com.example.student.management.model.Subject;
import com.example.student.management.repository.SubjectRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepo subjectRepo;

    // get all subject
    public List<SubjectDTO> getSubjectsByStudent(Long studentId) {
        return subjectRepo.findByStudentId(studentId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // get one subject
    public SubjectDTO getSubjectById(Long id) {
        Subject subject = subjectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        return mapToDTO(subject);
    }

    // delete
    public void deleteSubject(Long id) {
        if (!subjectRepo.existsById(id)) {
            throw new RuntimeException("Subject not found with id: " + id);
        }
        subjectRepo.deleteById(id);
    }

    // helper
    private SubjectDTO mapToDTO(Subject subject) {
        SubjectDTO dto = new SubjectDTO();
        dto.setName(subject.getName());
        dto.setScore(subject.getScore());
        return dto;
    }
}