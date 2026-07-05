package com.campushire.pict.student;

import com.campushire.pict.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByPrn(String prn);
    boolean existsByPrn(String prn);
    Optional<Student> findByUserId(Long userId);
}
