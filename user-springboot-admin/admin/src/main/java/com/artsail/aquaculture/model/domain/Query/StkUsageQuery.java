package com.artsail.aquaculture.model.domain.Query;

import lombok.Data;

@Data
public class StkUsageQuery {
    
    private String usageNo;
    private Long baseId;
    private Long pondId;
    private Long taskId;
    private Long matId;
    private Long operatorId;
}
