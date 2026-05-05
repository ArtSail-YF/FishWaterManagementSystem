package com.artsail.ai.controller;

import com.artsail.ai.service.AiDiseaseService;
import com.artsail.ai.vo.AiDiseaseDetectVO;
import com.artsail.common.domain.Result;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/ai/disease")
public class AiDiseaseController {
    private final AiDiseaseService aiDiseaseService;

    public AiDiseaseController(AiDiseaseService aiDiseaseService) {
        this.aiDiseaseService = aiDiseaseService;
    }

    @PostMapping("/detect")
    public Result<AiDiseaseDetectVO> detect(@RequestParam("file") MultipartFile file) {
        try {
            return Result.success(aiDiseaseService.detect(file));
        } catch (IllegalArgumentException e) {
            return Result.error(400, e.getMessage());
        } catch (Exception e) {
            return Result.error(500, "AI检测失败：" + e.getMessage());
        }
    }
}
