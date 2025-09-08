package com.example.batch.config;

import com.example.batch.entity.FileLog;
import com.example.batch.entity.ForceMajeureLoad;
import com.example.batch.entity.HftFileContent;
import com.example.batch.repository.FileLogRepository;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.job.builder.StepBuilder;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.data.builder.JpaPagingItemReaderBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.transaction.PlatformTransactionManager;

import jakarta.persistence.EntityManagerFactory;
import java.util.Map;

@Configuration
@EnableBatchProcessing
@EnableConfigurationProperties(BatchProperties.class)
public class BatchConfig {

    private final BatchProperties properties;

    public BatchConfig(BatchProperties properties) {
        this.properties = properties;
    }

    @Bean
    @StepScope
    public JpaPagingItemReader<HftFileContent> reader(EntityManagerFactory emf,
                                                      @Value("#{stepExecutionContext['minValue']}") Long min,
                                                      @Value("#{stepExecutionContext['maxValue']}") Long max,
                                                      @Value("#{jobParameters['fileId']}") Long fileId,
                                                      @Value("#{jobParameters['fileLogId']}") Long fileLogId) {
        String query = "select h from HftFileContent h where h.fileId = :fileId and h.id between :min and :max " +
                "and exists (select l.id from FileProcessLog l where l.fileLogId = :fileLogId and l.rowNumber = h.lineNumber and l.processed = 0)";
        return new JpaPagingItemReaderBuilder<HftFileContent>()
                .name("hftReader")
                .entityManagerFactory(emf)
                .pageSize(properties.getChunkSize())
                .queryString(query)
                .parameterValues(Map.of("fileId", fileId, "min", min, "max", max, "fileLogId", fileLogId))
                .build();
    }

    @Bean
    public ItemProcessor<HftFileContent, ForceMajeureLoad> processor() {
        return new ForceMajeureItemProcessor();
    }

    @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(properties.getGridSize());
        executor.setMaxPoolSize(properties.getGridSize());
        executor.setQueueCapacity(properties.getGridSize());
        executor.initialize();
        return executor;
    }

    @Bean
    @StepScope
    public HftRangePartitioner partitioner(JdbcTemplate jdbcTemplate,
                                           @Value("#{jobParameters['fileId']}") Long fileId) {
        return new HftRangePartitioner(jdbcTemplate, fileId);
    }

    @Bean
    public Step slaveStep(JobRepository jobRepository, PlatformTransactionManager transactionManager,
                          ItemReader<HftFileContent> reader,
                          ItemProcessor<HftFileContent, ForceMajeureLoad> processor,
                          ForceMajeureItemWriter writer) {
        return new StepBuilder("slaveStep", jobRepository)
                .<HftFileContent, ForceMajeureLoad>chunk(properties.getChunkSize(), transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .build();
    }

    @Bean
    public Step partitionedStep(JobRepository jobRepository, PlatformTransactionManager transactionManager,
                                Step slaveStep, HftRangePartitioner partitioner, TaskExecutor taskExecutor) {
        return new StepBuilder("partitionedStep", jobRepository)
                .partitioner("slaveStep", partitioner)
                .step(slaveStep)
                .gridSize(properties.getGridSize())
                .taskExecutor(taskExecutor)
                .build();
    }

    @Bean
    public JobExecutionListenerSupport jobListener(FileLogRepository fileLogRepository,
                                                   @Value("#{jobParameters['fileId']}") Long fileId) {
        return new JobExecutionListenerSupport() {
            @Override
            public void beforeJob(JobExecution jobExecution) {
                FileLog log = fileLogRepository.findByFileId(fileId);
                if (log != null) {
                    log.setStatus("WAITING");
                    fileLogRepository.save(log);
                }
            }

            @Override
            public void afterJob(JobExecution jobExecution) {
                FileLog log = fileLogRepository.findByFileId(fileId);
                if (log != null) {
                    log.setStatus(jobExecution.getStatus() == BatchStatus.COMPLETED ? "FINISHED" : "ERROR");
                    fileLogRepository.save(log);
                }
            }
        };
    }

    @Bean
    public Job job(JobRepository jobRepository, Step partitionedStep, JobExecutionListenerSupport listener) {
        return new JobBuilder("forceMajeureJob", jobRepository)
                .listener(listener)
                .start(partitionedStep)
                .build();
    }
}
