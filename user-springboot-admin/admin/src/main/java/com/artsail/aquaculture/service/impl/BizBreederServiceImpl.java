package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.model.domain.BizBreeder;
import com.artsail.aquaculture.mapper.BizBreederMapper;
import com.artsail.aquaculture.model.domain.Query.BreederQuery;
import com.artsail.aquaculture.model.domain.VO.BizBreederVO;
import com.artsail.aquaculture.service.BizBreederService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BizBreederServiceImpl extends ServiceImpl<BizBreederMapper, BizBreeder> implements BizBreederService {

    private final BizBreederMapper bizBreederMapper;

    @Override
    public Page<BizBreederVO> search(Page<BizBreederVO> page, BreederQuery query) {
        return bizBreederMapper.searchWithNames(page, query);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void savePonds(Long breederId, List<Long> pondIds) {
        bizBreederMapper.deleteBreederPonds(breederId);
        if (pondIds != null && !pondIds.isEmpty()) {
            bizBreederMapper.insertBreederPonds(breederId, pondIds);
        }
    }
}
