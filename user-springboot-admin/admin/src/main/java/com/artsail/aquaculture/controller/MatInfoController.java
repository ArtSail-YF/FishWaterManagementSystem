package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.controller.base.BaseAquacultureController;
import com.artsail.aquaculture.model.domain.MatInfo;
import com.artsail.aquaculture.model.domain.Query.MatInfoQuery;
import com.artsail.aquaculture.model.domain.VO.MatInfoVO;
import com.artsail.aquaculture.service.MatInfoService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/material/info")
@RequiredArgsConstructor
public class MatInfoController extends BaseAquacultureController<MatInfoService, MatInfo, MatInfoVO, MatInfoQuery> {

    private final MatInfoService matInfoService;

    @Override
    public Result<Page<MatInfoVO>> search(Page<MatInfoVO> page, MatInfoQuery query) {
        return Result.success(matInfoService.search(page, query));
    }
}
