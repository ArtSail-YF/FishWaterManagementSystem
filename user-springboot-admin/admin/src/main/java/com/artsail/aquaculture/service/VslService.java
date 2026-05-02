package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.Vsl;
import com.artsail.aquaculture.model.domain.Query.VslQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface VslService extends IService<Vsl> {

    /**
     * 查询工船（支持分页和条件）
     * @param page 分页参数（MP自动注入）
     * @param query 查询条件
     * @return 分页结果
     */
    Page<Vsl> search(Page<Vsl> page, VslQuery query);
}
