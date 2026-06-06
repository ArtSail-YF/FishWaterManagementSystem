package com.artsail.production.service.impl;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.artsail.approval.config.PlanApprovalRabbitConfig;
import com.artsail.approval.service.ApprovalService;
import com.artsail.production.mapper.ProdPlanMapper;
import com.artsail.approval.model.domain.PlanApprovalRecord;
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
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProdPlanServiceImpl extends ServiceImpl<ProdPlanMapper, ProdPlan> implements ProdPlanService {

    private final ProdTaskService prodTaskService;
    private final ProdPlanMapper prodPlanMapper;
    private final ApprovalService approvalService;
    private final RabbitTemplate rabbitTemplate;

    @Override
    public Page<ProdPlanVO> search(Page<ProdPlanVO> page, ProdPlanQuery query) {
        return prodPlanMapper.searchWithNames(page, query);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PublishResult publish(Long id, PublishPlanRequest request) {
        ProdPlan plan = this.getById(id);
        if (plan == null) throw new RuntimeException("计划不存在");
        if (!"approved".equals(plan.getStatus()) && !"draft".equals(plan.getStatus())) {
            throw new RuntimeException("仅草稿或已审批状态的计划可发布");
        }
        plan.setStatus("published");
        this.updateById(plan);
        int tasksGenerated = 0;
        boolean skipTask = request != null && Boolean.TRUE.equals(request.getSkipTaskGen());
        if (!skipTask) {
            List<TaskConfig> taskConfigs = (request != null && request.getTasks() != null && !request.getTasks().isEmpty())
                    ? request.getTasks() : null;
            if (taskConfigs != null) {
                for (TaskConfig tc : taskConfigs) {
                    prodTaskService.save(buildTaskFromConfig(plan, tc));
                    tasksGenerated++;
                }
            } else {
                tasksGenerated = generateTasksByCycle(plan, request);
            }
            log.info("计划 {} 已发布，生成 {} 个任务", id, tasksGenerated);
        }
        PublishResult result = new PublishResult();
        result.setPlanId(plan.getId());
        result.setPlanTitle(plan.getTitle());
        result.setTasksGenerated(tasksGenerated);
        return result;
    }

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
        if (tc.getDurationMinutes() != null && tc.getDurationMinutes() > 0 && tc.getActionTime() != null) {
            task.setDeadlineTime(tc.getActionTime().plusMinutes(tc.getDurationMinutes()));
        } else {
            task.setDeadlineTime(plan.getEndTime());
        }
        task.setAssigneeId(tc.getAssigneeId());
        task.setStatus(tc.getAssigneeId() != null ? "assigned" : "pending");
        task.setDeviceId(tc.getDeviceId());
        task.setDeviceAction(tc.getDeviceAction());
        copyPlanDetailToTask(plan, task);
        task.setCreateTime(LocalDateTime.now());
        task.setUpdateTime(LocalDateTime.now());
        return task;
    }

    private int generateTasksByCycle(ProdPlan plan, PublishPlanRequest request) {
        int n = 0;
        String tpl = (request != null && StringUtils.isNotBlank(request.getTaskTitleTemplate()))
                ? request.getTaskTitleTemplate() : plan.getTitle() + "-第{seq}次";
        List<LocalDateTime> times = calcTaskTimes(plan.getStartTime(), plan.getEndTime(), plan.getCycleRule());
        for (int i = 0; i < times.size(); i++) {
            ProdTask task = new ProdTask();
            task.setPlanId(plan.getId());
            task.setBaseId(plan.getBaseId());
            task.setTaskTitle(tpl.replace("{planTitle}", plan.getTitle()).replace("{seq}", String.valueOf(i + 1)));
            task.setTargetType(plan.getTargetType());
            task.setTargetId(plan.getTargetId());
            task.setContentDesc(plan.getContentDesc());
            task.setPriority("medium");
            task.setActionTime(times.get(i));
            task.setDeadlineTime(plan.getEndTime());
            task.setStatus("pending");
            if (request != null && request.getDefaultAssigneeId() != null) {
                task.setAssigneeId(request.getDefaultAssigneeId());
                task.setStatus("assigned");
            }
            copyPlanDetailToTask(plan, task);
            task.setCreateTime(LocalDateTime.now());
            task.setUpdateTime(LocalDateTime.now());
            prodTaskService.save(task);
            n++;
        }
        return n;
    }

    private void copyPlanDetailToTask(ProdPlan plan, ProdTask task) {
        task.setFeedVariety(plan.getFeedVariety());
        task.setFeedAmount(plan.getFeedAmount());
        task.setDrugName(plan.getDrugName());
        task.setDosage(plan.getDosage());
        task.setWithdrawalDays(plan.getWithdrawalDays());
        task.setWeatherReq(plan.getWeatherReq());
    }

    @Override
    public List<TaskTemplateItem> getTaskTemplates(String planType, LocalDateTime startTime, LocalDateTime endTime) {
        List<TemplateDef> templates = TEMPLATE_MAP.get(planType);
        if (templates == null) return Collections.emptyList();
        List<LocalDate> dateRange = calcDateRange(startTime, endTime);
        List<TaskTemplateItem> result = new ArrayList<>();
        for (LocalDate date : dateRange) {
            for (TemplateDef def : templates) {
                TaskTemplateItem item = new TaskTemplateItem();
                item.setTaskTitle(dateRange.size() > 1 ? date.toString() + " " + def.title : def.title);
                item.setDefaultHour(def.defaultHour);
                item.setDefaultMinute(def.defaultMinute);
                item.setDurationMinutes(def.durationMinutes);
                item.setSupportIot(def.supportIot);
                result.add(item);
            }
        }
        return result;
    }

    private static class TemplateDef {
        final String title; final int defaultHour; final int defaultMinute; final int durationMinutes; final boolean supportIot;
        TemplateDef(String title, int h, int m, int d, boolean iot) {
            this.title = title; this.defaultHour = h; this.defaultMinute = m; this.durationMinutes = d; this.supportIot = iot;
        }
    }

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

    private List<LocalDate> calcDateRange(LocalDateTime startTime, LocalDateTime endTime) {
        List<LocalDate> dates = new ArrayList<>();
        if (startTime == null) { dates.add(LocalDate.now()); return dates; }
        LocalDate cur = startTime.toLocalDate();
        LocalDate end = (endTime != null ? endTime.toLocalDate() : cur);
        while (!cur.isAfter(end)) { dates.add(cur); cur = cur.plusDays(1); }
        return dates;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public BatchPublishResult batchPublish(List<Long> ids) {
        BatchPublishResult result = new BatchPublishResult();
        int success = 0, fail = 0, totalTasks = 0;
        List<String> errors = new ArrayList<>();
        for (Long id : ids) {
            try {
                ProdPlan plan = this.getById(id);
                if (plan == null) { fail++; errors.add("计划ID=" + id + " 不存在"); continue; }
                if (!"approved".equals(plan.getStatus()) && !"draft".equals(plan.getStatus())) {
                    fail++; errors.add("计划\u300C" + plan.getTitle() + "\u300D非草稿或已审批状态"); continue;
                }
                PublishResult pr = this.publish(id, null);
                success++; totalTasks += pr.getTasksGenerated();
            } catch (Exception e) { fail++; errors.add("计划ID=" + id + " 发布失败: " + e.getMessage()); }
        }
        result.setSuccessCount(success); result.setFailCount(fail); result.setTotalTasks(totalTasks); result.setErrors(errors);
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
        prodTaskService.lambdaUpdate()
            .eq(ProdTask::getPlanId, id).in(ProdTask::getStatus, "pending", "assigned", "doing")
            .set(ProdTask::getStatus, "skipped").set(ProdTask::getCancelReason, reason).update();
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean complete(Long id) {
        ProdPlan plan = this.getById(id);
        if (plan == null) throw new RuntimeException("计划不存在");
        plan.setStatus("completed"); this.updateById(plan);
        prodTaskService.lambdaUpdate()
            .eq(ProdTask::getPlanId, id).eq(ProdTask::getStatus, "doing")
            .set(ProdTask::getStatus, "done").update();
        return true;
    }

    @Override @Transactional(rollbackFor = Exception.class)
    public Long copy(Long id) {
        ProdPlan s = this.getById(id);
        if (s == null) throw new RuntimeException("原计划不存在");
        ProdPlan t = new ProdPlan();
        t.setBaseId(s.getBaseId()); t.setParentPlanId(s.getParentPlanId());
        t.setTargetType(s.getTargetType()); t.setTargetId(s.getTargetId());
        t.setPlanType(s.getPlanType()); t.setTitle(s.getTitle() + "-副本");
        t.setContentDesc(s.getContentDesc());
        t.setStartTime(s.getStartTime()); t.setEndTime(s.getEndTime());
        t.setCycleRule(s.getCycleRule()); t.setStatus("draft");
        t.setOwnerId(s.getOwnerId()); t.setAssigneeGroupId(s.getAssigneeGroupId());
        this.save(t); return t.getId();
    }

    @Override
    public Map<String, Long> getStats() {
        Map<String, Long> m = new HashMap<>();
        m.put("total", this.count());
        for (String s : new String[]{"draft","pending_approval","published","active","completed","cancelled"}) {
            m.put(s, this.count(new LambdaQueryWrapper<ProdPlan>().eq(ProdPlan::getStatus, s)));
        }
        return m;
    }

    private List<LocalDateTime> calcTaskTimes(LocalDateTime start, LocalDateTime end, String rule) {
        List<LocalDateTime> times = new ArrayList<>();
        if (start == null) return times;
        if (end == null) end = start;
        int days = parseCycleDays(rule);
        LocalDateTime cur = start;
        while (!cur.isAfter(end)) { times.add(cur); if (days <= 0) break; cur = cur.plusDays(days); }
        return times;
    }

    private int parseCycleDays(String rule) {
        if (StringUtils.isBlank(rule)) return 0;
        switch (rule.toLowerCase()) {
            case "daily": return 1; case "weekly": return 7;
            default:
                Matcher m = Pattern.compile("every_(\\d+)_days").matcher(rule);
                if (m.find()) return Integer.parseInt(m.group(1));
                m = Pattern.compile("every_(\\d+)_weeks").matcher(rule);
                return m.find() ? Integer.parseInt(m.group(1)) * 7 : 0;
        }
    }

    @Override @Transactional(rollbackFor = Exception.class)
    public void submitForApproval(Long id, Long submitterId, Long approverId, String comment) {
        ProdPlan plan = checkPlan(id);
        if (!"draft".equals(plan.getStatus())) throw new RuntimeException("仅草稿状态的计划可提交审批");
        plan.setStatus("pending_approval"); plan.setApproverId(approverId);
        plan.setApproveComment(null); plan.setApproveTime(null);
        this.updateById(plan);
        approvalService.saveRecord(id, submitterId, approverId, "submit", comment);
        rabbitTemplate.convertAndSend(PlanApprovalRabbitConfig.APPROVAL_REQUEST_EXCHANGE,
            PlanApprovalRabbitConfig.APPROVAL_REQUEST_ROUTING_KEY,
            String.format("{\"planId\":%d,\"submitterId\":%d,\"approverId\":%d,\"planTitle\":\"%s\",\"planType\":\"%s\",\"baseId\":%d}",
                id, submitterId, approverId != null ? approverId : 0,
                plan.getTitle() != null ? plan.getTitle().replace("\"", "\\\"") : "",
                plan.getPlanType() != null ? plan.getPlanType() : "",
                plan.getBaseId() != null ? plan.getBaseId() : 0));
        log.info("计划 {} 已提交审批，RabbitMQ消息已发送", id);
    }

    @Override @Transactional(rollbackFor = Exception.class)
    public void approve(Long id, Long approverId, String comment) {
        ProdPlan plan = checkPlan(id);
        if (!"pending_approval".equals(plan.getStatus())) throw new RuntimeException("仅待审批状态的计划可审批通过");
        plan.setStatus("approved"); plan.setApproverId(approverId);
        plan.setApproveComment(comment); plan.setApproveTime(LocalDateTime.now());
        this.updateById(plan);
        approvalService.saveRecord(id, plan.getOwnerId(), approverId, "approve", comment);
        try {
            rabbitTemplate.convertAndSend(PlanApprovalRabbitConfig.APPROVAL_RESULT_EXCHANGE,
                PlanApprovalRabbitConfig.APPROVAL_RESULT_ROUTING_KEY,
                String.format("{\"planId\":%d,\"approverId\":%d,\"action\":\"approve\",\"comment\":\"%s\"}",
                    id, approverId, comment != null ? comment.replace("\"", "\\\"") : ""));
        } catch (Exception e) { log.warn("发送RabbitMQ消息失败: {}", e.getMessage()); }
        PublishResult pr = this.publish(id, null);
        log.info("计划 {} 审批通过后自动发布，生成 {} 个任务", id, pr.getTasksGenerated());
    }

    @Override @Transactional(rollbackFor = Exception.class)
    public void reject(Long id, Long approverId, String comment) {
        ProdPlan plan = checkPlan(id);
        if (!"pending_approval".equals(plan.getStatus())) throw new RuntimeException("仅待审批状态的计划可驳回");
        plan.setStatus("rejected"); plan.setApproverId(approverId);
        plan.setApproveComment(comment); plan.setApproveTime(LocalDateTime.now());
        this.updateById(plan);
        approvalService.saveRecord(id, plan.getOwnerId(), approverId, "reject", comment);
        try {
            rabbitTemplate.convertAndSend(PlanApprovalRabbitConfig.APPROVAL_RESULT_EXCHANGE,
                PlanApprovalRabbitConfig.APPROVAL_RESULT_ROUTING_KEY,
                String.format("{\"planId\":%d,\"approverId\":%d,\"action\":\"reject\",\"comment\":\"%s\"}",
                    id, approverId, comment != null ? comment.replace("\"", "\\\"") : ""));
        } catch (Exception e) { log.warn("发送RabbitMQ消息失败: {}", e.getMessage()); }
        log.info("计划 {} 已驳回", id);
    }

    private ProdPlan checkPlan(Long id) {
        ProdPlan plan = this.getById(id);
        if (plan == null) throw new RuntimeException("计划不存在");
        return plan;
    }

        @Override
    public List<PlanApprovalRecord> getApprovalRecords(Long planId) {
        return approvalService.getRecords(planId);
    }
}
