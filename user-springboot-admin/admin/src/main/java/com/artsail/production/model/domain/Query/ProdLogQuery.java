package com.artsail.production.model.domain.Query;

import lombok.Data;

@Data
public class ProdLogQuery  {
    
    private Long taskId;
    private Long planId;
    private Long baseId;
    private String targetType;
    private Long targetId;
    private String logType;
    private String source;
}
