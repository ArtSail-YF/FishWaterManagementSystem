package com.artsail.production.service.impl;

import com.artsail.production.mapper.ProdTaskMapper;
import com.artsail.production.model.domain.ProdLog;
import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.VO.ProdTaskVO;
import com.artsail.production.model.domain.Query.ProdTaskQuery;
import com.artsail.production.service.ProdLogService;
import com.artsail.production.service.ProdTaskService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProdTaskServiceImpl extends ServiceImpl<ProdTaskMapper, ProdTask> implements ProdTaskService {

    private final ProdLogService prodLogService;
    private final ProdTaskMapper prodTaskMapper;

    @Override
    public Page<ProdTaskVO> search(Page<ProdTaskVO> page, ProdTaskQuery query) {
        return prodTaskMapper.searchWithNames(page, query);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean assign(Long id, Long assigneeId) {
        ProdTask task = this.getById(id);
        if (task == null) throw new RuntimeException("任务不存在");
        task.setAssigneeId(assigneeId);
        task.setStatus("assigned");
        return this.updateById(task);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean startTask(Long id) {
        ProdTask task = this.getById(id);
        if (task == null) throw new RuntimeException("任务不存在");
        if (!"assigned".equals(task.getStatus()) && !"pending".equals(task.getStatus())) {
            throw new RuntimeException("当前状态不可开始执行");
        }
        task.setStatus("doing");
        return this.updateById(task);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean completeTask(Long id, Map<String, Object> logData) {
        ProdTask task = this.getById(id);
        if (task == null) throw new RuntimeException("任务不存在");
        task.setStatus("done");
        this.updateById(task);
        ProdLog log = new ProdLog();
        log.setTaskId(task.getId());
        log.setPlanId(task.getPlanId());
        log.setBaseId(task.getBaseId());
        log.setTargetType(task.getTargetType());
        log.setTargetId(task.getTargetId());
        log.setActionTime(LocalDateTime.now());
        log.setSource("task");
        log.setVerifyStatus("auto");
        if (logData != null) {
            if (logData.get("logType") != null) log.setLogType(logData.get("logType").toString());
            if (logData.get("quantity") != null) log.setQuantity(new BigDecimal(logData.get("quantity").toString()));
            if (logData.get("actualWorkerId") != null) log.setActualWorkerId(Long.valueOf(logData.get("actualWorkerId").toString()));
        }
        prodLogService.save(log);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean skipTask(Long id, String reason) {
        ProdTask task = this.getById(id);
        if (task == null) throw new RuntimeException("任务不存在");
        task.setStatus("skipped");
        task.setCancelReason(reason);
        return this.updateById(task);
    }

    @Override
    public List<ProdTask> getTimeline(Long pondId) {
        LambdaQueryWrapper<ProdTask> wrapper = new LambdaQueryWrapper<ProdTask>()
                .eq(ProdTask::getTargetType, "pond")
                .eq(ProdTask::getTargetId, pondId)
                .orderByAsc(ProdTask::getActionTime);
        return this.list(wrapper);
    }

    @Override
    public List<ProdTask> getTasksByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        LambdaQueryWrapper<ProdTask> wrapper = new LambdaQueryWrapper<ProdTask>()
                .between(ProdTask::getActionTime, start, end)
                .orderByAsc(ProdTask::getActionTime);
        return this.list(wrapper);
    }

    @Override
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long total = this.count();
        stats.put("total", total);
        Map<String, Long> statusCounts = new HashMap<>();
        for (String s : new String[]{"pending", "assigned", "doing", "done", "skipped", "expired"}) {
            statusCounts.put(s, this.count(new LambdaQueryWrapper<ProdTask>().eq(ProdTask::getStatus, s)));
        }
        stats.put("statusCounts", statusCounts);
        long done = statusCounts.getOrDefault("done", 0L);
        stats.put("completionRate", total > 0 ? (double) done / total : 0);

        // 今日待执行任务
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(LocalTime.MAX);
        long todayTasks = this.count(new LambdaQueryWrapper<ProdTask>()
                .between(ProdTask::getActionTime, todayStart, todayEnd)
                .ne(ProdTask::getStatus, "done")
                .ne(ProdTask::getStatus, "skipped"));
        stats.put("todayTasks", todayTasks);

        // 已完成任务数
        stats.put("completedTasks", done);

        // 逾期未完成
        long overdueTasks = this.count(new LambdaQueryWrapper<ProdTask>()
                .lt(ProdTask::getDeadlineTime, LocalDateTime.now())
                .notIn(ProdTask::getStatus, "done", "skipped"));
        stats.put("overdueTasks", overdueTasks);

        return stats;
    }
}
