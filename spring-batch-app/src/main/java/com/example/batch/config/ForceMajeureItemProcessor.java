package com.example.batch.config;

import com.example.batch.entity.ForceMajeureLoad;
import com.example.batch.entity.HftFileContent;
import org.springframework.batch.item.ItemProcessor;

import java.text.SimpleDateFormat;

public class ForceMajeureItemProcessor implements ItemProcessor<HftFileContent, ForceMajeureLoad> {

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    public ForceMajeureLoad process(HftFileContent item) throws Exception {
        String[] tokens = item.getContent().split(",");
        ForceMajeureLoad load = new ForceMajeureLoad();
        load.setHftFileId(item.getFileId());
        load.setLineNumber(item.getLineNumber());
        load.setVknTckn(tokens.length > 0 ? tokens[0] : null);
        load.setForceMajeureNftYear(tokens.length > 1 ? Integer.valueOf(tokens[1]) : null);
        load.setForceMajeureNftMonth(tokens.length > 2 ? Integer.valueOf(tokens[2]) : null);
        load.setForceMajeureNftCode(tokens.length > 3 ? Integer.valueOf(tokens[3]) : null);
        load.setForceMajeureStartDate(tokens.length > 4 ? sdf.parse(tokens[4]) : null);
        load.setForceMajeureEndDate(tokens.length > 5 ? sdf.parse(tokens[5]) : null);
        load.setPersonCode(tokens.length > 6 ? tokens[6] : null);
        load.setFirmName(tokens.length > 7 ? tokens[7] : null);
        load.setFirstName(tokens.length > 8 ? tokens[8] : null);
        load.setCustomerMiddleName(tokens.length > 9 ? tokens[9] : null);
        load.setCustomerSurname(tokens.length > 10 ? tokens[10] : null);
        return load;
    }
}
