package com.example.batch.batch;

import com.example.batch.entity.FileLog;
import com.example.batch.repository.FileLogRepository;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.stereotype.Component;

@Component
public class FileJobListener extends JobExecutionListenerSupport {

    private final FileLogRepository fileLogRepository;

    public FileJobListener(FileLogRepository fileLogRepository) {
        this.fileLogRepository = fileLogRepository;
    }

    @Override
    public void beforeJob(JobExecution jobExecution) {
        Long fileId = jobExecution.getJobParameters().getLong("fileId");
        FileLog log = fileLogRepository.findByFileId(fileId)
                .orElseGet(() -> {
                    FileLog l = new FileLog();
                    l.setFileId(fileId);
                    l.setFileName("FILE-" + fileId);
                    return l;
                });
        log.setStatus("WAITING");
        fileLogRepository.save(log);
        jobExecution.getExecutionContext().putLong("fileLogId", log.getId());
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        Long fileLogId = jobExecution.getExecutionContext().getLong("fileLogId");
        fileLogRepository.findById(fileLogId).ifPresent(log -> {
            if (jobExecution.getStatus() == BatchStatus.COMPLETED) {
                log.setStatus("FINISHED");
            } else {
                log.setStatus("ERROR");
            }
            fileLogRepository.save(log);
        });
    }
}
