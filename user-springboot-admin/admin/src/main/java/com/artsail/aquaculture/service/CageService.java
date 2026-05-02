package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.Cage;
import com.artsail.aquaculture.model.domain.Query.CageQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface CageService extends IService<Cage> {

    /**
     * 查询网箱（支持分页和条件）
     * @param page 分页参数（MP自动注入）
     * @param query 查询条件
     * @return 分页结果
     */
    Page<Cage> search(Page<Cage> page, CageQuery query);
}
