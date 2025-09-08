package com.example.batch.config;

import com.example.batch.entity.FileProcessErrorLog;
import com.example.batch.entity.FileProcessLog;
import com.example.batch.entity.ForceMajeureLoad;
import com.example.batch.repository.FileProcessErrorLogRepository;
import com.example.batch.repository.FileProcessLogRepository;
import com.example.batch.repository.ForceMajeureLoadRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.PrintWriter;
import java.io.StringWriter;

@Component
public class ForceMajeureItemWriter implements ItemWriter<ForceMajeureLoad> {

    private final ForceMajeureLoadRepository loadRepository;
    private final FileProcessLogRepository processLogRepository;
    private final FileProcessErrorLogRepository errorLogRepository;

    @Value("#{jobParameters['fileLogId']}")
    private Long fileLogId;

    public ForceMajeureItemWriter(ForceMajeureLoadRepository loadRepository,
                                   FileProcessLogRepository processLogRepository,
                                   FileProcessErrorLogRepository errorLogRepository) {
        this.loadRepository = loadRepository;
        this.processLogRepository = processLogRepository;
        this.errorLogRepository = errorLogRepository;
    }

    @Override
    public void write(Chunk<? extends ForceMajeureLoad> chunk) throws Exception {
        for (ForceMajeureLoad item : chunk) {
            FileProcessLog log = processLogRepository
                    .findByFileLogIdAndRowNumber(fileLogId, item.getLineNumber())
                    .orElseGet(() -> {
                        FileProcessLog l = new FileProcessLog();
                        l.setFileLogId(fileLogId);
                        l.setRowNumber(item.getLineNumber());
                        l.setProcessed(0);
                        return processLogRepository.save(l);
                    });
            try {
                loadRepository.save(item);
                log.setProcessed(1);
                processLogRepository.save(log);
            } catch (Exception e) {
                log.setProcessed(0);
                processLogRepository.save(log);
                FileProcessErrorLog error = new FileProcessErrorLog();
                error.setFileProcessLogId(log.getId());
                error.setErrorMessage(e.getMessage());
                StringWriter sw = new StringWriter();
                e.printStackTrace(new PrintWriter(sw));
                error.setErrorStackTrace(sw.toString());
                errorLogRepository.save(error);
            }
        }
    }
}
