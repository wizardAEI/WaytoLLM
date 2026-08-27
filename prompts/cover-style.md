# Cover Style Prompt

后续章节封面共用这一份视觉语言。生成时拆成两段：

- **Style Prompt**：原样粘贴，不要改。
- **Content Prompt**：只换画面叙事，不要改印刷语言。

参考图：`public/banner.png`

---

## Style Prompt

```
Bauhaus and Russian Constructivism mixed-media collage, vintage risograph / letterpress print on textured cream off-white paper.

Palette locked: muted cream paper, solid black, vibrant vermillion red, deep royal blue. Human figures rendered as clean classical contour drawings or very fine copperplate line-work — sparse outlines, almost no shading. Never dense stipple, never heavy cross-hatching, never photographic, never full color. Too much grain on skin looks dirty; keep figures calm and readable.

Graphic language: bold flat geometric rectangles and squares in red, blue, and black, placed at mixed angles (vertical, horizontal, diagonal), layered both in front of and behind the main subject. Thin sharp intersecting black construction lines. A few faint loose blue scribble lines. Halftone dot fields of varying density — some large technical grids, some fine stipple. Slight two-color misregistration. Visible paper grain.

Mood: intellectual manifesto poster, dynamic tension between engraved bodies and rigid geometry. Editorial, layered, print-shop, not digital UI.

Hard negatives: no photorealism, no neon glow, no purple, no circuit boards, no neural-net clipart, no node-link graphs, no robots, no screens, no logos, no poster titles. Default: no typography. Add a small graphic fragment of type only when the Content Prompt explicitly asks for it.
```

---

## 使用方式

1. 把上面的 Style Prompt 整段放入生成器。
2. 附上 `public/banner.png` 作为 style reference。
3. 再追加当次的 Content Prompt（构图、隐喻、必要的小字）。
4. 默认比例：章节封面用 `16:9`；若要更接近海报拼贴，可改 `4:3`。

---

## Content Prompt · Transformer 的历史

文件：`public/covers/attention-history-cover.png`  
比例：16:9

```
Sparse 16:9 editorial cover. One gesture only.

A single close-up of a clean classical contour hand, cropped large in the left-center, holding a folded sealed letter and passing it forward. Sparse outlines only — no stipple, no heavy hatching, no dirty skin texture. No face, no body, no second hand, no other people.

Most of the frame is empty cream paper. An irregular torn vermillion stain / printed blot sits on the envelope like light catching the letter — crooked, incomplete, not a straight bar, not a perfect rectangle. Wrist and forearm stay untouched on the left, with a royal-blue square behind the arm and a small black rectangle at upper left. Sparse thin black construction lines, one small halftone field, faint blue scribbles, paper grain.

No text, no numbers, no year. No neural network, no nodes, no graph, no connected dots.
```

---

## Content Prompt · Transformer 的核心：注意力机制

文件：`public/covers/attention-cover.png`  
比例：16:9

```
Sparse 16:9 editorial cover. One gesture only: looking.

A single close-up of a clean classical contour human eye and the surrounding orbital fragment, cropped large in the left-center, gazing toward the middle of the frame. Sparse elegant outlines only — almost no shading, no iris glow, no stipple, no heavy hatching, no dirty skin texture. No full face, no second eye, no body, no hands, no other people.

In the center, a small white letterpress type-block or folded card sits in the path of the gaze. An irregular torn vermillion stain / printed blot sits on that card like light catching the selected token — crooked, incomplete, not a straight bar, not a perfect rectangle. The eye and surrounding skin stay untouched on the left, with a royal-blue square behind the eye and a small black rectangle at upper left. Sparse thin black construction lines, one small halftone field, faint blue scribbles, paper grain. Most of the right side is empty cream paper.

No connecting web of lines from the eye to multiple objects. No second token. No text, no numbers, no year. No neural network, no nodes, no graph, no connected dots, no all-seeing-eye occult symbolism.
```
