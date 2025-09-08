package com.example.batch.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
public abstract class UpdateDateBaseEntity extends CreateDateBaseEntity {
    @Column(name = "UPDATE_DATE")
    private LocalDateTime updateDate;
}
