package com.artsail.compliance.model.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * 塘口休药期状态
 */
@Data
public class WithdrawalStatus {
    private Long pondId;
    private String pondName;
    private boolean locked;
    private long remainingDays;
    private LocalDate lockedUntil;
    private List<WithdrawalDrugInfo> relatedDrugs;
}
