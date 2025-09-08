package com.example.batch.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
public abstract class CreateDateBaseEntity {
    @Column(name = "CREATE_DATE")
    private LocalDateTime createDate = LocalDateTime.now();
}
