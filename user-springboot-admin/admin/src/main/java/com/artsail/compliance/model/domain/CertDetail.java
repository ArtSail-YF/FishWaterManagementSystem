package com.artsail.compliance.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 合格证明细 (cert_detail) — 按塘口展开
 */
@Data
@TableName("cert_detail")
public class CertDetail implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long certId;
    private String targetType;
    private Long targetId;
    private BigDecimal quantity;
    private Integer isWithdrawalPassed;
    private Integer isTestPassed;
    private String testReportUrl;
}
