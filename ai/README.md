# AI 模块

当前包含：

- `disease-detection-service`：YOLO 鱼病图片识别服务。
- 智能问答：Spring Boot 内 `com.artsail.ai` 的 LangChain4j + DeepSeek 对话服务。
- 业务数据工具：问答前按需查询系统实时数据，再由模型整理回答。

## DeepSeek 配置

复制 `.env.example` 为 `.env`，填写 `DEEPSEEK_API_KEY`。`.env` 已被 Git 忽略。

## 智能问答接口

- `POST /ai/chat/sessions`
- `GET /ai/chat/sessions`
- `GET /ai/chat/sessions/{id}/messages`
- `POST /ai/chat/sessions/{id}/messages`
- `DELETE /ai/chat/sessions/{id}`

仅管理员可用的知识库接口：

- `POST /ai/knowledge/documents` (`title`, `category`, `file`)
- `GET /ai/knowledge/documents`
- `DELETE /ai/knowledge/documents/{id}`

知识库当前支持 UTF-8 编码的 `.txt` 和 `.md` 文件。

## 智能问答可用工具

当前只开放查询，不执行新增、修改、删除、发布、开始、完成等生产操作。
聊天输入框输入 `/` 可打开查询功能菜单，支持继续输入关键词筛选，以及方向键和 Enter 选择。

| 工具 | 数据范围 | 示例问法 |
| --- | --- | --- |
| 塘口查询 | 塘口基础信息、品种、状态、预计产量 | `有哪些塘口正在养殖？` |
| 生产计划查询 | 投喂、用药、收获等计划和状态 | `3号塘有哪些生产计划？` |
| 生产任务查询 | 今日/昨日任务、状态、执行人 | `今天的生产情况怎么样？` |
| 投喂记录查询 | 投喂量、饲料、时间和核验状态 | `3号塘今天投喂多少？` |
| 用药记录查询 | 药品、剂量、休药期和核验状态 | `3号塘最近用过什么药？` |
| 收获记录查询 | 品种、重量、时间和状态 | `最近有哪些收获记录？` |
| 投入品使用查询 | 物资数量、成本和使用时间 | `3号塘用了哪些投入品？` |
| 实时水质查询 | 各塘口溶氧、水温、pH | `现在各塘口水质怎么样？` |
| 水质趋势查询 | 指定塘口最近 24 小时趋势 | `查看塘口ID 3的水质趋势` |
| IoT 告警查询 | 未处理告警和告警统计 | `最近有什么设备告警？` |

当前数据库缺少 `feeding_record`、`medication_record`、`harvest_record` 三张新生产记录表，
对应工具会明确返回查询失败。补表属于生产模块数据库变更，需要与该模块负责人确认后再处理。
