package com.example.batch.repository;

import com.example.batch.entity.HftFileContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HftFileContentRepository extends JpaRepository<HftFileContent, Long> {

    @Query("select min(c.id) from HftFileContent c where c.fileId = :fileId")
    Long findMinIdByFileId(@Param("fileId") Long fileId);

    @Query("select max(c.id) from HftFileContent c where c.fileId = :fileId")
    Long findMaxIdByFileId(@Param("fileId") Long fileId);

    @Query("select c from HftFileContent c where c.fileId = :fileId and c.id between :start and :end " +
           "and c.lineNumber not in (select l.rowNumber from FileProcessLog l where l.fileLogId = :fileLogId and l.processed = 1)")
    List<HftFileContent> findUnprocessedInRange(@Param("fileId") Long fileId,
                                                @Param("fileLogId") Long fileLogId,
                                                @Param("start") Long start,
                                                @Param("end") Long end);
}
