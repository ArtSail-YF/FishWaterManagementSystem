#!/usr/bin/env python3
"""Generate a 10-second animated GIF from the 5 slides."""

from PIL import Image
import os

FRAMES_DIR = r'C:\Users\13372\Desktop\mark\项目\水产管理\video_frames'
OUTPUT = r'C:\Users\13372\Desktop\mark\项目\水产管理\project_intro.gif'

slides = [
    'frame_001_title.png',
    'frame_002_positioning.png',
    'frame_003_users.png',
    'frame_004_capabilities.png',
    'frame_005_closing.png',
]

# 10 seconds / 5 slides = 2 seconds per slide = ~50 frames per slide at 25fps
FPS = 25
SECONDS_PER_SLIDE = 2
FRAMES_PER_SLIDE = FPS * SECONDS_PER_SLIDE  # 50

images = []
for slide_name in slides:
    path = os.path.join(FRAMES_DIR, slide_name)
    img = Image.open(path).convert('P', palette=Image.Palette.ADAPTIVE, colors=256)
    # Add each frame FRAMES_PER_SLIDE times
    for _ in range(FRAMES_PER_SLIDE):
        images.append(img.copy())

# Duration per frame = 1000 / FPS ms
duration_ms = int(1000 / FPS)

images[0].save(
    OUTPUT,
    save_all=True,
    append_images=images[1:],
    duration=duration_ms,
    loop=0,
    optimize=True,
)

print(f'GIF saved to: {OUTPUT}')
print(f'Total frames: {len(images)}')
print(f'Duration: {len(images) / FPS:.1f}s')
