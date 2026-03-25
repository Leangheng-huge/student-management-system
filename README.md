# 🎓 Student Management System

A full-stack web application for managing students, inputting subject scores, and automatically calculating total scores, averages, and letter grades.

> ⚠️ **Note:** This project does not have any security implementation yet (no authentication, no authorization). It is intended for educational/assignment purposes only.

---

## 🛠️ Tech Stack

**Frontend**
- HTML, CSS, JavaScript
- Fetch API

**Backend**
- Java 21
- Spring Boot 4.0.3
- Spring Data JPA
- Spring Validation

**Database**
- PostgreSQL

---

## ✨ Features

- Add students with custom name and multiple subjects
- Input scores (0–100) per subject
- Auto-calculate total score, average, and letter grade
- Edit and delete student records
- View subject score breakdown per student
- Live class statistics (average, top score, lowest score)

---

## 📊 Grading Scale

| Grade | Average Score |
|-------|--------------|
| A | 90 – 100 |
| B | 80 – 89 |
| C | 70 – 79 |
| D | 60 – 69 |
| F | Below 60 |

---

## 🗂️ Project Structure

```
student-management/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── src/
│   └── main/java/com/example/student/management/
│       ├── config/          → CorsConfig
│       ├── controller/      → StudentController, SubjectController
│       ├── dto/             → StudentRequestDTO, StudentResponseDTO, SubjectDTO
│       ├── model/           → Student, Subject
│       ├── repository/      → StudentRepo, SubjectRepo
│       └── service/         → StudentService, SubjectService
│
├── src/main/resources/
│   └── application.properties
│
└── pom.xml
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE student (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subject (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    score       DECIMAL(5,2) NOT NULL,
    student_id  BIGINT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);
```

**Relationship:** One Student → Many Subjects

---

## 🚀 How to Run

### Prerequisites
- Java 21+
- PostgreSQL
- Maven

### 1. Setup Database
```sql
CREATE DATABASE student_db;
```

### 2. Configure application.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/student_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run Backend
```bash
./mvnw spring-boot:run
```
Backend runs on: `http://localhost:8080`

### 4. Open Frontend
Open `frontend/index.html` in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/{id}` | Get one student |
| POST | `/api/students` | Add new student |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete student |
| GET | `/api/students/{id}/subjects` | Get subjects of a student |

