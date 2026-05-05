package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.controller.base.BaseAquacultureController;
import com.artsail.aquaculture.model.domain.Query.VslQuery;
import com.artsail.aquaculture.model.domain.Vsl;
import com.artsail.aquaculture.service.VslService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 工船管理控制器
 */
@RestController
@RequestMapping("/vsl")
@RequiredArgsConstructor
public class VslController extends BaseAquacultureController<VslService, Vsl, Vsl, VslQuery> {

    private final VslService vslService;

    /**
     * 实现父类定义的抽象查询方法
     */
    @Override
    public Result<Page<Vsl>> search(Page<Vsl> page, VslQuery query) {
        return Result.success(vslService.search(page, query));
    }
}
