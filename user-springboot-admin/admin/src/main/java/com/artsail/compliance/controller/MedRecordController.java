package com.artsail.compliance.controller;

import com.artsail.compliance.model.domain.MedRecord;
import com.artsail.compliance.model.dto.MedRecordQuery;
import com.artsail.compliance.service.MedRecordService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 用药记录管理 (med_record)
 */
@RestController
@RequestMapping("/med-record")
public class MedRecordController {

    @Autowired
    private MedRecordService medRecordService;

    @GetMapping("/search")
    public Result<Page<MedRecord>> search(@RequestParam(defaultValue = "1") long current,
                                          @RequestParam(defaultValue = "20") long pageSize,
                                          MedRecordQuery query) {
        Page<MedRecord> page = new Page<>(current, pageSize);
        return Result.success(medRecordService.search(page, query));
    }

    @GetMapping("/{id}")
    public Result<MedRecord> getById(@PathVariable Long id) {
        return Result.success(medRecordService.getById(id));
    }

    @PostMapping
    public Result<Boolean> save(@RequestBody MedRecord entity) {
        return Result.success(medRecordService.save(entity));
    }

    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody MedRecord entity) {
        entity.setId(id);
        return Result.success(medRecordService.updateById(entity));
    }

    @DeleteMapping("/{id}")
    public Result<Void> remove(@PathVariable Long id) {
        medRecordService.removeById(id);
        return Result.success(null);
    }
}
