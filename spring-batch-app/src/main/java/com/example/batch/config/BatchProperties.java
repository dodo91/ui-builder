package com.example.batch.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "batch")
public class BatchProperties {
    private int chunkSize = 100;
    private int gridSize = 4;
}
