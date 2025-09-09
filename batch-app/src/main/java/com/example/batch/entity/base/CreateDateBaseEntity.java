package com.example.batch.entity.base;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public abstract class CreateDateBaseEntity {

    @Column(name = "CREATE_DATE")
    private Date createDate;

    @PrePersist
    protected void onCreate() {
        this.createDate = new Date();
    }
}
