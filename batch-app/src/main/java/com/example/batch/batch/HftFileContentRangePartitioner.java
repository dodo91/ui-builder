package com.example.batch.batch;

import com.example.batch.repository.HftFileContentRepository;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@StepScope
public class HftFileContentRangePartitioner implements Partitioner {

    private final HftFileContentRepository repository;

    @Value("#{jobParameters['fileId']}")
    private Long fileId;

    public HftFileContentRangePartitioner(HftFileContentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Map<String, ExecutionContext> partition(int gridSize) {
        Long min = repository.findMinIdByFileId(fileId);
        Long max = repository.findMaxIdByFileId(fileId);
        Map<String, ExecutionContext> result = new HashMap<>();
        if (min == null || max == null) {
            return result;
        }
        long range = (max - min) / gridSize + 1;
        long start = min;
        long end = start + range - 1;

        for (int i = 0; i < gridSize && start <= max; i++) {
            ExecutionContext value = new ExecutionContext();
            value.putLong("minValue", start);
            value.putLong("maxValue", Math.min(end, max));
            result.put("partition" + i, value);
            start += range;
            end += range;
        }
        return result;
    }
}
