package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.approval.model.domain.PlanApprovalRecord;
import com.artsail.production.model.domain.ProdPlan;
import com.artsail.production.model.domain.VO.ProdPlanVO;
import com.artsail.production.model.domain.Query.ProdPlanQuery;
import com.artsail.approval.model.domain.request.ApprovalActionRequest;
import com.artsail.approval.model.domain.request.SubmitApprovalRequest;
import com.artsail.production.service.ProdPlanService;
import com.artsail.admin.model.domain.User;
import com.artsail.admin.contant.UserConstant;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/plan")
public class ProdPlanController extends BaseController<ProdPlanService, ProdPlan, ProdPlanVO, ProdPlanQuery> {

    @Autowired
    private ProdPlanService prodPlanService;

    @Override
    public Result<Page<ProdPlanVO>> search(Page<ProdPlanVO> page, ProdPlanQuery query) {
        return Result.success(prodPlanService.search(page, query));
    }

    /** 单条发布（支持配置） */
    @PostMapping("/{id}/publish")
    public Result<ProdPlanService.PublishResult> publish(
            @PathVariable Long id,
            @RequestBody(required = false) ProdPlanService.PublishPlanRequest request) {
        return Result.success(prodPlanService.publish(id, request));
    }

    /** 批量发布 */
    @PostMapping("/batch-publish")
    public Result<ProdPlanService.BatchPublishResult> batchPublish(@RequestBody Map<String, List<Long>> body) {
        List<Long> ids = body.get("ids");
        if (ids == null || ids.isEmpty()) {
            return Result.error("发布计划ID列表不能为空");
        }
        return Result.success(prodPlanService.batchPublish(ids));
    }

    @PostMapping("/{id}/cancel")
    public Result<Boolean> cancel(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return Result.success(prodPlanService.cancel(id, reason));
    }

    @PostMapping("/{id}/complete")
    public Result<Boolean> complete(@PathVariable Long id) {
        return Result.success(prodPlanService.complete(id));
    }

    @PostMapping("/{id}/copy")
    public Result<Long> copy(@PathVariable Long id) {
        return Result.success(prodPlanService.copy(id));
    }

    @GetMapping("/stats")
    public Result<Map<String, Long>> stats() {
        return Result.success(prodPlanService.getStats());
    }

    /** 获取计划类型的默认任务模板 */
    @GetMapping("/{planType}/task-templates")
    public Result<List<ProdPlanService.TaskTemplateItem>> taskTemplates(
            @PathVariable String planType,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        return Result.success(prodPlanService.getTaskTemplates(planType, startTime, endTime));
    }

    // ====== 审批相关接口 ======

    /** 提交审批 */
    @PostMapping("/{id}/submit-approval")
    public Result<Void> submitApproval(
            @PathVariable Long id,
            @RequestBody(required = false) SubmitApprovalRequest request,
            HttpServletRequest httpRequest) {
        User loginUser = (User) httpRequest.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        Long currentUserId = loginUser != null ? loginUser.getId() : 1L;
        prodPlanService.submitForApproval(id, currentUserId,
                request != null ? request.getApproverId() : null,
                request != null ? request.getComment() : null);
        return Result.success(null);
    }

    /** 审批通过 */
    @PostMapping("/{id}/approve")
    public Result<Void> approve(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalActionRequest request,
            HttpServletRequest httpRequest) {
        User loginUser = (User) httpRequest.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        Long currentUserId = loginUser != null ? loginUser.getId() : 1L;
        prodPlanService.approve(id, currentUserId, request != null ? request.getComment() : null);
        return Result.success(null);
    }

    /** 审批驳回 */
    @PostMapping("/{id}/reject")
    public Result<Void> reject(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalActionRequest request,
            HttpServletRequest httpRequest) {
        User loginUser = (User) httpRequest.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        Long currentUserId = loginUser != null ? loginUser.getId() : 1L;
        prodPlanService.reject(id, currentUserId, request != null ? request.getComment() : null);
        return Result.success(null);
    }

    /** 获取计划的审批记录 */
    @GetMapping("/{id}/approval-records")
    public Result<List<PlanApprovalRecord>> approvalRecords(@PathVariable Long id) {
        return Result.success(prodPlanService.getApprovalRecords(id));
    }
}
