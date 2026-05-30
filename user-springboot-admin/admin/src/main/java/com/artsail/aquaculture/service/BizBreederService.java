package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.BizBreeder;
import com.artsail.aquaculture.model.domain.Query.BreederQuery;
import com.artsail.aquaculture.model.domain.VO.BizBreederVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 养殖户/主体信息服务接口
 */
public interface BizBreederService extends IService<BizBreeder> {

    Page<BizBreederVO> search(Page<BizBreederVO> page, BreederQuery query);

    void savePonds(Long breederId, List<Long> pondIds);
}
