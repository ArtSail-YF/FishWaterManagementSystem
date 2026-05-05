package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.PondMapper;
import com.artsail.aquaculture.model.domain.Pond;
import com.artsail.aquaculture.model.domain.Query.PondQuery;
import com.artsail.aquaculture.model.domain.VO.PondVO;
import com.artsail.aquaculture.service.PondService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PondServiceImpl extends ServiceImpl<PondMapper, Pond> implements PondService {

    private final PondMapper pondMapper;

    @Override
    public Page<PondVO> search(Page<PondVO> page, PondQuery query) {
        return pondMapper.searchWithBase(page, query);
    }
}