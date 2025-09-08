package com.example.batch.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "FILE_LOG")
public class FileLog extends UpdateDateBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FILE_LOG_GENERATOR")
    @SequenceGenerator(name = "FILE_LOG_GENERATOR", sequenceName = "SEQ_FILE_LOG", allocationSize = 1000)
    @Column(name = "ID", nullable = false)
    private Long id;
    @Column(name = "FILE_ID")
    private Long fileId;
    @Column(name = "FILE_NAME")
    private String fileName;
    @Column(name = "STATUS")
    private String status;
}
