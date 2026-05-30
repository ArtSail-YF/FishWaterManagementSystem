package com.artsail.aquaculture.model.domain.VO;

import com.artsail.aquaculture.model.domain.BizBreeder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 养殖户 VO — 带关联名称及塘口信息
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class BizBreederVO extends BizBreeder {

    /** 基地名称 */
    private String baseName;

    /** 关联塘口ID列表（逗号分隔） */
    private String pondIds;

    /** 关联塘口名称列表（逗号分隔） */
    private String pondNames;
}
