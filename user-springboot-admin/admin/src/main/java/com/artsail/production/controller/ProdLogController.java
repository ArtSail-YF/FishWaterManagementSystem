package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.ProdLog;
import com.artsail.production.model.domain.Query.ProdLogQuery;
import com.artsail.production.service.ProdLogService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/log")
public class ProdLogController extends BaseController<ProdLogService, ProdLog, ProdLog, ProdLogQuery> {

    @Autowired
    private ProdLogService prodLogService;

    @Override
    public Result<Page<ProdLog>> search(Page<ProdLog> page, ProdLogQuery query) {
        return Result.success(prodLogService.search(page, query));
    }

    @PostMapping("/{id}/verify")
    public Result<Boolean> verify(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return Result.success(prodLogService.verify(id, body.get("verifyStatus"), body.get("reason")));
    }

    @GetMapping("/stats/by-type")
    public Result<Map<String, Long>> statsByType() {
        return Result.success(prodLogService.getStatsByType());
    }

    @GetMapping("/stats/by-base")
    public Result<List<Map<String, Object>>> statsByBase() {
        return Result.success(prodLogService.getStatsByBase());
    }

    @GetMapping("/pond/{pondId}/history")
    public Result<List<ProdLog>> pondHistory(@PathVariable Long pondId,
                                              @RequestParam(required = false) String logType) {
        return Result.success(prodLogService.getPondHistory(pondId, logType));
    }
}