from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, math

OUT = r'C:\Users\13372\Desktop\mark\项目\水产管理\video_frames'
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1920
BLUE = (0, 82, 148)
DARK = (10, 25, 47)
WHITE = (255, 255, 255)
GOLD = (212, 175, 55)
LIGHT_BLUE = (220, 235, 255)
GRAY_LIGHT = (240, 242, 245)

def draw_gradient_bg(draw, color1, color2):
    for y in range(H):
        r = int(color1[0] + (color2[0] - color1[0]) * y / H)
        g = int(color1[1] + (color2[1] - color1[1]) * y / H)
        b = int(color1[2] + (color2[2] - color1[2]) * y / H)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

def get_fonts():
    try:
        ft_title = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 72)
        ft_sub = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 48)
        ft_body = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 36)
        ft_small = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 28)
        return ft_title, ft_sub, ft_body, ft_small
    except:
        d = ImageFont.load_default()
        return d, d, d, d

ft_title, ft_sub, ft_body, ft_small = get_fonts()

# --- Frame 1: Title ---
img = Image.new('RGB', (W, H), DARK)
draw = ImageDraw.Draw(img)
draw_gradient_bg(draw, (10, 25, 47), (0, 82, 148))

for y in range(300, 450):
    for x in range(0, W, 3):
        if abs(y - (380 + 30 * math.sin(x * 0.02))) < 4:
            draw.point((x, y), fill=(255, 255, 255, 40))

draw.text((W//2, 500), '厦门现代渔业', fill=GOLD, font=ft_title, anchor='mt')
draw.text((W//2, 600), '水产管理操作系统', fill=WHITE, font=ft_title, anchor='mt')
draw.text((W//2, 750), '合规  协同  智慧', fill=LIGHT_BLUE, font=ft_sub, anchor='mt')
draw.text((W//2, 900), '面向陆基工厂化企业  台资合作企业  深远海项目方',
          fill=(180, 200, 220), font=ft_body, anchor='mt')
draw.rectangle([(0, H-130), (W, H-80)], fill=(0, 50, 100))
draw.text((W//2, H-105), '助力厦门打造可持续海洋经济标杆城市', fill=GOLD, font=ft_body, anchor='mt')
img.save(os.path.join(OUT, 'frame_001_title.png'))
print('Frame 1 done')

# --- Frame 2: Core Positioning ---
img2 = Image.new('RGB', (W, H), WHITE)
draw2 = ImageDraw.Draw(img2)
draw2.rectangle([(0, 0), (W, 160)], fill=DARK)
draw2.text((W//2, 80), '核心定位', fill=GOLD, font=ft_title, anchor='mt')

items = [
    ('合规是底线', '合规格证  生态红线预警  药残标准库'),
    ('两岸是特色', '台企快速通道  两岸专家问诊  对台市场'),
    ('陆基是主场', '车间级精管  循环水监控  批次追溯'),
    ('数据是资产', 'AI经营诊断  碳足迹核算  可视化大屏'),
]
for i, (title, desc) in enumerate(items):
    y_pos = 260 + i * 380
    draw2.rounded_rectangle([(80, y_pos), (1000, y_pos+280)], radius=20,
                            fill=GRAY_LIGHT, outline=BLUE, width=3)
    draw2.text((540, y_pos+60), title, fill=BLUE, font=ft_title, anchor='mt')
    draw2.text((540, y_pos+160), desc, fill=(80, 80, 100), font=ft_body, anchor='mt')
img2.save(os.path.join(OUT, 'frame_002_positioning.png'))
print('Frame 2 done')

# --- Frame 3: Three Core Users ---
img3 = Image.new('RGB', (W, H), DARK)
draw3 = ImageDraw.Draw(img3)
draw_gradient_bg(draw3, DARK, (0, 50, 100))
draw3.text((W//2, 120), '三大核心用户', fill=GOLD, font=ft_title, anchor='mt')

users = [
    ('陆基工厂化企业',
     '精准控制成本\n保障苗种品质\n满足出口标准\n全流程可追溯'),
    ('台资合作企业',
     '快速落地厦门\n种苗引进便利\n两岸标准互认\n政策红利扶持'),
    ('深远海项目方',
     '装备安全监控\n作业窗口预测\n设备数字孪生\n补贴申报对接'),
]
for i, (name, desc) in enumerate(users):
    y_pos = 280 + i * 530
    draw3.rounded_rectangle([(80, y_pos), (1000, y_pos+440)], radius=24,
                            fill=(255, 255, 255, 20), outline=GOLD, width=2)
    draw3.text((540, y_pos+50), name, fill=GOLD, font=ft_sub, anchor='mt')
    for j, line in enumerate(desc.split('\n')):
        draw3.text((540, y_pos+140+j*65), line, fill=LIGHT_BLUE,
                   font=ft_body, anchor='mt')
img3.save(os.path.join(OUT, 'frame_003_users.png'))
print('Frame 3 done')

# --- Frame 4: Capabilities ---
img4 = Image.new('RGB', (W, H), WHITE)
draw4 = ImageDraw.Draw(img4)
draw_gradient_bg(draw4, (240, 245, 255), WHITE)
draw4.text((W//2, 100), '系统核心能力', fill=BLUE, font=ft_title, anchor='mt')

caps = [
    ('合规与风控', '休药期智能锁\n电子合格证\n生态红线预警'),
    ('陆基工厂化', '循环水监控\n批次管理追溯\n成本精确核算'),
    ('两岸协同平台', '台企快速通道\n种苗引进对接\n专家视频问诊'),
    ('可持续发展', '生态健康指数\n碳足迹核算\n可视化大屏'),
    ('AI智能辅助', '语音代录日志\n拍照识病诊断\n行情智能推送'),
]
for i, (title, desc) in enumerate(caps):
    row = i // 2
    col = i % 2
    y_pos = 220 + row * 400
    x_pos = 60 + col * 510
    draw4.rounded_rectangle([(x_pos, y_pos), (x_pos+480, y_pos+300)],
                            radius=16, fill=WHITE, outline=BLUE, width=2)
    draw4.text((x_pos+240, y_pos+60), title, fill=DARK, font=ft_sub, anchor='mt')
    for j, line in enumerate(desc.split('\n')):
        draw4.text((x_pos+240, y_pos+140+j*50), line,
                   fill=(100, 100, 120), font=ft_body, anchor='mt')

# Centered last item
draw4.rounded_rectangle([(290, 1020), (790, 1320)], radius=16,
                        fill=WHITE, outline=GOLD, width=2)
draw4.text((540, 1080), 'AI智能辅助', fill=DARK, font=ft_sub, anchor='mt')
for j, line in enumerate('语音代录日志  拍照识病诊断  行情智能推送'.split('  ')):
    draw4.text((540, 1180+j*50), line, fill=(100, 100, 120), font=ft_body, anchor='mt')
img4.save(os.path.join(OUT, 'frame_004_capabilities.png'))
print('Frame 4 done')

# --- Frame 5: Closing ---
img5 = Image.new('RGB', (W, H), DARK)
draw5 = ImageDraw.Draw(img5)
draw_gradient_bg(draw5, DARK, (0, 40, 80))
draw5.text((W//2, 350), '让合规创造价值', fill=GOLD, font=ft_title, anchor='mt')
draw5.text((W//2, 500), '合规数据 = 品牌溢价 + 保险资格', fill=LIGHT_BLUE, font=ft_sub, anchor='mt')
draw5.text((W//2, 620), '违规操作 = 合格证锁定 + 鱼中拒收', fill=(200, 120, 120), font=ft_sub, anchor='mt')

draw5.text((W//2, 1000), '从通用养殖管理', fill=WHITE, font=ft_sub, anchor='mt')
draw5.text((W//2, 1080), '到厦门现代渔业专属操作系统', fill=WHITE, font=ft_sub, anchor='mt')
draw5.text((W//2, 1250), 'www.shuichan.com', fill=GOLD, font=ft_sub, anchor='mt')
draw5.text((W//2, 1500), '2026', fill=(150, 180, 210), font=ft_body, anchor='mt')
draw5.rectangle([(0, H-100), (W, H-60)], fill=(0, 50, 100))
draw5.text((W//2, H-80), '面向厦门现代渔业的数字化操作系统', fill=GOLD, font=ft_body, anchor='mt')
img5.save(os.path.join(OUT, 'frame_005_closing.png'))
print('Frame 5 done')

print('All frames generated successfully!')
