package com.artsail.production.service;

import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.VO.ProdTaskVO;
import com.artsail.production.model.domain.Query.ProdTaskQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ProdTaskService extends IService<ProdTask> {
    Page<ProdTaskVO> search(Page<ProdTaskVO> page, ProdTaskQuery query);
    boolean assign(Long id, Long assigneeId);
    boolean startTask(Long id);
    boolean completeTask(Long id, Map<String, Object> logData);
    boolean skipTask(Long id, String reason);
    List<ProdTask> getTimeline(Long pondId);
    List<ProdTask> getTasksByDate(LocalDate date);
    Map<String, Object> getStats();
}
