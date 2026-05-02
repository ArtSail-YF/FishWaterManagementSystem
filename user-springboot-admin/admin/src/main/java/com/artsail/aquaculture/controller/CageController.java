package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.Cage;
import com.artsail.aquaculture.model.domain.Query.CageQuery;
import com.artsail.aquaculture.service.CageService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cage")
@RequiredArgsConstructor
@Validated
public class CageController {


}
