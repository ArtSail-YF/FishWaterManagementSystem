package com.artsail.aquaculture.model.domain;

import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("mat_supplier")
@EqualsAndHashCode(callSuper = true)
public class MatSupplier extends BaseEntity {

    private String supplierCode;
    private String supplierName;
    private String contactPerson;
    private String phone;
    private String address;
    private String licenseImg;
    private Integer status;

    @TableLogic
    private Integer isDelete;
}
