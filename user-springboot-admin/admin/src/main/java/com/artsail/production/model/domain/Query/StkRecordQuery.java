package com.artsail.production.model.domain.Query;

import lombok.Data;

@Data
public class StkRecordQuery {
    
    private String recordNo;
    private Long baseId;
    private Long matId;
    private String batchNo;
    private String type;
    private Long operatorId;
}
