package com.artsail.production.service;

import com.artsail.production.model.domain.ProdLog;
import com.artsail.production.model.domain.Query.ProdLogQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

public interface ProdLogService extends IService<ProdLog> {
    Page<ProdLog> search(Page<ProdLog> page, ProdLogQuery query);
    boolean verify(Long id, String verifyStatus, String reason);
    Map<String, Long> getStatsByType();
    List<Map<String, Object>> getStatsByBase();
    List<ProdLog> getPondHistory(Long pondId, String logType);
}