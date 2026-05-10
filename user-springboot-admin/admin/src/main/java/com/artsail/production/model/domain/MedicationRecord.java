package com.artsail.production.model.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 用药记录实体类 (对应 med_record 表)
 */
@Data
@TableName("med_record")
public class MedicationRecord {

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 基地ID
     */
    private Long baseId;

    /**
     * 塘口ID
     */
    private Long pondId;

    /**
     * 药品物资ID (关联 mat_info.id)
     */
    private Long drugMatId;

    /**
     * 使用数量
     */
    private BigDecimal usageQty;

    /**
     * 施药日期 (仅日期)
     */
    private LocalDate adminDate;

    /**
     * 该药品的休药期天数 (快照)
     */
    private Integer withdrawalDays;

    /**
     * 禁止收获截止日期 (计算字段: admin_date + withdrawal_days)
     */
    private LocalDate banHarvestUntil;

    /**
     * 关联的生产日志ID (prod_log.id)
     */
    private Long logId;

    /**
     * 记录创建时间
     */
    private LocalDateTime createTime;

    // ========== 关联查询字段（非数据库字段） ==========

    /**
     * 药品名称（来自 mat_info.mat_name）
     */
    private String medicineName;

    /**
     * 药品规格（来自 mat_info.spec）
     */
    private String medicineType;

    /**
     * 生产厂家（来自 mat_info.manufacturer）
     */
    private String manufacturer;

    /**
     * 批准文号（来自 mat_info.approval_number）
     */
    private String approvalNumber;

    /**
     * 塘口名称（来自 pond_info.pond_name）
     */
    private String pondName;

    /**
     * 塘口编码（来自 pond_info.pond_code）
     */
    private String pondCode;
}
