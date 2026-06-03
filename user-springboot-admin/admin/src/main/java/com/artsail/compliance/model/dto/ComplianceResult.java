package com.artsail.compliance.model.dto;

import lombok.Data;
import java.util.List;

/**
 * 合规校验结果
 */
@Data
public class ComplianceResult {
    private boolean passed;
    private List<String> reasons;

    public ComplianceResult() {}
    public ComplianceResult(boolean passed, List<String> reasons) {
        this.passed = passed;
        this.reasons = reasons;
    }
}
