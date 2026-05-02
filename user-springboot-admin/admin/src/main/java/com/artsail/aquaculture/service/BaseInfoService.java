package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.BaseInfo;
import com.artsail.aquaculture.model.domain.Query.BaseQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface BaseInfoService extends IService<BaseInfo> {

    /**
     * 查询基地（支持分页和条件）
     * @param page 分页参数（MP自动注入）
     * @param query 查询条件
     * @return 分页结果
     */
    Page<BaseInfo> search(Page<BaseInfo> page, BaseQuery query);
}
