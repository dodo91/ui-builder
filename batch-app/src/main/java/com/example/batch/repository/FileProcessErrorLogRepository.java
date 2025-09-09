package com.example.batch.repository;

import com.example.batch.entity.FileProcessErrorLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileProcessErrorLogRepository extends JpaRepository<FileProcessErrorLog, Long> {
}
