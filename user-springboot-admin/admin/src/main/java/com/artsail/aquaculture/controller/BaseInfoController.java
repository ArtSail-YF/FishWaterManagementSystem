package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.BaseInfo;
import com.artsail.aquaculture.model.domain.Query.BaseQuery;
import com.artsail.aquaculture.service.BaseInfoService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author 13372
 */
@RestController
@RequestMapping("/base")
public class BaseInfoController extends BaseController<BaseInfoService, BaseInfo, BaseInfo, BaseQuery> {

    @Autowired
    private BaseInfoService baseInfoService;

    /**
     * 实现父类定义的抽象查询方法
     */
    @Override
    public Result<Page<BaseInfo>> search(Page<BaseInfo> page, BaseQuery query) {
        return Result.success(baseInfoService.search(page, query));
    }


}