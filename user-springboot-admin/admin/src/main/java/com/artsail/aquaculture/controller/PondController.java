package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.Pond;
import com.artsail.aquaculture.model.domain.Query.PondQuery;
import com.artsail.aquaculture.model.domain.VO.PondVO;
import com.artsail.aquaculture.service.PondService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 塘口管理控制器
 */
@RestController
@RequestMapping("/pond")
public class PondController extends BaseController<PondService, Pond, PondVO, PondQuery> {

    @Autowired
    private PondService pondService;

    /**
     * 实现父类定义的抽象查询方法
     */
    @Override
    public Result<Page<PondVO>> search(Page<PondVO> page, PondQuery query) {
        return Result.success(pondService.search(page, query));
    }
}
