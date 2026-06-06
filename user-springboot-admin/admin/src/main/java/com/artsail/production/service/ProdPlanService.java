package com.artsail.production.service;

import com.artsail.approval.model.domain.PlanApprovalRecord;
import com.artsail.production.model.domain.ProdPlan;
import com.artsail.production.model.domain.VO.ProdPlanVO;
import com.artsail.production.model.domain.Query.ProdPlanQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface ProdPlanService extends IService<ProdPlan> {

    /** 分页查询（返回带名称的VO） */
    Page<ProdPlanVO> search(Page<ProdPlanVO> page, ProdPlanQuery query);

    /** 发布计划（增强版：返回发布结果） */
    PublishResult publish(Long id, PublishPlanRequest request);

    /** 批量发布计划 */
    BatchPublishResult batchPublish(List<Long> ids);

    /** 获取计划类型的默认任务模板 */
    List<TaskTemplateItem> getTaskTemplates(String planType, LocalDateTime startTime, LocalDateTime endTime);

    boolean cancel(Long id, String reason);

    boolean complete(Long id);

    Long copy(Long id);

    Map<String, Long> getStats();

    // ====== 审批相关 ======

    /** 提交审批 */
    void submitForApproval(Long id, Long submitterId, Long approverId, String comment);

    /** 审批通过 */
    void approve(Long id, Long approverId, String comment);

    /** 审批驳回 */
    void reject(Long id, Long approverId, String comment);

    /** 获取计划的审批记录 */
    List<PlanApprovalRecord> getApprovalRecords(Long planId);

    // ====== DTO ======

    @Data
    class PublishPlanRequest {
        private String taskTitleTemplate;
        private Long defaultAssigneeId;
        private Boolean skipTaskGen;
        /** 自定义任务清单（发布时指定具体任务） */
        private List<TaskConfig> tasks;
    }

    @Data
    class TaskConfig {
        private String taskTitle;
        private LocalDateTime actionTime;
        private Integer durationMinutes;
        private Long assigneeId;
        private Long deviceId;
        private String deviceAction;
        private String priority;
    }

    @Data
    class TaskTemplateItem {
        private String taskTitle;
        private Integer defaultHour;
        private Integer defaultMinute;
        private Integer durationMinutes;
        private boolean supportIot;
    }

    @Data
    class PublishResult {
        private Long planId;
        private String planTitle;
        private Integer tasksGenerated;
    }

    @Data
    class BatchPublishResult {
        private Integer successCount;
        private Integer failCount;
        private Integer totalTasks;
        private List<String> errors;
    }
}
