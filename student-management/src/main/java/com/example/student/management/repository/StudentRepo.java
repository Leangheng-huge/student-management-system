package com.example.student.management.repository;


import com.example.student.management.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepo extends JpaRepository<Student,Long> {
    List<Student> findByNameContainingIgnoreCase (String name);

    /*Optional<T> -> expect one or none
    * boolean -> just check if exist or not
    * list -> expect multi results
    */

}
