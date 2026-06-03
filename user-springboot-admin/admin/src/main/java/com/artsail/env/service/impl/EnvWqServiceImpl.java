package com.artsail.env.service.impl;

import com.artsail.env.mapper.EnvWqMapper;
import com.artsail.env.model.domain.EnvWq;
import com.artsail.env.model.vo.EnvWqDictVO;
import com.artsail.env.service.EnvWqService;
import com.artsail.aquaculture.model.domain.BaseInfo;
import com.artsail.aquaculture.service.BaseInfoService;
import com.artsail.aquaculture.model.domain.Pond;
import com.artsail.aquaculture.service.PondService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EnvWqServiceImpl extends ServiceImpl<EnvWqMapper, EnvWq> implements EnvWqService {

    private final EnvWqMapper envWqMapper;
    private final BaseInfoService baseInfoService;
    private final PondService pondService;

    @Override
    public List<EnvWq> getAllWithNames() {
        return envWqMapper.selectAllWithNames();
    }

    @Override
    public EnvWqDictVO getDict() {
        EnvWqDictVO dict = new EnvWqDictVO();

        // 1. 基地列表
        List<BaseInfo> bases = baseInfoService.lambdaQuery()
                .eq(BaseInfo::getIsDelete, 0).list();
        dict.setBaseList(bases.stream().map(b -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("label", b.getBaseName());
            m.put("value", b.getId());
            return m;
        }).collect(Collectors.toList()));

        // 2. 塘口状态列表
        dict.setPondStatusList(Arrays.asList(
                mapOf("养殖中", "breeding"),
                mapOf("空闲", "empty"),
                mapOf("废弃", "locked")
        ));

        // 3. 养殖品种列表（从 pond_info 去重）
        List<Pond> ponds = pondService.lambdaQuery()
                .select(Pond::getCurrentSpecies)
                .isNotNull(Pond::getCurrentSpecies)
                .ne(Pond::getCurrentSpecies, "")
                .groupBy(Pond::getCurrentSpecies)
                .list();
        dict.setSpeciesList(ponds.stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("label", p.getCurrentSpecies());
            m.put("value", p.getCurrentSpecies());
            return m;
        }).collect(Collectors.toList()));

        return dict;
    }

    private Map<String, Object> mapOf(String label, String value) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("label", label);
        m.put("value", value);
        return m;
    }
}
