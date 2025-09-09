package com.example.batch.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "HFT_FILE_CONTENT")
public class HftFileContent {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "HFT_FILE_CONTENT_GENERATOR")
    @SequenceGenerator(name = "HFT_FILE_CONTENT_GENERATOR", sequenceName = "HFT_FILE_CONTENT_LOAD", allocationSize = 1)
    @Column(name = "ID", nullable = false)
    private Long id;
    @Column(name = "INSERT_DATE")
    private Date insertDate;
    @Column(name = "FILE_ID", nullable = false)
    private Long fileId;
    @Column(name = "LINE_NUMBER")
    private Long lineNumber;
    @Column(name = "CONTENT")
    private String content;
}
