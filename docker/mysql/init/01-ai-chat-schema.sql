-- AI intelligent Q&A schema
-- Safe to run repeatedly on an existing artsail_admin database.

USE `artsail_admin`;

CREATE TABLE IF NOT EXISTS `ai_chat_session` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Session ID',
  `session_no` varchar(64) NOT NULL COMMENT 'Public session number',
  `user_id` bigint NOT NULL COMMENT 'Session owner',
  `title` varchar(200) NOT NULL DEFAULT 'New conversation' COMMENT 'Session title',
  `model_name` varchar(100) DEFAULT NULL COMMENT 'Chat model used by the session',
  `system_prompt_version` varchar(50) DEFAULT NULL COMMENT 'System prompt version',
  `message_count` int NOT NULL DEFAULT 0 COMMENT 'Number of messages',
  `last_message_at` datetime DEFAULT NULL COMMENT 'Last message time',
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, ARCHIVED, DELETED',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ai_chat_session_no` (`session_no`),
  KEY `idx_ai_chat_session_user_status` (`user_id`, `status`),
  KEY `idx_ai_chat_session_last_message` (`last_message_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI chat sessions';

CREATE TABLE IF NOT EXISTS `ai_chat_message` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Message ID',
  `session_id` bigint NOT NULL COMMENT 'Chat session ID',
  `role` varchar(20) NOT NULL COMMENT 'SYSTEM, USER, ASSISTANT, TOOL',
  `content` longtext NOT NULL COMMENT 'Message content',
  `model_name` varchar(100) DEFAULT NULL COMMENT 'Model that generated the response',
  `prompt_tokens` int DEFAULT NULL COMMENT 'Prompt token count',
  `completion_tokens` int DEFAULT NULL COMMENT 'Completion token count',
  `sources_json` longtext COMMENT 'RAG source references in JSON',
  `tool_calls_json` longtext COMMENT 'AI business tool calls in JSON',
  `risk_level` varchar(20) NOT NULL DEFAULT 'NONE' COMMENT 'NONE, NOTICE, HIGH',
  `risk_notice` varchar(500) DEFAULT NULL COMMENT 'Medical or medication risk notice',
  `request_id` varchar(100) DEFAULT NULL COMMENT 'Provider request ID',
  `latency_ms` int DEFAULT NULL COMMENT 'Model response latency in milliseconds',
  `status` varchar(20) NOT NULL DEFAULT 'SUCCESS' COMMENT 'SUCCESS, FAILED, BLOCKED',
  `error_message` varchar(1000) DEFAULT NULL COMMENT 'Failure reason',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ai_chat_message_session_time` (`session_id`, `create_time`),
  KEY `idx_ai_chat_message_request` (`request_id`),
  CONSTRAINT `fk_ai_chat_message_session`
    FOREIGN KEY (`session_id`) REFERENCES `ai_chat_session` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI chat messages';

CREATE TABLE IF NOT EXISTS `ai_knowledge_document` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Knowledge document ID',
  `document_no` varchar(64) NOT NULL COMMENT 'Public document number',
  `title` varchar(255) NOT NULL COMMENT 'Document title',
  `category` varchar(50) NOT NULL COMMENT 'AQUACULTURE, DISEASE, POLICY, SYSTEM',
  `source_type` varchar(30) NOT NULL DEFAULT 'FILE' COMMENT 'FILE, URL, MANUAL',
  `source_url` varchar(1000) DEFAULT NULL COMMENT 'Original URL or file path',
  `file_name` varchar(255) DEFAULT NULL COMMENT 'Uploaded file name',
  `file_hash` varchar(64) DEFAULT NULL COMMENT 'SHA-256 used for duplicate detection',
  `content_type` varchar(100) DEFAULT NULL COMMENT 'MIME type',
  `chunk_count` int NOT NULL DEFAULT 0 COMMENT 'Number of generated chunks',
  `embedding_model` varchar(100) DEFAULT NULL COMMENT 'Embedding model name',
  `status` varchar(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, PROCESSING, READY, FAILED, DISABLED',
  `error_message` varchar(1000) DEFAULT NULL COMMENT 'Import failure reason',
  `uploaded_by` bigint DEFAULT NULL COMMENT 'Uploader user ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ai_knowledge_document_no` (`document_no`),
  UNIQUE KEY `uk_ai_knowledge_document_hash` (`file_hash`),
  KEY `idx_ai_knowledge_document_category_status` (`category`, `status`),
  KEY `idx_ai_knowledge_document_uploader` (`uploaded_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI knowledge documents';

CREATE TABLE IF NOT EXISTS `ai_knowledge_chunk` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Knowledge chunk ID',
  `document_id` bigint NOT NULL COMMENT 'Knowledge document ID',
  `chunk_index` int NOT NULL COMMENT 'Zero-based chunk index',
  `content` longtext NOT NULL COMMENT 'Chunk text',
  `metadata_json` longtext COMMENT 'Page, section and source metadata in JSON',
  `embedding_json` longtext COMMENT 'Embedding vector in JSON array format',
  `embedding_dimension` int DEFAULT NULL COMMENT 'Embedding vector dimension',
  `token_count` int DEFAULT NULL COMMENT 'Estimated chunk token count',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ai_knowledge_chunk_index` (`document_id`, `chunk_index`),
  KEY `idx_ai_knowledge_chunk_document` (`document_id`),
  CONSTRAINT `fk_ai_knowledge_chunk_document`
    FOREIGN KEY (`document_id`) REFERENCES `ai_knowledge_document` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI knowledge document chunks and embeddings';
