package com.artsail.production.service.impl;

import com.artsail.production.mapper.ProdLogMapper;
import com.artsail.production.model.domain.ProdLog;
import com.artsail.production.model.domain.Query.ProdLogQuery;
import com.artsail.production.service.ProdLogService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 生产日志Service实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProdLogServiceImpl extends ServiceImpl<ProdLogMapper, ProdLog> implements ProdLogService {

    private final ProdLogMapper prodLogMapper;

    @Override
    public Page<ProdLog> search(Page<ProdLog> page, ProdLogQuery query) {
        LambdaQueryWrapper<ProdLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(query.getTaskId() != null, ProdLog::getTaskId, query.getTaskId())
               .eq(query.getPlanId() != null, ProdLog::getPlanId, query.getPlanId())
               .eq(query.getBaseId() != null, ProdLog::getBaseId, query.getBaseId())
               .eq(StringUtils.isNotBlank(query.getTargetType()), ProdLog::getTargetType, query.getTargetType())
               .eq(query.getTargetId() != null, ProdLog::getTargetId, query.getTargetId())
               .eq(StringUtils.isNotBlank(query.getLogType()), ProdLog::getLogType, query.getLogType())
               .eq(StringUtils.isNotBlank(query.getSource()), ProdLog::getSource, query.getSource())
               .orderByDesc(ProdLog::getActionTime);
        return this.page(page, wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean verify(Long id, String verifyStatus, String reason) {
        ProdLog log = this.getById(id);
        if (log == null) {
            throw new RuntimeException("日志不存在");
        }
        log.setVerifyStatus(verifyStatus);
        return this.updateById(log);
    }

    @Override
    public Map<String, Long> getStatsByType() {
        List<Map<String, Object>> stats = prodLogMapper.selectStatsByLogType();
        return stats.stream()
                .collect(Collectors.toMap(
                        item -> (String) item.get("logType"),
                        item -> ((Number) item.get("count")).longValue()
                ));
    }

    @Override
    public List<Map<String, Object>> getStatsByBase() {
        return prodLogMapper.selectStatsByBase();
    }

    @Override
    public List<ProdLog> getPondHistory(Long pondId, String logType) {
        LambdaQueryWrapper<ProdLog> wrapper = new LambdaQueryWrapper<ProdLog>()
                .eq(ProdLog::getTargetType, "pond")
                .eq(ProdLog::getTargetId, pondId)
                .eq(StringUtils.isNotBlank(logType), ProdLog::getLogType, logType)
                .orderByDesc(ProdLog::getActionTime);
        return this.list(wrapper);
    }
}