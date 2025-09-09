package com.example.batch.repository;

import com.example.batch.entity.FileLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FileLogRepository extends JpaRepository<FileLog, Long> {
    Optional<FileLog> findByFileId(Long fileId);
}
