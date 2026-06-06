package com.artsail.approval.service;

import com.artsail.approval.mapper.PlanApprovalRecordMapper;
import com.artsail.approval.model.domain.PlanApprovalRecord;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final PlanApprovalRecordMapper planApprovalRecordMapper;

    public void saveRecord(Long planId, Long submitterId, Long approverId, String action, String comment) {
        PlanApprovalRecord r = new PlanApprovalRecord();
        r.setPlanId(planId);
        r.setSubmitterId(submitterId);
        r.setApproverId(approverId);
        r.setAction(action);
        r.setComment(comment);
        r.setActionTime(LocalDateTime.now());
        r.setCreateTime(LocalDateTime.now());
        r.setUpdateTime(LocalDateTime.now());
        planApprovalRecordMapper.insert(r);
    }

    public List<PlanApprovalRecord> getRecords(Long planId) {
        return planApprovalRecordMapper.selectList(
                new LambdaQueryWrapper<PlanApprovalRecord>()
                        .eq(PlanApprovalRecord::getPlanId, planId)
                        .orderByDesc(PlanApprovalRecord::getActionTime));
    }
}
