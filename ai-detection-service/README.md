# AI Detection Service

独立的 YOLOv8 水产病害检测服务。Spring Boot 后端通过 HTTP 上传图片，本服务返回中文检测结果和带框标注图。

## 启动

```powershell
cd ai-detection-service
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

默认监听 `http://127.0.0.1:9001`。

## 接口

```text
POST /detect
form-data:
  file: image
  conf: 0.35
```

返回内容只包含中文病害名；模型类别 `1` 和 `object` 会被过滤。

## 类别映射

| 模型类别 | 前端/结果展示 |
| --- | --- |
| Aeromoniasis | 嗜水气单胞菌病 |
| branchitis | 鳃炎 |
| healthy | 健康 |
| ichthyophthiriasis | 小瓜虫病 |
| keratitis | 角膜炎 |
| lymphocystis | 淋巴囊肿病 |
| saprolegniasis | 水霉病 |

`1`、`object` 属于无效类别，服务端会直接忽略，不会返回给前端，也不会绘制到结果图上。
