package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.Pond;
import com.artsail.aquaculture.model.domain.Query.PondQuery;
import com.artsail.aquaculture.model.domain.VO.PondVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface PondService extends IService<Pond> {

    /**
     * 查询塘口（支持分页和条件）
     * @param page 分页参数（MP自动注入）
     * @param query 查询条件
     * @return 分页结果
     */
    Page<PondVO> search(Page<PondVO> page, PondQuery query);
}