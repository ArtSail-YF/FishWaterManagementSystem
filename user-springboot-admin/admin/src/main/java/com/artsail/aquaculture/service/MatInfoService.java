package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.MatInfo;
import com.artsail.aquaculture.model.domain.Query.MatInfoQuery;
import com.artsail.aquaculture.model.domain.VO.MatInfoVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @author 13372
 */
public interface MatInfoService extends IService<MatInfo> {
    Page<MatInfoVO> search(Page<MatInfoVO> page, MatInfoQuery query);
}
