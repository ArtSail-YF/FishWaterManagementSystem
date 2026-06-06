SET @tool_calls_column_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'ai_chat_message'
    AND COLUMN_NAME = 'tool_calls_json'
);

SET @tool_calls_ddl = IF(
  @tool_calls_column_exists = 0,
  'ALTER TABLE `ai_chat_message` ADD COLUMN `tool_calls_json` longtext NULL COMMENT ''AI business tool calls in JSON'' AFTER `sources_json`',
  'SELECT 1'
);

PREPARE tool_calls_stmt FROM @tool_calls_ddl;
EXECUTE tool_calls_stmt;
DEALLOCATE PREPARE tool_calls_stmt;
