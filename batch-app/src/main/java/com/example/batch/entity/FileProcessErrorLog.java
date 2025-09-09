package com.example.batch.entity;

import com.example.batch.entity.base.CreateDateBaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "FILE_PROCESS_ERROR_LOG")
public class FileProcessErrorLog extends CreateDateBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FILE_PROCESS_ERROR_LOG_GENERATOR")
    @SequenceGenerator(name = "FILE_PROCESS_ERROR_LOG_GENERATOR", sequenceName = "SEQ_FILE_PROCESS_ERROR_LOG", allocationSize = 1000)
    @Column(name = "ID", nullable = false)
    private Long id;
    @Column(name = "FILE_PROCESS_LOG_ID")
    private Long fileProcessLogId;
    @Column(name = "EXCEPTION_ID")
    private Long exceptionId;
    @Column(name = "ERROR_MESSAGE")
    private String errorMessage;
    @Column(name = "ERROR_STACK_TRACE")
    private String errorStackTrace;
}
