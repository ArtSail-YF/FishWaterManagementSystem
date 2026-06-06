package com.artsail.ai.controller;

import com.artsail.admin.model.domain.User;
import com.artsail.ai.dto.AiChatRequest;
import com.artsail.ai.service.AiChatService;
import com.artsail.ai.vo.AiChatMessageVO;
import com.artsail.ai.vo.AiChatReplyVO;
import com.artsail.ai.vo.AiChatSessionVO;
import com.artsail.common.domain.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.artsail.admin.contant.UserConstant.USER_LOGIN_STATE;

@RestController
@RequestMapping("/ai/chat")
public class AiChatController {
    private final AiChatService aiChatService;

    public AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/sessions")
    public Result<AiChatSessionVO> createSession(HttpServletRequest request) {
        return Result.success(aiChatService.createSession(currentUserId(request)));
    }

    @GetMapping("/sessions")
    public Result<List<AiChatSessionVO>> listSessions(HttpServletRequest request) {
        return Result.success(aiChatService.listSessions(currentUserId(request)));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public Result<List<AiChatMessageVO>> listMessages(@PathVariable Long sessionId, HttpServletRequest request) {
        return Result.success(aiChatService.listMessages(currentUserId(request), sessionId));
    }

    @PostMapping("/sessions/{sessionId}/messages")
    public Result<AiChatReplyVO> chat(@PathVariable Long sessionId,
                                      @Valid @RequestBody AiChatRequest body,
                                      HttpServletRequest request) {
        try {
            return Result.success(aiChatService.chat(
                    currentUserId(request), sessionId, body.getMessage(), body.getTool()));
        } catch (IllegalArgumentException e) {
            return Result.error(400, e.getMessage());
        } catch (Exception e) {
            return Result.error(500, e.getMessage());
        }
    }

    @DeleteMapping("/sessions/{sessionId}")
    public Result<Boolean> deleteSession(@PathVariable Long sessionId, HttpServletRequest request) {
        aiChatService.deleteSession(currentUserId(request), sessionId);
        return Result.success(true);
    }

    private Long currentUserId(HttpServletRequest request) {
        Object value = request.getSession().getAttribute(USER_LOGIN_STATE);
        if (!(value instanceof User user)) {
            throw new IllegalArgumentException("请先登录");
        }
        return user.getId();
    }
}
