package com.example.batch.batch;

import com.example.batch.entity.ForceMajeureLoad;
import com.example.batch.entity.HftFileContent;
import com.example.batch.entity.FileProcessErrorLog;
import com.example.batch.entity.FileProcessLog;
import com.example.batch.repository.FileLogRepository;
import com.example.batch.repository.FileProcessErrorLogRepository;
import com.example.batch.repository.FileProcessLogRepository;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;

@Component
@StepScope
public class ForceMajeureProcessor implements ItemProcessor<HftFileContent, ForceMajeureLoadItem> {

    private final FileLogRepository fileLogRepository;
    private final FileProcessLogRepository fileProcessLogRepository;
    private final FileProcessErrorLogRepository errorLogRepository;

    @Value("#{jobParameters['fileId']}")
    private Long fileId;

    public ForceMajeureProcessor(FileLogRepository fileLogRepository,
                                 FileProcessLogRepository fileProcessLogRepository,
                                 FileProcessErrorLogRepository errorLogRepository) {
        this.fileLogRepository = fileLogRepository;
        this.fileProcessLogRepository = fileProcessLogRepository;
        this.errorLogRepository = errorLogRepository;
    }

    @Override
    public ForceMajeureLoadItem process(HftFileContent item) {
        Long fileLogId = fileLogRepository.findByFileId(fileId).map(f -> f.getId()).orElse(null);
        try {
            String[] parts = item.getContent().split(",");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            ForceMajeureLoad load = new ForceMajeureLoad();
            load.setHftFileId(item.getFileId());
            load.setVknTckn(parts[0]);
            load.setForceMajeureNftYear(Integer.valueOf(parts[1]));
            load.setForceMajeureNftMonth(Integer.valueOf(parts[2]));
            load.setForceMajeureNftCode(Integer.valueOf(parts[3]));
            load.setForceMajeureStartDate(sdf.parse(parts[4]));
            load.setForceMajeureEndDate(sdf.parse(parts[5]));
            load.setPersonCode(parts[6]);
            load.setFirmName(parts[7]);
            load.setFirstName(parts[8]);
            load.setCustomerMiddleName(parts[9]);
            load.setCustomerSurname(parts[10]);
            return new ForceMajeureLoadItem(item, load);
        } catch (Exception e) {
            FileProcessLog log = new FileProcessLog();
            log.setFileLogId(fileLogId);
            log.setRowNumber(item.getLineNumber());
            log.setProcessed(0);
            fileProcessLogRepository.save(log);
            FileProcessErrorLog errorLog = new FileProcessErrorLog();
            errorLog.setFileProcessLogId(log.getId());
            errorLog.setErrorMessage(e.getMessage());
            errorLog.setErrorStackTrace(ExceptionUtils.getStackTrace(e));
            errorLogRepository.save(errorLog);
            return null;
        }
    }
}
