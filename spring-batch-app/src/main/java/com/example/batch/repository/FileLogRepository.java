package com.example.batch.repository;

import com.example.batch.entity.FileLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileLogRepository extends JpaRepository<FileLog, Long> {
    FileLog findByFileId(Long fileId);
}
