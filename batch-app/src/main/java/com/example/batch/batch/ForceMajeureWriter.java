package com.example.batch.batch;

import com.example.batch.entity.FileProcessErrorLog;
import com.example.batch.entity.FileProcessLog;
import com.example.batch.repository.FileLogRepository;
import com.example.batch.repository.FileProcessErrorLogRepository;
import com.example.batch.repository.FileProcessLogRepository;
import com.example.batch.repository.ForceMajeureLoadRepository;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@StepScope
public class ForceMajeureWriter implements ItemWriter<ForceMajeureLoadItem> {

    private final ForceMajeureLoadRepository loadRepository;
    private final FileProcessLogRepository processLogRepository;
    private final FileProcessErrorLogRepository errorLogRepository;
    private final FileLogRepository fileLogRepository;

    @Value("#{jobParameters['fileId']}")
    private Long fileId;

    public ForceMajeureWriter(ForceMajeureLoadRepository loadRepository,
                              FileProcessLogRepository processLogRepository,
                              FileProcessErrorLogRepository errorLogRepository,
                              FileLogRepository fileLogRepository) {
        this.loadRepository = loadRepository;
        this.processLogRepository = processLogRepository;
        this.errorLogRepository = errorLogRepository;
        this.fileLogRepository = fileLogRepository;
    }

    @Override
    public void write(List<? extends ForceMajeureLoadItem> items) {
        Long fileLogId = fileLogRepository.findByFileId(fileId).map(f -> f.getId()).orElse(null);
        for (ForceMajeureLoadItem item : items) {
            FileProcessLog log = new FileProcessLog();
            log.setFileLogId(fileLogId);
            log.setRowNumber(item.getSource().getLineNumber());
            try {
                loadRepository.save(item.getTarget());
                log.setProcessed(1);
                processLogRepository.save(log);
            } catch (Exception e) {
                log.setProcessed(0);
                processLogRepository.save(log);
                FileProcessErrorLog errorLog = new FileProcessErrorLog();
                errorLog.setFileProcessLogId(log.getId());
                errorLog.setErrorMessage(e.getMessage());
                errorLog.setErrorStackTrace(ExceptionUtils.getStackTrace(e));
                errorLogRepository.save(errorLog);
            }
        }
    }
}
