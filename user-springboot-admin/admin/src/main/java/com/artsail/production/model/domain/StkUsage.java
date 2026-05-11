package com.artsail.production.model.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 物资使用记录实体类 (对应 stk_usage 表)
 */
@Data
@TableName("stk_usage")
public class StkUsage {

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 使用单号
     */
    private String usageNo;

    /**
     * 基地ID
     */
    private Long baseId;

    /**
     * 塘口ID
     */
    private Long pondId;

    /**
     * 关联的生产任务ID (可选)
     */
    private Long taskId;

    /**
     * 物资ID
     */
    private Long matId;

    /**
     * 使用数量
     */
    private BigDecimal useQty;

    /**
     * 单价 (用于核算成本)
     */
    private BigDecimal unitPrice;

    /**
     * 总价
     */
    private BigDecimal totalPrice;

    /**
     * 操作人
     */
    private Long operatorId;

    /**
     * 使用时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime useTime;

    /**
     * 备注
     */
    private String remark;

    // ========== 关联查询字段（非数据库字段） ==========

    /**
     * 物资名称（来自 mat_info.mat_name）
     */
    private String matName;

    /**
     * 物资分类（来自 mat_category.cat_name）
     */
    private String categoryName;

    /**
     * 物资规格（来自 mat_info.spec）
     */
    private String spec;

    /**
     * 计量单位（来自 mat_info.unit）
     */
    private String unit;

    /**
     * 塘口名称（来自 pond_info.pond_name）
     */
    private String pondName;

    /**
     * 塘口编码（来自 pond_info.pond_code）
     */
    private String pondCode;

    /**
     * 操作人姓名（来自 user.user_name）
     */
    private String operatorName;
}
