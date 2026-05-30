package com.artsail.production.service.impl;

import com.artsail.production.mapper.ProdPlanMapper;
import com.artsail.production.model.domain.ProdPlan;
import com.artsail.production.model.domain.VO.ProdPlanVO;
import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.Query.ProdPlanQuery;
import com.artsail.production.service.ProdPlanService;
import com.artsail.production.service.ProdTaskService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProdPlanServiceImpl extends ServiceImpl<ProdPlanMapper, ProdPlan> implements ProdPlanService {

    private final ProdTaskService prodTaskService;
    private final ProdPlanMapper prodPlanMapper;

    @Override
    public Page<ProdPlanVO> search(Page<ProdPlanVO> page, ProdPlanQuery query) {
        return prodPlanMapper.searchWithNames(page, query);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PublishResult publish(Long id, PublishPlanRequest request) {
        ProdPlan plan = this.getById(id);
        if (plan == null) throw new RuntimeException("计划不存在");
        if (!"draft".equals(plan.getStatus())) throw new RuntimeException("仅草稿状态计划可发布");

        plan.setStatus("published");
        this.updateById(plan);

        int tasksGenerated = 0;
        boolean skipTask = request != null && Boolean.TRUE.equals(request.getSkipTaskGen());

        if (!skipTask) {
            // 优先使用自定义任务清单
            List<TaskConfig> taskConfigs = (request != null && request.getTasks() != null && !request.getTasks().isEmpty())
                    ? request.getTasks()
                    : null;

            if (taskConfigs != null) {
                // 新逻辑：按自定义任务清单生成
                for (TaskConfig tc : taskConfigs) {
                    ProdTask task = buildTaskFromConfig(plan, tc);
                    prodTaskService.save(task);
                    tasksGenerated++;
                }
            } else {
                // 兼容旧逻辑：按 cycleRule 算时间
                tasksGenerated = generateTasksByCycle(plan, request);
            }
            log.info("计划 {} 已发布，生成 {} 个任务", id, tasksGenerated);
        } else {
            log.info("计划 {} 已发布，跳过任务生成", id);
        }

        PublishResult result = new PublishResult();
        result.setPlanId(plan.getId());
        result.setPlanTitle(plan.getTitle());
        result.setTasksGenerated(tasksGenerated);
        return result;
    }

    /**
     * 按 TaskConfig 构建任务
     */
    private ProdTask buildTaskFromConfig(ProdPlan plan, TaskConfig tc) {
        ProdTask task = new ProdTask();
        task.setPlanId(plan.getId());
        task.setBaseId(plan.getBaseId());
        task.setTaskTitle(tc.getTaskTitle());
        task.setTargetType(plan.getTargetType());
        task.setTargetId(plan.getTargetId());
        task.setContentDesc(plan.getContentDesc());
        task.setPriority(tc.getPriority() != null ? tc.getPriority() : "medium");
        task.setActionTime(tc.getActionTime());
        // 计算 deadlineTime = actionTime + durationMinutes
        if (tc.getDurationMinutes() != null && tc.getDurationMinutes() > 0 && tc.getActionTime() != null) {
            task.setDeadlineTime(tc.getActionTime().plusMinutes(tc.getDurationMinutes()));
        } else {
            task.setDeadlineTime(plan.getEndTime());
        }
        // 指派执行人
        if (tc.getAssigneeId() != null) {
            task.setAssigneeId(tc.getAssigneeId());
            task.setStatus("assigned");
        } else {
            task.setStatus("pending");
        }
        // IoT 字段
        task.setDeviceId(tc.getDeviceId());
        task.setDeviceAction(tc.getDeviceAction());
        copyPlanDetailToTask(plan, task);
        return task;
    }

    /**
     * 兼容旧逻辑：按 cycleRule 算时间生成任务
     */
    private int generateTasksByCycle(ProdPlan plan, PublishPlanRequest request) {
        int tasksGenerated = 0;
        String taskTitleTemplate = (request != null && StringUtils.isNotBlank(request.getTaskTitleTemplate()))
                ? request.getTaskTitleTemplate()
                : plan.getTitle() + "-第{seq}次";

        List<LocalDateTime> actionTimes = calcTaskTimes(plan.getStartTime(), plan.getEndTime(), plan.getCycleRule());

        for (int i = 0; i < actionTimes.size(); i++) {
            LocalDateTime actionTime = actionTimes.get(i);
            String taskTitle = taskTitleTemplate
                    .replace("{planTitle}", plan.getTitle())
                    .replace("{seq}", String.valueOf(i + 1));

            ProdTask task = new ProdTask();
            task.setPlanId(plan.getId());
            task.setBaseId(plan.getBaseId());
            task.setTaskTitle(taskTitle);
            task.setTargetType(plan.getTargetType());
            task.setTargetId(plan.getTargetId());
            task.setContentDesc(plan.getContentDesc());
            task.setPriority("medium");
            task.setActionTime(actionTime);
            task.setDeadlineTime(plan.getEndTime());
            task.setStatus("pending");
            if (request != null && request.getDefaultAssigneeId() != null) {
                task.setAssigneeId(request.getDefaultAssigneeId());
                task.setStatus("assigned");
            }
            copyPlanDetailToTask(plan, task);
            prodTaskService.save(task);
            tasksGenerated++;
        }
        return tasksGenerated;
    }

	private void copyPlanDetailToTask(ProdPlan plan, ProdTask task) {
		// Fields already merged into prod_plan, copy directly
		task.setFeedVariety(plan.getFeedVariety());
		task.setFeedAmount(plan.getFeedAmount());
		task.setDrugName(plan.getDrugName());
		task.setDosage(plan.getDosage());
		task.setWithdrawalDays(plan.getWithdrawalDays());
		task.setWeatherReq(plan.getWeatherReq());
	}

    // ====== 任务模板 ======

    @Override
    public List<TaskTemplateItem> getTaskTemplates(String planType, LocalDateTime startTime, LocalDateTime endTime) {
        // 获取该计划类型的默认模板
        List<TemplateDef> templates = TEMPLATE_MAP.get(planType);
        if (templates == null) {
            // 未知类型返回空
            return Collections.emptyList();
        }

        // 根据时间范围展开模板
        List<LocalDate> dateRange = calcDateRange(startTime, endTime);
        List<TaskTemplateItem> result = new ArrayList<>();

        for (LocalDate date : dateRange) {
            for (TemplateDef def : templates) {
                TaskTemplateItem item = new TaskTemplateItem();
                // 如果是每日计划且只生成一次，带上日期
                String title = dateRange.size() > 1
                        ? date.toString() + " " + def.title
                        : def.title;
                item.setTaskTitle(title);
                // 模板的 defaultHour/defaultMinute 作为默认值
                item.setDefaultHour(def.defaultHour);
                item.setDefaultMinute(def.defaultMinute);
                item.setDurationMinutes(def.durationMinutes);
                item.setSupportIot(def.supportIot);
                result.add(item);
            }
        }
        return result;
    }

    /** 模板定义（内部） */
    private static class TemplateDef {
        final String title;
        final int defaultHour;
        final int defaultMinute;
        final int durationMinutes;
        final boolean supportIot;

        TemplateDef(String title, int defaultHour, int defaultMinute, int durationMinutes, boolean supportIot) {
            this.title = title;
            this.defaultHour = defaultHour;
            this.defaultMinute = defaultMinute;
            this.durationMinutes = durationMinutes;
            this.supportIot = supportIot;
        }
    }

    /** 各计划类型对应的任务模板 */
    private static final Map<String, List<TemplateDef>> TEMPLATE_MAP = new LinkedHashMap<>();
    static {
        TEMPLATE_MAP.put("feeding", Arrays.asList(
                new TemplateDef("早间投喂", 6, 0, 120, true),
                new TemplateDef("水质检测", 8, 0, 30, false),
                new TemplateDef("午间投喂", 12, 0, 120, true),
                new TemplateDef("晚间投喂", 18, 0, 120, true)
        ));
        TEMPLATE_MAP.put("medication", Arrays.asList(
                new TemplateDef("配药", 8, 0, 60, false),
                new TemplateDef("投药", 9, 0, 120, false)
        ));
        TEMPLATE_MAP.put("harvest", Arrays.asList(
                new TemplateDef("捕捞作业", 4, 0, 240, false),
                new TemplateDef("称重记录", 8, 0, 120, false)
        ));
        TEMPLATE_MAP.put("maintenance", Arrays.asList(
                new TemplateDef("设备巡检", 9, 0, 60, true)
        ));
        TEMPLATE_MAP.put("seeding", Arrays.asList(
                new TemplateDef("放苗准备", 7, 0, 60, false),
                new TemplateDef("放苗作业", 8, 0, 180, false)
        ));
        TEMPLATE_MAP.put("water_change", Arrays.asList(
                new TemplateDef("换水操作", 9, 0, 120, true),
                new TemplateDef("增氧机检查", 14, 0, 30, true)
        ));
    }

    /**
     * 计算日期范围（用于展开每日模板）
     */
    private List<LocalDate> calcDateRange(LocalDateTime startTime, LocalDateTime endTime) {
        List<LocalDate> dates = new ArrayList<>();
        if (startTime == null) {
            dates.add(LocalDate.now());
            return dates;
        }
        LocalDate start = startTime.toLocalDate();
        LocalDate end = (endTime != null ? endTime.toLocalDate() : start);
        LocalDate current = start;
        while (!current.isAfter(end)) {
            dates.add(current);
            current = current.plusDays(1);
        }
        return dates;
    }

    // ====== 原有方法不变 ======

    @Override
    @Transactional(rollbackFor = Exception.class)
    public BatchPublishResult batchPublish(List<Long> ids) {
        BatchPublishResult result = new BatchPublishResult();
        int success = 0, fail = 0, totalTasks = 0;
        List<String> errors = new ArrayList<>();

        for (Long id : ids) {
            try {
                ProdPlan plan = this.getById(id);
                if (plan == null) {
                    fail++;
                    errors.add("计划ID=" + id + " 不存在");
                    continue;
                }
                if (!"draft".equals(plan.getStatus())) {
                    fail++;
                    errors.add("计划「" + plan.getTitle() + "」非草稿状态");
                    continue;
                }
                PublishResult pr = this.publish(id, null);
                success++;
                totalTasks += pr.getTasksGenerated();
            } catch (Exception e) {
                fail++;
                errors.add("计划ID=" + id + " 发布失败: " + e.getMessage());
            }
        }

        result.setSuccessCount(success);
        result.setFailCount(fail);
        result.setTotalTasks(totalTasks);
        result.setErrors(errors);
        log.info("批量发布完成: 成功{}条, 失败{}条, 生成任务{}个", success, fail, totalTasks);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean cancel(Long id, String reason) {
        ProdPlan plan = this.getById(id);
        if (plan == null) throw new RuntimeException("计划不存在");
        if ("completed".equals(plan.getStatus()) || "cancelled".equals(plan.getStatus())) {
            throw new RuntimeException("已完成或已取消的计划无法取消");
        }
        plan.setStatus("cancelled");
        this.updateById(plan);

        LambdaQueryWrapper<ProdTask> taskWrapper = new LambdaQueryWrapper<ProdTask>()
                .eq(ProdTask::getPlanId, id)
                .in(ProdTask::getStatus, "pending", "assigned", "doing");
        prodTaskService.list(taskWrapper).forEach(task -> {
            task.setStatus("skipped");
            task.setCancelReason(reason);
            prodTaskService.updateById(task);
        });
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean complete(Long id) {
        ProdPlan plan = this.getById(id);
        if (plan == null) throw new RuntimeException("计划不存在");
        plan.setStatus("completed");
        this.updateById(plan);

        LambdaQueryWrapper<ProdTask> taskWrapper = new LambdaQueryWrapper<ProdTask>()
                .eq(ProdTask::getPlanId, id)
                .eq(ProdTask::getStatus, "doing");
        prodTaskService.list(taskWrapper).forEach(task -> {
            task.setStatus("done");
            prodTaskService.updateById(task);
        });
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long copy(Long id) {
        ProdPlan source = this.getById(id);
        if (source == null) throw new RuntimeException("原计划不存在");
        ProdPlan target = new ProdPlan();
        target.setBaseId(source.getBaseId());
        target.setParentPlanId(source.getParentPlanId());
        target.setTargetType(source.getTargetType());
        target.setTargetId(source.getTargetId());
        target.setPlanType(source.getPlanType());
        target.setTitle(source.getTitle() + "-副本");
        target.setContentDesc(source.getContentDesc());
        target.setStartTime(source.getStartTime());
        target.setEndTime(source.getEndTime());
        target.setCycleRule(source.getCycleRule());
        target.setStatus("draft");
        target.setOwnerId(source.getOwnerId());
        target.setAssigneeGroupId(source.getAssigneeGroupId());
        this.save(target);
        return target.getId();
    }

    @Override
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", this.count());
        stats.put("draft", this.count(new LambdaQueryWrapper<ProdPlan>().eq(ProdPlan::getStatus, "draft")));
        stats.put("published", this.count(new LambdaQueryWrapper<ProdPlan>().eq(ProdPlan::getStatus, "published")));
        stats.put("active", this.count(new LambdaQueryWrapper<ProdPlan>().eq(ProdPlan::getStatus, "active")));
        stats.put("completed", this.count(new LambdaQueryWrapper<ProdPlan>().eq(ProdPlan::getStatus, "completed")));
        stats.put("cancelled", this.count(new LambdaQueryWrapper<ProdPlan>().eq(ProdPlan::getStatus, "cancelled")));
        return stats;
    }

    // ====== 时间计算 ======

    /**
     * 根据循环规则计算每次执行时间
     */
    private List<LocalDateTime> calcTaskTimes(LocalDateTime start, LocalDateTime end, String cycleRule) {
        List<LocalDateTime> times = new ArrayList<>();
        if (start == null) return times;
        if (end == null) end = start;

        int intervalDays = parseCycleDays(cycleRule);
        LocalDateTime current = start;
        while (!current.isAfter(end)) {
            times.add(current);
            if (intervalDays <= 0) break;
            current = current.plusDays(intervalDays);
        }
        return times;
    }

    private int parseCycleDays(String rule) {
        if (StringUtils.isBlank(rule)) return 0;
        switch (rule.toLowerCase()) {
            case "daily":    return 1;
            case "weekly":   return 7;
            default:
                Matcher m = Pattern.compile("every_(\\d+)_days").matcher(rule);
                if (m.find()) return Integer.parseInt(m.group(1));
                m = Pattern.compile("every_(\\d+)_weeks").matcher(rule);
                if (m.find()) return Integer.parseInt(m.group(1)) * 7;
                return 0;
        }
    }
}
