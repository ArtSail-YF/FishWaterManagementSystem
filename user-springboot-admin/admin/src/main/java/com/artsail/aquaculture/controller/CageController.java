package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.Cage;
import com.artsail.aquaculture.model.domain.Query.CageQuery;
import com.artsail.aquaculture.service.CageService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 网箱管理控制器
 * @author 13372
 */
@RestController
@RequestMapping("/cage")
public class CageController extends BaseController<CageService, Cage, Cage, CageQuery> {

    @Autowired
    private CageService cageService;

    /**
     * 实现父类定义的抽象查询方法
     */
    @Override
    public Result<Page<Cage>> search(Page<Cage> page, CageQuery query) {
        return Result.success(cageService.search(page, query));
    }
}
