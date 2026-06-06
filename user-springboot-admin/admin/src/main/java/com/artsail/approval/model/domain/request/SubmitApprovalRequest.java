package com.artsail.approval.model.domain.request;

import lombok.Data;

@Data
public class SubmitApprovalRequest {
    private Long approverId;
    private String comment;
}