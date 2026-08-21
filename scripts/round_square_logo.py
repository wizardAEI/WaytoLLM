"""将图片截成正方形并添加圆角。

用法:
    python3 scripts/round_square_logo.py <输入图片> <输出图片> [圆角半径] [边长]

示例:
    python3 scripts/round_square_logo.py assets/logo_hands_only.png public/logo.png 120 1024
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw


def crop_to_square(img: Image.Image) -> Image.Image:
    width, height = img.size
    side = min(width, height)
    left = (width - side) // 2
    top = (height - side) // 2
    return img.crop((left, top, left + side, top + side))


def add_rounded_corners(img: Image.Image, radius: int) -> Image.Image:
    img = img.convert("RGBA")
    size = img.size

    # 使用 4 倍超采样绘制蒙版，让圆角边缘更平滑
    scale = 4
    mask = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(
        (0, 0, mask.size[0] - 1, mask.size[1] - 1),
        radius=radius * scale,
        fill=255,
    )
    mask = mask.resize(size, Image.LANCZOS)

    # 注意：不要用 Image.paste(img, box, mask) 叠加到透明背景上。
    # paste 在半透明蒙版处会把 RGB 和全透明背景 (0,0,0,0) 做插值，
    # 由于背景是黑色，边缘的抗锯齿像素会被"拉黑"，导致圆角出现黑边。
    # 直接用 putalpha 只替换透明度通道，颜色保持不变，避免这个问题。
    result = img.copy()
    result.putalpha(mask)
    return result


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    radius = int(sys.argv[3]) if len(sys.argv) > 3 else 120
    target_size = int(sys.argv[4]) if len(sys.argv) > 4 else 1024

    img = Image.open(input_path)
    square = crop_to_square(img)
    square = square.resize((target_size, target_size), Image.LANCZOS)
    result = add_rounded_corners(square, radius)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    result.save(output_path)
    print(f"已保存: {output_path} ({result.size[0]}x{result.size[1]})")


if __name__ == "__main__":
    main()
