package com.artsail.aquaculture.model.domain.Query;

import lombok.Data;

@Data
public class MatInfoQuery {
    
    private String matCode;
    private String matName;
    private Long catId;
    private Long supplierId;
    private Integer status;
}
