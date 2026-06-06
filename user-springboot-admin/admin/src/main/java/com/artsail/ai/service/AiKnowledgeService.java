package com.artsail.ai.service;

import com.artsail.ai.vo.AiKnowledgeDocumentVO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AiKnowledgeService {
    AiKnowledgeDocumentVO importDocument(String title, String category, MultipartFile file, Long userId)
            throws IOException;

    List<AiKnowledgeDocumentVO> listDocuments();

    void deleteDocument(Long id);
}
