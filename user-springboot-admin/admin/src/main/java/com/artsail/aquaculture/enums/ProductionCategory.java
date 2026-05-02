package com.artsail.aquaculture.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 生产载体类型枚举
 */
@Getter
@AllArgsConstructor
public enum ProductionCategory {
    
    /**
     * 塘口
     */
    POND("pond", "塘口"),
    
    /**
     * 网箱
     */
    CAGE("cage", "网箱"),
    
    /**
     * 工船
     */
    WORKBOAT("workboat", "工船");
    
    /**
     * 编码
     */
    private final String code;
    
    /**
     * 描述
     */
    private final String desc;
    
    /**
     * 根据编码获取枚举
     */
    public static ProductionCategory fromCode(String code) {
        for (ProductionCategory category : values()) {
            if (category.getCode().equals(code)) {
                return category;
            }
        }
        throw new IllegalArgumentException("未知的生产载体类型: " + code);
    }
}
