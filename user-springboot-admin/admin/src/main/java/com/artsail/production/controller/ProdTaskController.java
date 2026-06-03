package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.VO.ProdTaskVO;
import com.artsail.production.model.domain.Query.ProdTaskQuery;
import com.artsail.production.service.ProdTaskService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/task")
public class ProdTaskController extends BaseController<ProdTaskService, ProdTask, ProdTaskVO, ProdTaskQuery> {

    @Autowired
    private ProdTaskService prodTaskService;

    @Override
    public Result<Page<ProdTaskVO>> search(Page<ProdTaskVO> page, ProdTaskQuery query) {
        return Result.success(prodTaskService.search(page, query));
    }

    @PostMapping("/{id}/assign")
    public Result<Boolean> assign(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return Result.success(prodTaskService.assign(id, body.get("assigneeId")));
    }

    @PostMapping("/{id}/start")
    public Result<Boolean> start(@PathVariable Long id) {
        return Result.success(prodTaskService.startTask(id));
    }

    @PostMapping("/{id}/complete")
    public Result<Boolean> complete(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> body) {
        return Result.success(prodTaskService.completeTask(id, body));
    }

    @PostMapping("/{id}/skip")
    public Result<Boolean> skip(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return Result.success(prodTaskService.skipTask(id, body.get("reason")));
    }

    @GetMapping("/timeline/{pondId}")
    public Result<List<ProdTask>> timeline(@PathVariable Long pondId) {
        return Result.success(prodTaskService.getTimeline(pondId));
    }

    @GetMapping("/by-date")
    public Result<List<ProdTask>> byDate(@RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        return Result.success(prodTaskService.getTasksByDate(date));
    }

    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        return Result.success(prodTaskService.getStats());
    }
}
