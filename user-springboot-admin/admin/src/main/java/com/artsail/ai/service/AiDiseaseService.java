package com.artsail.ai.service;

import com.artsail.ai.vo.AiDiseaseDetectVO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AiDiseaseService {
    AiDiseaseDetectVO detect(MultipartFile file) throws IOException;
}
