package com.artsail.production.mapper;

import com.artsail.production.model.domain.ProdLog;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * 生产日志Mapper
 */
@Mapper
public interface ProdLogMapper extends BaseMapper<ProdLog> {
    
    /**
     * 按日志类型统计数量
     */
    List<Map<String, Object>> selectStatsByLogType();
    
    /**
     * 按基地统计数量
     */
    List<Map<String, Object>> selectStatsByBase();
}
