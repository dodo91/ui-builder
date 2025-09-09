package com.example.batch.batch;

import com.example.batch.entity.HftFileContent;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.batch.core.launch.support.SimpleJobLauncher;
import org.springframework.batch.core.repository.support.MapJobRepositoryFactoryBean;
import org.springframework.transaction.support.ResourcelessTransactionManager;

import java.util.HashMap;
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
    public ResourcelessTransactionManager resourcelessTransactionManager() {
        return new ResourcelessTransactionManager();
    }

    @Bean
    public JobRepository jobRepository(ResourcelessTransactionManager txManager) throws Exception {
        MapJobRepositoryFactoryBean factory = new MapJobRepositoryFactoryBean(txManager);
        return factory.getObject();
    }

    @Bean
    public SimpleJobLauncher jobLauncher(JobRepository jobRepository) {
        SimpleJobLauncher launcher = new SimpleJobLauncher();
        launcher.setJobRepository(jobRepository);
        return launcher;
    }

    @Bean
    public TaskExecutor taskExecutor() {
        SimpleAsyncTaskExecutor executor = new SimpleAsyncTaskExecutor("batch-");
        executor.setConcurrencyLimit(properties.getMaxThreads());
        return executor;
    }

    @Bean
    @StepScope
    public ItemReader<HftFileContent> reader(EntityManagerFactory emf,
                                             @Value("#{jobParameters['fileId']}") Long fileId,
                                             @Value("#{jobExecutionContext['fileLogId']}") Long fileLogId,
                                             @Value("#{stepExecutionContext['minValue']}") Long min,
                                             @Value("#{stepExecutionContext['maxValue']}") Long max) {
        String query = "select c from HftFileContent c where c.fileId = :fileId and c.id between :min and :max " +
                "and c.lineNumber not in (select l.rowNumber from FileProcessLog l where l.fileLogId = :fileLogId and l.processed = 1)";
        Map<String, Object> params = new HashMap<>();
        params.put("fileId", fileId);
        params.put("min", min);
        params.put("max", max);
        params.put("fileLogId", fileLogId);
        return new JpaPagingItemReaderBuilder<HftFileContent>()
                .name("hftReader")
                .entityManagerFactory(emf)
                .pageSize(properties.getChunkSize())
                .queryString(query)
                .parameterValues(params)
                .build();
    }

    @Bean
    public Step slaveStep(JobRepository jobRepository,
                          PlatformTransactionManager transactionManager,
                          ItemReader<HftFileContent> reader,
                          ForceMajeureProcessor processor,
                          ForceMajeureWriter writer) {
        return new StepBuilder("slaveStep", jobRepository)
                .<HftFileContent, ForceMajeureLoadItem>chunk(properties.getChunkSize(), transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .build();
    }

    @Bean
    public Step masterStep(JobRepository jobRepository,
                           PlatformTransactionManager transactionManager,
                           Step slaveStep,
                           HftFileContentRangePartitioner partitioner,
                           TaskExecutor taskExecutor) {
        return new StepBuilder("masterStep", jobRepository)
                .partitioner(slaveStep.getName(), partitioner)
                .step(slaveStep)
                .gridSize(properties.getGridSize())
                .taskExecutor(taskExecutor)
                .build();
    }

    @Bean
    public Job job(JobRepository jobRepository, Step masterStep, FileJobListener listener) {
        return new JobBuilder("forceMajeureJob", jobRepository)
                .listener(listener)
                .start(masterStep)
                .build();
    }
}
