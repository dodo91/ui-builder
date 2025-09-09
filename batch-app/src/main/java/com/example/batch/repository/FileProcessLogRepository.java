package com.example.batch.repository;

import com.example.batch.entity.FileProcessLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileProcessLogRepository extends JpaRepository<FileProcessLog, Long> {
}
