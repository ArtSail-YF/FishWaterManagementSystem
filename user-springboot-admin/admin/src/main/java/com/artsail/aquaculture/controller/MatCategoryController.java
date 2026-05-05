package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.controller.base.BaseAquacultureController;
import com.artsail.aquaculture.model.domain.MatCategory;
import com.artsail.aquaculture.model.domain.Query.MatCategoryQuery;
import com.artsail.aquaculture.service.MatCategoryService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/material/category")
@RequiredArgsConstructor
public class MatCategoryController extends BaseAquacultureController<MatCategoryService, MatCategory, MatCategory, MatCategoryQuery> {

    private final MatCategoryService matCategoryService;

    @Override
    public Result<Page<MatCategory>> search(Page<MatCategory> page, MatCategoryQuery query) {
        return Result.success(matCategoryService.search(page, query));
    }
}
