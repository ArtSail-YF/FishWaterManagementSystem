package com.artsail.production.service;

import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.Query.ProdTaskQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface ProdTaskService extends IService<ProdTask> {
    Page<ProdTask> search(Page<ProdTask> page, ProdTaskQuery query);
}
