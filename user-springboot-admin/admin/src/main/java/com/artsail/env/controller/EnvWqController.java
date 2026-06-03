package com.artsail.env.controller;

import com.artsail.env.model.domain.EnvWq;
import com.artsail.env.model.vo.EnvWqDictVO;
import com.artsail.env.service.EnvWqService;
import com.artsail.common.domain.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 塘口水质快照接口（数据源：env_wq 表）
 */
@RestController
@RequestMapping("/env/wq")
public class EnvWqController {

    @Autowired
    private EnvWqService envWqService;

    @GetMapping("/list")
    public Result<List<EnvWq>> list() {
        return Result.success(envWqService.getAllWithNames());
    }

    @GetMapping("/dict")
    public Result<EnvWqDictVO> dict() {
        return Result.success(envWqService.getDict());
    }
}
