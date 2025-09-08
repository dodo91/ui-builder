package com.example.batch.config;

import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.HashMap;
import java.util.Map;

public class HftRangePartitioner implements Partitioner {

    private final JdbcTemplate jdbcTemplate;
    private final Long fileId;

    public HftRangePartitioner(JdbcTemplate jdbcTemplate, Long fileId) {
        this.jdbcTemplate = jdbcTemplate;
        this.fileId = fileId;
    }

    @Override
    public Map<String, ExecutionContext> partition(int gridSize) {
        Long min = jdbcTemplate.queryForObject("SELECT MIN(ID) FROM HFT_FILE_CONTENT WHERE FILE_ID = ?", Long.class, fileId);
        Long max = jdbcTemplate.queryForObject("SELECT MAX(ID) FROM HFT_FILE_CONTENT WHERE FILE_ID = ?", Long.class, fileId);

        Map<String, ExecutionContext> result = new HashMap<>();
        long targetSize = (max - min) / gridSize + 1;
        long start = min;
        long end = start + targetSize - 1;

        for (int i = 0; i < gridSize; i++) {
            ExecutionContext value = new ExecutionContext();
            if (end >= max) {
                end = max;
            }
            value.putLong("minValue", start);
            value.putLong("maxValue", end);
            value.putLong("fileId", fileId);
            result.put("partition" + i, value);
            start += targetSize;
            end += targetSize;
        }
        return result;
    }
}
