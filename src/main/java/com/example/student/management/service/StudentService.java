package com.example.student.management.service;

import com.example.student.management.dto.StudentRequestDTO;
import com.example.student.management.dto.StudentResponseDTO;
import com.example.student.management.dto.SubjectDTO;
import com.example.student.management.model.Student;
import com.example.student.management.model.Subject;
import com.example.student.management.repository.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepo studentRepo;


    // get all
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    //get one
    public StudentResponseDTO getStudentById(Long id) {
        Student student = studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return mapToResponse(student);
    }

    // add student
    public StudentResponseDTO addStudent(StudentRequestDTO dto) {
        Student student = new Student();
        student.setName(dto.getName());

        List<Subject> subjects = dto.getSubjects().stream().map(s -> {
            Subject subject = new Subject();
            subject.setName(s.getName());
            subject.setScore(s.getScore());
            subject.setStudent(student);
            return subject;
        }).collect(Collectors.toList());

        student.setSubjects(subjects);
        return mapToResponse(studentRepo.save(student));
    }

    // update
    public StudentResponseDTO updateStudent(Long id, StudentRequestDTO dto) {
        Student student = studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        student.setName(dto.getName());
        student.getSubjects().clear();

        dto.getSubjects().forEach(s -> {
            Subject subject = new Subject();
            subject.setName(s.getName());
            subject.setScore(s.getScore());
            subject.setStudent(student);
            student.getSubjects().add(subject);
        });

        return mapToResponse(studentRepo.save(student));
    }

    // delete
    public void deleteStudent(Long id) {
        if (!studentRepo.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepo.deleteById(id);
    }

    // helpers
    private StudentResponseDTO mapToResponse(Student student) {
        List<SubjectDTO> subjectDTOs = student.getSubjects().stream().map(s -> {
            SubjectDTO dto = new SubjectDTO();
            dto.setName(s.getName());
            dto.setScore(s.getScore());
            return dto;
        }).collect(Collectors.toList());

        double total   = subjectDTOs.stream().mapToDouble(SubjectDTO::getScore).sum();
        double average = subjectDTOs.isEmpty() ? 0 : total / subjectDTOs.size();

        StudentResponseDTO res = new StudentResponseDTO();
        res.setId(student.getId());
        res.setName(student.getName());
        res.setSubjects(subjectDTOs);
        res.setTotal(total);
        res.setAverage(Math.round(average * 10.0) / 10.0);
        res.setGrade(calcGrade(average));
        return res;
    }

    private String calcGrade(double avg) {
        if (avg >= 90) return "A";
        if (avg >= 80) return "B";
        if (avg >= 70) return "C";
        if (avg >= 60) return "D";
        return "F";
    }
}