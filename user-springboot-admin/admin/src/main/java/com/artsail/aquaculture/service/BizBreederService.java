package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.BizBreeder;
import com.artsail.aquaculture.model.domain.Query.BreederQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 养殖户/主体信息服务接口
 */
public interface BizBreederService extends IService<BizBreeder> {
    
    /**
     * 分页查询养殖户
     */
    Page<BizBreeder> search(Page<BizBreeder> page, BreederQuery query);
}
