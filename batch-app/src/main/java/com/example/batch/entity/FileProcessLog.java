package com.example.batch.entity;

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
@Table(name = "FILE_PROCESS_LOG")
public class FileProcessLog {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FILE_PROCESS_LOG_GENERATOR")
    @SequenceGenerator(name = "FILE_PROCESS_LOG_GENERATOR", sequenceName = "SEQ_FILE_PROCESS_LOG", allocationSize = 1000)
    @Column(name = "ID", nullable = false)
    private Long id;
    @Column(name = "ROWNUMBER")
    private Long rowNumber;
    @Column(name = "PROCESSED")
    private int processed;
    @Column(name = "FILE_LOG_ID")
    private Long fileLogId;
}
