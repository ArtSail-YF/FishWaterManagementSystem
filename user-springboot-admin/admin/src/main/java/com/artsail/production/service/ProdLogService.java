package com.artsail.production.service;

import com.artsail.production.model.domain.ProdLog;
import com.artsail.production.model.domain.Query.ProdLogQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface ProdLogService extends IService<ProdLog> {
    Page<ProdLog> search(Page<ProdLog> page, ProdLogQuery query);
}
