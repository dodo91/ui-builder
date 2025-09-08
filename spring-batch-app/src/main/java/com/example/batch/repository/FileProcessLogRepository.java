package com.example.batch.repository;

import com.example.batch.entity.FileProcessLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FileProcessLogRepository extends JpaRepository<FileProcessLog, Long> {
    Optional<FileProcessLog> findByFileLogIdAndRowNumber(Long fileLogId, Long rowNumber);
}
