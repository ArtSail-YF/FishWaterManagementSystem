package com.artsail.production.controller;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.MedicationRecord;
import com.artsail.production.model.domain.Query.MedicationRecordQuery;
import com.artsail.production.service.MedicationRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/medication-record")
public class MedicationRecordController extends BaseController<MedicationRecordService, MedicationRecord, MedicationRecord, MedicationRecordQuery> {
    @Autowired private MedicationRecordService medicationRecordService;
    @Override
    public Result<Page<MedicationRecord>> search(Page<MedicationRecord> page, MedicationRecordQuery query) {
        return Result.success(medicationRecordService.search(page, query));
    }
}
