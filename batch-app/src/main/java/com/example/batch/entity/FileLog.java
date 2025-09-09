package com.example.batch.entity;

import com.example.batch.entity.base.UpdateDateBaseEntity;
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
