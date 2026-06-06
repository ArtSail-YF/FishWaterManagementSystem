import base64
import io
from pathlib import Path
from typing import Any, Union

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageDraw, ImageFont
from ultralytics import YOLO


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "best.pt"
IGNORED_LABELS = {"1", "object"}

LABEL_NAME_MAP = {
    "Aeromoniasis": "嗜水气单胞菌病",
    "branchitis": "鳃炎",
    "healthy": "健康",
    "ichthyophthiriasis": "小瓜虫病",
    "keratitis": "角膜炎",
    "lymphocystis": "淋巴囊肿病",
    "saprolegniasis": "水霉病",
}

SUGGESTION_MAP = {
    "嗜水气单胞菌病": "建议隔离异常个体，检查水体氨氮与亚硝酸盐，减少应激并联系技术员评估是否需要抗菌处理。",
    "鳃炎": "建议提升换水和增氧频率，检查鳃部附着物与水体悬浮物，必要时进行病原复检。",
    "健康": "未发现明显病害特征，建议继续保持常规巡检和水质记录。",
    "小瓜虫病": "建议升温或分池观察，降低养殖密度，并按本地水产用药规范处理寄生虫风险。",
    "角膜炎": "建议检查机械损伤、氨氮刺激和细菌感染风险，保持水体清洁并减少捕捞应激。",
    "淋巴囊肿病": "建议隔离疑似个体，降低密度，改善水质并加强器具消毒。",
    "水霉病": "建议移除受伤或死亡个体，减少机械损伤，保持水体清洁并按规范进行真菌风险处理。",
}


app = FastAPI(title="Fish Disease Detection Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO(str(MODEL_PATH))


def load_font(size: int) -> Union[ImageFont.FreeTypeFont, ImageFont.ImageFont]:
    candidates = [
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "C:/Windows/Fonts/simsun.ttc",
    ]
    for font_path in candidates:
        if Path(font_path).exists():
            return ImageFont.truetype(font_path, size=size)
    return ImageFont.load_default()


def to_chinese_label(raw_label: str) -> str:
    if raw_label in LABEL_NAME_MAP:
        return LABEL_NAME_MAP[raw_label]
    if any("\u4e00" <= char <= "\u9fff" for char in raw_label):
        return raw_label
    return f"未配置类别{raw_label}"


def draw_result(image: Image.Image, detections: list[dict[str, Any]]) -> Image.Image:
    canvas = image.convert("RGB")
    draw = ImageDraw.Draw(canvas)
    font = load_font(20)

    for item in detections:
        x1, y1, x2, y2 = item["bbox"]
        label = f"{item['label']} {item['confidencePercent']}"
        color = (16, 142, 233)
        if item["label"] == "健康":
            color = (41, 157, 91)
        elif item["riskLevel"] == "高":
            color = (217, 48, 37)
        elif item["riskLevel"] == "中":
            color = (214, 127, 0)

        draw.rectangle([x1, y1, x2, y2], outline=color, width=4)
        text_box = draw.textbbox((0, 0), label, font=font)
        text_width = text_box[2] - text_box[0]
        text_height = text_box[3] - text_box[1]
        label_y = max(0, y1 - text_height - 10)
        draw.rectangle([x1, label_y, x1 + text_width + 12, label_y + text_height + 8], fill=color)
        draw.text((x1 + 6, label_y + 3), label, fill=(255, 255, 255), font=font)

    return canvas


def risk_level(label: str, confidence: float) -> str:
    if label == "健康":
        return "低"
    if confidence >= 0.75:
        return "高"
    if confidence >= 0.45:
        return "中"
    return "低"


@app.get("/health")
def health() -> dict[str, Any]:
    names = {idx: name for idx, name in model.names.items() if name not in IGNORED_LABELS}
    return {
        "status": "ok",
        "model": MODEL_PATH.name,
        "classes": {idx: to_chinese_label(name) for idx, name in names.items()},
    }


@app.post("/detect")
async def detect(file: UploadFile = File(...), conf: float = Form(0.35)) -> dict[str, Any]:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="请上传图片文件")

    image_bytes = await file.read()
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="图片读取失败") from exc

    results = model.predict(image, conf=conf, verbose=False)
    result = results[0]

    detections: list[dict[str, Any]] = []
    for box in result.boxes:
        cls_id = int(box.cls[0])
        raw_label = result.names[cls_id]
        if raw_label in IGNORED_LABELS:
            continue

        confidence = float(box.conf[0])
        label = to_chinese_label(raw_label)
        x1, y1, x2, y2 = [round(float(v), 2) for v in box.xyxy[0]]
        level = risk_level(label, confidence)
        detections.append(
            {
                "label": label,
                "confidence": round(confidence, 4),
                "confidencePercent": f"{confidence * 100:.1f}%",
                "bbox": [x1, y1, x2, y2],
                "riskLevel": level,
                "suggestion": SUGGESTION_MAP.get(label, "建议结合现场症状、水质数据和专家复核后再处置。"),
            }
        )

    detections.sort(key=lambda item: item["confidence"], reverse=True)
    annotated_image = draw_result(image, detections)
    buffer = io.BytesIO()
    annotated_image.save(buffer, format="JPEG", quality=92)
    annotated_base64 = base64.b64encode(buffer.getvalue()).decode("ascii")

    top = detections[0] if detections else None
    return {
        "detected": bool(detections),
        "topLabel": top["label"] if top else "未检出病害",
        "topConfidence": top["confidence"] if top else 0,
        "topConfidencePercent": top["confidencePercent"] if top else "0.0%",
        "riskLevel": top["riskLevel"] if top else "低",
        "suggestion": top["suggestion"] if top else "未发现可识别病害目标，建议补充清晰近景照片后复检。",
        "detections": detections,
        "annotatedImageBase64": annotated_base64,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="127.0.0.1", port=9001, reload=False)
