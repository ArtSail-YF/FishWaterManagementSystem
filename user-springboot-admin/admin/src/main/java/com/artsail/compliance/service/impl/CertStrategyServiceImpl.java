package com.artsail.compliance.service.impl;

import com.artsail.compliance.mapper.CertStrategyMapper;
import com.artsail.compliance.model.domain.CertStrategy;
import com.artsail.compliance.service.CertStrategyService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class CertStrategyServiceImpl extends ServiceImpl<CertStrategyMapper, CertStrategy> implements CertStrategyService {
}
