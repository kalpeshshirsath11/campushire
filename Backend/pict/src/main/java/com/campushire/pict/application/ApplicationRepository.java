package com.campushire.pict.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByStudentIdAndDriveId(Long studentId, Long driveId);
    List<Application> findByDriveId(Long driveId);
    List<Application> findByStudentId(Long studentId);
}
