package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.MatInfoMapper;
import com.artsail.aquaculture.model.domain.MatInfo;
import com.artsail.aquaculture.model.domain.Query.MatInfoQuery;
import com.artsail.aquaculture.model.domain.VO.MatInfoVO;
import com.artsail.aquaculture.service.MatInfoService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatInfoServiceImpl extends ServiceImpl<MatInfoMapper, MatInfo> implements MatInfoService {

    private final MatInfoMapper matInfoMapper;

    @Override
    public Page<MatInfoVO> search(Page<MatInfoVO> page, MatInfoQuery query) {
        return matInfoMapper.searchWithCategory(page, query);
    }
}
