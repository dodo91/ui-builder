package com.example.batch.entity.base;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public abstract class UpdateDateBaseEntity extends CreateDateBaseEntity {

    @Column(name = "UPDATE_DATE")
    private Date updateDate;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updateDate = new Date();
    }
}
