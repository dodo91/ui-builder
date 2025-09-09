package com.example.batch.batch;

import com.example.batch.entity.ForceMajeureLoad;
import com.example.batch.entity.HftFileContent;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ForceMajeureLoadItem {
    private final HftFileContent source;
    private final ForceMajeureLoad target;
}
