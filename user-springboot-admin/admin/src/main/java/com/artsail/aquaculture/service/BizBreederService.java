package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.BizBreeder;
import com.artsail.aquaculture.model.domain.Query.BreederQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface BizBreederService extends IService<BizBreeder> {

    /**
     * 查询养殖户（支持分页和条件）
     * @param page 分页参数（MP自动注入）
     * @param query 查询条件
     * @return 分页结果
     */
    Page<BizBreeder> search(Page<BizBreeder> page, BreederQuery query);
}


