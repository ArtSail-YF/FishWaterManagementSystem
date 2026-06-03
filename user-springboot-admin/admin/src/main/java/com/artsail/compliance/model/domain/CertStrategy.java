package com.artsail.compliance.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * 合格证策略 (cert_strategy)
 * A类: 质量控制承诺, B类: 检测合格
 */
@Data
@TableName("cert_strategy")
public class CertStrategy implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String strategyName;
    private String specType;
    private String requiredTests;
    private Integer status;
}
