package com.example.batch.entity;

import com.example.batch.entity.base.CreateDateBaseEntity;
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
@Table(name = "FORCE_MAJEURE_LOAD")
public class ForceMajeureLoad extends CreateDateBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FORCE_MAJEURE_LOAD_GENERATOR")
    @SequenceGenerator(name = "FORCE_MAJEURE_LOAD_GENERATOR", sequenceName = "SEQ_FORCE_MAJEURE_LOAD", allocationSize = 1000)
    @Column(name = "ID", nullable = false)
    private Long id;
    @Column(name = "HFT_FILE_ID")
    private Long hftFileId;
    @Column(name = "VKN_TCKN")
    private String vknTckn;
    @Column(name = "FORCE_MAJEURE_NTF_YEAR")
    private Integer forceMajeureNftYear;
    @Column(name = "FORCE_MAJEURE_NTF_MONTH")
    private Integer forceMajeureNftMonth;
    @Column(name = "FORCE_MAJEURE_NTF_CODE")
    private Integer forceMajeureNftCode;
    @Column(name = "FORCE_MAJEURE_START_DATE")
    private Date forceMajeureStartDate;
    @Column(name = "FORCE_MAJEURE_END_DATE")
    private Date forceMajeureEndDate;
    @Column(name = "PERSON_CODE")
    private String personCode;
    @Column(name = "FIRM_NAME")
    private String firmName;
    @Column(name = "FIRST_NAME")
    private String firstName;
    @Column(name = "CUSTOMER_MIDDLE_NAME")
    private String customerMiddleName;
    @Column(name = "CUSTOMER_SURNAME")
    private String customerSurname;
}
