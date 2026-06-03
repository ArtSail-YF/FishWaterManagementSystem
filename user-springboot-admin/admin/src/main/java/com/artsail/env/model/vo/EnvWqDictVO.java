package com.artsail.env.model.vo;

import lombok.Data;
import java.util.List;
import java.util.Map;

/**
 * 水质看板字典数据（下拉选项）
 */
@Data
public class EnvWqDictVO {
    private List<Map<String, Object>> baseList;
    private List<Map<String, Object>> pondStatusList;
    private List<Map<String, Object>> speciesList;
}
