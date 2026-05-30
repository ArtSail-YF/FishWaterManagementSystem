package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.BizBreeder;
import com.artsail.aquaculture.model.domain.Query.BreederQuery;
import com.artsail.aquaculture.model.domain.VO.BizBreederVO;
import com.artsail.aquaculture.service.BizBreederService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 养殖户/主体管理控制器
 */
@RestController
@RequestMapping("/breeder")
public class BizBreederController extends BaseController<BizBreederService, BizBreeder, BizBreederVO, BreederQuery> {

    @Autowired
    private BizBreederService bizBreederService;

    @Override
    public Result<Page<BizBreederVO>> search(Page<BizBreederVO> page, BreederQuery query) {
        return Result.success(bizBreederService.search(page, query));
    }

    /**
     * 根据基地ID获取员工列表（供发布弹窗等下拉选择）
     */
    @GetMapping("/by-base/{baseId}")
    public Result<List<Map<String, Object>>> getByBaseId(@PathVariable Long baseId) {
        List<BizBreeder> list = bizBreederService.lambdaQuery()
                .eq(BizBreeder::getBaseId, baseId)
                .eq(BizBreeder::getIsDelete, 0)
                .eq(BizBreeder::getStatus, 1)
                .list();
        List<Map<String, Object>> result = list.stream().map(b -> {
            Map<String, Object> m = new java.util.HashMap<>();
            m.put("id", b.getId());
            m.put("name", b.getBreederName());
            m.put("phone", b.getPhone());
            m.put("position", b.getPosition());
            return m;
        }).collect(Collectors.toList());
        return Result.success(result);
    }

    /**
     * 保存养殖户的塘口关联
     */
    @PostMapping("/{id}/ponds")
    public Result<Void> savePonds(@PathVariable Long id, @RequestBody Map<String, List<Long>> body) {
        bizBreederService.savePonds(id, body.get("pondIds"));
        return Result.success(null);
    }
}
