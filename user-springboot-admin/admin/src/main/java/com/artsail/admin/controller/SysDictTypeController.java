package com.artsail.admin.controller;

import com.artsail.admin.controller.base.BaseAdminController;
import com.artsail.admin.model.domain.SysDictType;
import com.artsail.admin.model.domain.Query.SysDictTypeQuery;
import com.artsail.admin.service.SysDictTypeService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/system/dict/type")
@RequiredArgsConstructor
public class SysDictTypeController extends BaseAdminController<SysDictTypeService, SysDictType, SysDictTypeQuery> {

    private final SysDictTypeService sysDictTypeService;

    @Override
    public Result<Page<SysDictType>> list(Page<SysDictType> page, SysDictTypeQuery query) {
        return Result.success(sysDictTypeService.search(page, query));
    }
}
