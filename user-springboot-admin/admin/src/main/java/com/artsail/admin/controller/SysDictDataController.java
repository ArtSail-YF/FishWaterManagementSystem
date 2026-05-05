package com.artsail.admin.controller;

import com.artsail.admin.controller.base.BaseAdminController;
import com.artsail.admin.model.domain.SysDictData;
import com.artsail.admin.model.domain.Query.SysDictDataQuery;
import com.artsail.admin.model.domain.VO.DictDataVO;
import com.artsail.admin.service.SysDictDataService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/system/dict/data")
@RequiredArgsConstructor
public class SysDictDataController extends BaseAdminController<SysDictDataService, SysDictData, SysDictDataQuery> {

    private final SysDictDataService sysDictDataService;

    @Override
    public Result<Page<SysDictData>> list(Page<SysDictData> page, SysDictDataQuery query) {
        return Result.success(sysDictDataService.search(page, query));
    }
    
    /**
     * 获取所有字典数据，按类型分组
     */
    @GetMapping("/dropdown/options")
    public Result<Map<String, List<DictDataVO>>> getDictData() {
        return Result.success(sysDictDataService.getAllDictData());
    }
}
