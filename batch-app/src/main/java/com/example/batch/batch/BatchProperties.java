package com.example.batch.batch;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.batch")
public class BatchProperties {
    private int chunkSize = 100;
    private int gridSize = 1;
    private int maxThreads = 1;
}
