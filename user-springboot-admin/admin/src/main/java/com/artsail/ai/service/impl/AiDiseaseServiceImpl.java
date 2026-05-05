package com.artsail.ai.service.impl;

import com.artsail.ai.dto.AiDiseaseDetectResponse;
import com.artsail.ai.service.AiDiseaseService;
import com.artsail.ai.vo.AiDiseaseDetectVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Objects;
import java.util.UUID;

@Service
public class AiDiseaseServiceImpl implements AiDiseaseService {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.BASIC_ISO_DATE;

    @Value("${ai.detection.url:http://127.0.0.1:9001/detect}")
    private String detectionUrl;

    @Value("${ai.upload-dir:uploads/ai}")
    private String uploadDir;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public AiDiseaseDetectVO detect(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("请上传图片");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("请上传图片文件");
        }

        String recordNo = "AI-DIS-" + LocalDate.now().format(DATE_FORMATTER) + "-" + UUID.randomUUID().toString().substring(0, 8);
        String extension = getExtension(file.getOriginalFilename());
        Path originalDir = Path.of(uploadDir, "original");
        Path resultDir = Path.of(uploadDir, "result");
        Files.createDirectories(originalDir);
        Files.createDirectories(resultDir);

        String originalName = recordNo + extension;
        String resultName = recordNo + ".jpg";
        Path originalPath = originalDir.resolve(originalName);
        Path resultPath = resultDir.resolve(resultName);
        Files.write(originalPath, file.getBytes());

        AiDiseaseDetectResponse aiResponse = requestDetection(file, originalName);
        if (aiResponse == null) {
            throw new IllegalStateException("AI检测服务没有返回结果");
        }

        String annotatedImageBase64 = aiResponse.getAnnotatedImageBase64();
        if (annotatedImageBase64 != null && !annotatedImageBase64.isBlank()) {
            Files.write(resultPath, Base64.getDecoder().decode(annotatedImageBase64));
        }

        AiDiseaseDetectVO vo = new AiDiseaseDetectVO();
        vo.setRecordNo(recordNo);
        vo.setOriginalImageUrl(toUrl(originalPath));
        vo.setAnnotatedImageUrl(toUrl(resultPath));
        vo.setDetected(Boolean.TRUE.equals(aiResponse.getDetected()));
        vo.setTopDisease(aiResponse.getTopLabel());
        vo.setConfidence(aiResponse.getTopConfidence());
        vo.setConfidencePercent(aiResponse.getTopConfidencePercent());
        vo.setRiskLevel(aiResponse.getRiskLevel());
        vo.setSuggestion(aiResponse.getSuggestion());
        vo.setDetections(aiResponse.getDetections());
        return vo;
    }

    private AiDiseaseDetectResponse requestDetection(MultipartFile file, String filename) throws IOException {
        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return filename;
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", resource);
        body.add("conf", "0.35");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
        return restTemplate.postForObject(detectionUrl, request, AiDiseaseDetectResponse.class);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }
        String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        if (Objects.equals(extension, ".png") || Objects.equals(extension, ".jpeg") || Objects.equals(extension, ".jpg") || Objects.equals(extension, ".webp")) {
            return extension;
        }
        return ".jpg";
    }

    private String toUrl(Path path) {
        return "/" + path.toString().replace("\\", "/");
    }
}
