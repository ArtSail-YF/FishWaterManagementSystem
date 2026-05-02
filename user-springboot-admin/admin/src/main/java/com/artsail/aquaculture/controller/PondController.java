package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.Pond;
import com.artsail.aquaculture.model.domain.Query.PondQuery;
import com.artsail.aquaculture.service.PondService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/pond")
@RequiredArgsConstructor
@Validated
public class PondController {


}