package com.artsail.compliance.model.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * 休药期关联药品信息
 */
@Data
public class WithdrawalDrugInfo {
    private String drugName;
    private LocalDate adminDate;
    private int withdrawalDays;
    private LocalDate banHarvestUntil;
}
