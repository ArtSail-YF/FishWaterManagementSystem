package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.Query.VslQuery;
import com.artsail.aquaculture.model.domain.Vsl;
import com.artsail.aquaculture.service.VslService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 工船管理控制器
 */
@RestController
@RequestMapping("/vsl")
public class VslController extends BaseController<VslService, Vsl, Vsl, VslQuery> {

    @Autowired
    private VslService vslService;

    /**
     * 实现父类定义的抽象查询方法
     */
    @Override
    public Result<Page<Vsl>> search(Page<Vsl> page, VslQuery query) {
        return Result.success(vslService.search(page, query));
    }
}
