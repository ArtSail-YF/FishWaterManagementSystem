package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.BizBreeder;
import com.artsail.aquaculture.model.domain.Query.BreederQuery;
import com.artsail.aquaculture.service.BizBreederService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 养殖户/主体管理控制器
 * @author 13372
 */
@RestController
@RequestMapping("/breeder")
public class BizBreederController extends BaseController<BizBreederService, BizBreeder, BizBreeder, BreederQuery> {

    @Autowired
    private BizBreederService bizBreederService;

    /**
     * 实现父类定义的抽象查询方法
     */
    @Override
    public Result<Page<BizBreeder>> search(Page<BizBreeder> page, BreederQuery query) {
        return Result.success(bizBreederService.search(page, query));
    }
}
