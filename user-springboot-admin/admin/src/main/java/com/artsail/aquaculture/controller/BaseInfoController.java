package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.controller.base.BaseAquacultureController;
import com.artsail.aquaculture.model.domain.BaseInfo;
import com.artsail.aquaculture.model.domain.Query.BaseQuery;
import com.artsail.aquaculture.service.BaseInfoService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author 13372
 */
@RestController
@RequestMapping("/base")
@RequiredArgsConstructor
// 继承通用基类
public class BaseInfoController extends BaseAquacultureController<BaseInfoService, BaseInfo, BaseInfo, BaseQuery> {

    private final BaseInfoService baseInfoService;

    /**
     * 实现父类定义的抽象查询方法
     */
    @Override
    public Result<Page<BaseInfo>> search(Page<BaseInfo> page, BaseQuery query) {
        return Result.success(baseInfoService.search(page, query));
    }


}