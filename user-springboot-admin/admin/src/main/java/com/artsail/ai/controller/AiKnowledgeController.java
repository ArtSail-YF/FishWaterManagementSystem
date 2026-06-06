package com.artsail.ai.controller;

import com.artsail.admin.model.domain.User;
import com.artsail.ai.service.AiKnowledgeService;
import com.artsail.ai.vo.AiKnowledgeDocumentVO;
import com.artsail.common.domain.Result;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static com.artsail.admin.contant.UserConstant.ADMIN_ROLE;
import static com.artsail.admin.contant.UserConstant.USER_LOGIN_STATE;

@RestController
@RequestMapping("/ai/knowledge")
public class AiKnowledgeController {
    private final AiKnowledgeService aiKnowledgeService;

    public AiKnowledgeController(AiKnowledgeService aiKnowledgeService) {
        this.aiKnowledgeService = aiKnowledgeService;
    }

    @GetMapping("/documents")
    public Result<List<AiKnowledgeDocumentVO>> list(HttpServletRequest request) {
        requireAdmin(request);
        return Result.success(aiKnowledgeService.listDocuments());
    }

    @PostMapping("/documents")
    public Result<AiKnowledgeDocumentVO> upload(@RequestParam String title,
                                                @RequestParam String category,
                                                @RequestParam MultipartFile file,
                                                HttpServletRequest request) throws IOException {
        User user = requireAdmin(request);
        return Result.success(aiKnowledgeService.importDocument(title, category, file, user.getId()));
    }

    @DeleteMapping("/documents/{id}")
    public Result<Boolean> delete(@PathVariable Long id, HttpServletRequest request) {
        requireAdmin(request);
        aiKnowledgeService.deleteDocument(id);
        return Result.success(true);
    }

    private User requireAdmin(HttpServletRequest request) {
        Object value = request.getSession().getAttribute(USER_LOGIN_STATE);
        if (!(value instanceof User user) || user.getUserRole() == null || user.getUserRole() != ADMIN_ROLE) {
            throw new IllegalArgumentException("仅管理员可以管理AI知识库");
        }
        return user;
    }
}
