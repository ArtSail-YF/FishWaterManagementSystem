package com.artsail.aquaculture.model.domain;

import com.artsail.common.domain.LogicDeleteEntity;

import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("mat_category")
@EqualsAndHashCode(callSuper = true)
public class MatCategory extends LogicDeleteEntity {

    private String catCode;      // 分类编码
    private String catName;      // 分类名称
    private Long parentId;       // 父级ID
    private Integer sortOrder;   // 排序
    private Integer status;      // 状态
}
