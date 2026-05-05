package com.artsail.aquaculture.model.domain.Query;

import lombok.Data;

@Data
public class MatSupplierQuery {
    
    private String supplierCode;
    private String supplierName;
    private String contactPerson;
    private String phone;
    private Integer status;
}
