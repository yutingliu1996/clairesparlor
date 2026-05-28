# DESIGN.md — 设计规范

> Claire's Parlor 的 Design System。给设计师、前端、AI agent 共用的颜色 / 字体 / 间距 / 动效 / 暗色 / 响应式参考。
>
> 行为守则 + 红线见 [`AGENTS.md`](./AGENTS.md)。这一份只讲"长什么样"，不讲"怎么协作"。

---

## 1. 设计哲学

苹果极简 × [thiings.co](https://www.thiings.co/things)。

- **大留白**。每屏只放一个主角。
- **同一字体族**。强调靠重量 + page accent 渐变流光，不切 serif。
- **单色 ink + 一个 page-accent**。多色出现的位置 = bug。
- **3D-ish 物件浮在白卡上**。

气质：「过程比成品诚实」。占位卡 / TBA / 空墙是有意为之。

---

## 2. 色彩系统

### 2.1 中性 ink 阶梯

| Token | 值 | 用法 |
|---|---|---|
| `paper` | `#FAFAFA` | 页面底色 |
| `surface` | `#FFFFFF` | 卡片 / 浮层底色 |
| `ink` (DEFAULT) | `#0A0A0A` | 正文 / hero |
| `ink-2` | `#3D3D3D` | 副文字 / lede |
| `ink-3` | `#737373` | 三级文字 / 元数据 |
| `ink-4` | `#A3A3A3` | 占位 / 箭头 |
| `ink-5` | `#D4D4D4` | 极弱辅助 |
| `hairline` | `rgba(0,0,0,0.08)` | 描边 / 分隔 |

### 2.2 Page Halo · 6 个主题

每条路由对应一个 halo theme。主题驱动整页的 nav 胶囊 / hero 光晕 / accent 字 / 副标题 / live dot。

| Theme | 视觉色调 | text (light) | text (dark) | dot | pill bg |
|---|---|---|---|---|---|
| `mint` | 暖橙红 | `#C24A1E` | `#FFC4A8` | `#FF5733` | `#FFE0DC` |
| `peach` | sunshine 黄 | `#B57F0E` | `#FFE891` | `#FFC42E` | `#FFF4B8` |
| `sky` | baby blue | `#1F6FCA` | `#C5E4F8` | `#5AB0F0` | `#D5EAFC` |
| `sage` | 老友记紫 | `#4A2DB5` | `#C9B8FF` | `#9676FF` | `#E8DFFC` |
| `leaf` | jade 嫩绿 | `#0F6B47` | `#A8E8C8` | `#34C77A` | `#DFF1E6` |
| `cream` | 鹅黄 | `#6F540C` | `#FFE891` | `#FFCC2E` | `#FFEDA0` |

注意：theme 名字是历史标签，色调以视觉色为准（例如 `mint` 现在是橙红、`peach` 是黄、`sage` 是紫）。改色调直接编辑 `THEMES`，不要改名字。

### 2.3 Path → Halo 映射

| 路径 | Halo | 视觉 |
|---|---|---|
| `/` `/bar` | `mint` | 橙红 |
| `/parlor` `/studio/l3` `/studio/aside` | `peach` | 黄 |
| `/studio` `/studio/bookshelf` `/studio/tunes` `/studio/l1` `/studio/l6` | `sky` | 蓝 |
| `/studio/ip` `/studio/l4` `/cooperate` | `cream` | 鹅黄 |
| `/workshop` `/studio/l2` `/studio/l5` | `sage` | 紫 |
| `/manifesto` | `leaf` | 嫩绿 |

要新增/调路由：编辑 [`components/main-theme.tsx`](./components/main-theme.tsx) 里的 `pathToHalo` 函数。

### 2.4 CSS 变量 · Single Source of Truth

`<MainTheme>` 把 halo 注入成 7 个 CSS 变量，整页向下级联。**所有 page-themed 颜色都读这些变量，不要硬编码 RGB**。

```
--accent-text          light bg 上的强调字
--accent-stroke        halo 渐变边缘色（历史命名）
--accent-stroke-mid    hero 光晕核心色
--accent-text-dark     dark bg 上的强调字
--accent-stroke-dark   dark bg 上的 halo 辅助色
--accent-pill          nav active 胶囊 bg
--accent-dot           brand logo 角的呼吸点 / live indicator
```

**用 `color-mix` 调透明度**（避免 RGB lookup map）：

```css
background: radial-gradient(closest-side,
  color-mix(in srgb, var(--accent-stroke-mid) 85%, transparent) 0%,
  color-mix(in srgb, var(--accent-stroke-mid) 28%, transparent) 45%,
  transparent 85%);
```

参考实现：[`components/page-header.tsx`](./components/page-header.tsx) 的 hero 光晕、[`app/page.tsx`](./app/page.tsx) 首页光晕。

---

## 3. 字体系统

### 3.1 字体族

| Token | Stack | 用在哪 |
|---|---|---|
| `font-sans` | `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue"` | **默认**。所有正文 / 标题 / 按钮 |
| `font-rounded` | `ui-rounded, "SF Pro Rounded", -apple-system, "PingFang SC"` | brand mark / colophon / 极少数装饰 |
| `font-serif` | New York / Times / Songti SC | 极极极少。基本不用 |
| `font-mono` | SF Mono / Menlo / Consolas | 代码 / `.eyebrow` / 等距数字 |

**红线**：hero 标题 / 副标题 / accent 强调字 **不切 family**。要让某个词「跳出来」用重量 + 同主题渐变，不是换字体。

### 3.2 字号阶梯（clamp 响应式）

| Token | clamp | 用在 |
|---|---|---|
| `text-display-xl` | `clamp(3.5rem, 8vw, 6rem)` | 首页 hero「一个空间。四个房间。」 |
| `text-display-lg` | `clamp(2.75rem, 6vw, 4.25rem)` | PageHeader hero 标题 |
| `text-display-md` | `clamp(2rem, 4vw, 3rem)` | 内页 section title |
| `text-xl` `text-lg` `text-base` | Tailwind 默认 | lede / body |

**红线**：hero 不要用 `text-3xl` / `text-5xl` 这种 Tailwind 默认字号 —— 它们没响应式 clamp。

### 3.3 三种 accent 处理

```css
.accent          /* 行内强调 (em / span)：weight 800 + page accent 渐变 */
.accent-display  /* hero 强调：weight 900 + accent-shimmer 流光 */
.title-sub       /* 副标题专用：同主题渐变，不额外叠 underline / marker */
```

`.accent-display` 和 `.title-sub` 自动跑 `accent-shimmer` 6s 流光（gradient 从中间扫过），呼应苹果发布会标题的金属光泽。

### 3.4 Eyebrow

```html
<div class="eyebrow">🎙️ Find me · 在哪里找我</div>
```

```css
.eyebrow {
  font-family: mono;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-3);
}
```

每个 section title 上方一行，杂志感的关键。

---

## 4. 形 · 圆角 / 间距 / 阴影 / 描边

### 4.1 圆角

| 用途 | 值 |
|---|---|
| nav pill / button / chip | `rounded-full` |
| 小卡片 (thiings-mini / 弹窗内 chip) | `rounded-2xl` (16px) |
| 中卡片 (内容卡) | `rounded-2xl` (16px) |
| 大卡片 / hero 卡 (thiings-card) | `rounded-[28px]` |
| brand logo 方块 | `rounded-xl` (12px) |

### 4.2 描边

只在「需要轻微分隔但不要硬线」时用。**绝不用粗黑边**。

```css
border: 1px solid var(--hairline);  /* rgba(0,0,0,0.08) */
```

### 4.3 阴影系统

| Tailwind class | 用途 |
|---|---|
| `shadow-soft` | 默认浮起（卡片 hover） |
| `shadow-thiings` | thiings 风浮起（轻 + 远 + 模糊） |
| `shadow-thiings-hover` | thiings hover 态（更高更模糊） |
| `shadow-hairline` | 内描边代替 border（用 `inset` 阴影模拟） |

特点：阴影 **远 + 大模糊半径 + 低 opacity**，不要短而密。参考 thiings.co 的物件浮起感。

### 4.4 玻璃 / 模糊

```css
bg-paper/75 backdrop-blur-xl
```

只用在 sticky nav（滚动后才出现）和 modal 背景。**不要满屏玻璃**。

### 4.5 容器

| Token | max-w |
|---|---|
| `wrap` | `1120px` |
| `wrap-narrow` | `720px`（用在阅读视图，例如长文 article） |

---

## 5. 动 · 动画 / 缓动

### 5.1 缓动曲线

| 名字 | bezier | 用在 |
|---|---|---|
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | hover 弹性、卡片 transform、模态出入 |
| `standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | 颜色 / 透明度过渡 |

**不要用 linear**，除了 marquee 这种持续滚动。

### 5.2 Keyframes

| Keyframe | 周期 | 用在 |
|---|---|---|
| `breathe` | 2.4s | live dot / 呼吸点（logo 角、live status pill）|
| `float-y` | 5s | hero 主物件上下浮 |
| `float-tilt` | 6s | sub-orb 上下 + 微旋转 |
| `halo-pulse` | 7s | 光晕慢扩张 |
| `accent-shimmer` | 6s | `.accent-display` / `.title-sub` 标题流光 |
| `dark-shimmer-flow` | 8s | 暗模式特定卡片流光 |
| `marquee-x` | varies | 横向走马灯（things grid 不用，预留） |

### 5.3 滚动入场

`.reveal` + `IntersectionObserver`。元素进入视口时加 `.in` 类淡入上浮。

```html
<section className="wrap reveal pb-24">
```

**红线**：路由切换时要重新观察新页面的 `.reveal` 元素，否则永远 opacity:0。已在 [`components/reveal-script.tsx`](./components/reveal-script.tsx) 处理。

---

## 6. 视觉模式（核心组件）

### 6.1 PageHeader · 内页 hero

**模式**：左字 + 右光晕 emoji，无卡片框。

- emoji `clamp(92px, 10.5vw, 122px)` —— 留在 Apple raster 甜区，**绝不超 128px**。
- 4 个 sub-orb 散落四角，错峰 float 动画。
- 光晕颜色 = `var(--accent-stroke-mid)`，自动跟 page theme。
- 标题 `.text-display-lg`，副标题用 `.title-sub`（同主题渐变）。

参考：[`components/page-header.tsx`](./components/page-header.tsx)。

### 6.2 thiings 浮起卡

```
.thiings-card    /* 大卡片：圆角 28px + 软 shadow + spring hover */
.thiings-mini    /* 小卡片：圆角 16px + 短距 shadow */
```

不带边框，靠阴影制造层次。Hover 时：浮起 4px + shadow 加深 + 弹性回弹。

### 6.3 Nav · 顶部导航

- **滚动 ≤ 8px**：完全透明，只有 logo + links。
- **滚动 > 8px**：磨砂玻璃 (`bg-paper/75 backdrop-blur-xl`) + 软 drop shadow。
- **active link**：`bg-[var(--accent-pill)] text-[var(--accent-text)]`。
- **brand dot**：`bg-[var(--accent-dot)]` + breathe 动画。

**红线**：nav 不用 `border-bottom` 实线，只有阴影。

### 6.4 Hero 光晕（首页 + PageHeader）

```css
background: radial-gradient(closest-side at 50% 50%,
  color-mix(in srgb, var(--accent-stroke-mid) 85%, transparent) 0%,
  color-mix(in srgb, var(--accent-stroke-mid) 55%, transparent) 22%,
  color-mix(in srgb, var(--accent-stroke-mid) 28%, transparent) 45%,
  color-mix(in srgb, var(--accent-stroke-mid) 10%, transparent) 68%,
  transparent 85%);
```

附 `halo-pulse` 7s 慢扩张 + dark mode 下额外 brightness/screen blend。

### 6.5 Accent shimmer（渐变强调）

`.accent` / `.accent-display` / `.title-sub` 使用 Apple 风格渐变文字：`background-clip: text` + `accent-shimmer` 6s 慢扫。颜色来自 `var(--accent-text)`、`var(--accent-dot)`、`var(--accent-text-dark)`。

### 6.6 Logo

「C」字形 brand mark + 角落呼吸点（颜色跟 page halo 走）。详见 [`components/logo.tsx`](./components/logo.tsx)。

Favicon 是同一段 SVG inline 在 `metadata.icons`，浏览器 tab 色跟站内一致。

---

## 7. 暗色模式

### 7.1 默认行为

- 首次访问跟随 OS (`prefers-color-scheme`)。
- 用户点 toggle → 锁定明确选择，OS 再切也不跟。
- 3 态循环：🌗 auto → ☀️ light → 🌙 dark → 🌗 auto。
- localStorage key: `claire-theme`，存 `'light'` / `'dark'`，删除 = auto。

### 7.2 No FOUC

`<head>` 里有同步内联脚本，**先于 React 渲染**就把 `data-theme` 写到 `<html>`。这样暗色用户刷新页面不会闪一下亮色。详见 [`app/layout.tsx`](./app/layout.tsx)。

### 7.3 暗模式覆盖规则

集中在 `globals.css` 末尾的 `[data-theme='dark']` 选择器。要点：

1. **Tailwind opacity 修饰类（`bg-cream/35`）会编译成新 class**，`[data-theme='dark'] .bg-cream` 不会自动覆盖 `.bg-cream/35` —— 要单独写选择器（已有，遇到新数值再补）。
2. **彩色 tint** (`bg-cream/X`, `bg-peach/X`, `bg-sage/X`, `bg-sky2/X`) → 在 dark 下变成低 opacity 径向光晕（保留色相提示，但不刺眼）。
3. **纯色 pill** (`bg-sage`, `bg-cream`) → 14% 透明 + 浅文字。
4. **渐变背板** (`from-X via-Y to-Z`) → 改写每个 stop 的 `--tw-gradient-from/via/to` CSS 变量。

### 7.4 viewport theme-color

`<head>` 里给 `prefers-color-scheme: light` / `dark` 各设一个 theme-color，移动端浏览器 chrome 颜色也跟着切。

---

## 8. 响应式

### 8.1 断点（Tailwind 默认）

| Prefix | 宽度 | 用法分界 |
|---|---|---|
| `sm:` | ≥ 640px | hero 从单列切两列；nav 全部展开 |
| `md:` | ≥ 768px | 字号 / 间距升一档 |
| `lg:` | ≥ 1024px | hero 卡片放大到 280-320px；多列网格 |
| `xl:` | ≥ 1280px | 微调 |

### 8.2 Hero 切换

| 视口 | 布局 | 图标卡 |
|---|---|---|
| < 640 | 单列，图标在标题上方（`order-first`），左对齐 | 200px |
| 640-767 | 两列 `[1fr_220px]` | 220px |
| 768-1023 | 两列 `[1fr_280px]` | 280px |
| ≥ 1024 | 两列 `[1fr_320px]` | 320px |

### 8.3 Nav 收紧

< 640 px：
- brand 文字隐藏，只剩 logo
- pill padding 从 `px-3.5` 收到 `px-2`
- 字号 `13px`（vs 桌面 `14px`）
- 链接间距 `gap-0`

确保 5 个中文 pill + logo 在 360px viewport 也能放下（验证过 iPhone SE / Galaxy S）。

---

## 9. 红线汇总

跟 [AGENTS.md](./AGENTS.md) §2 一致，便于设计 review 时一页带过：

- ❌ 给 section 加硬边框分割 → ✅ 阴影 / 光晕 / 留白
- ❌ emoji 超 128 px → ✅ 留在 raster 甜区，要更大用 SVG
- ❌ 中文加 italic → ✅ 中文没真斜体，斜过来又细又怪
- ❌ emoji 当 logo / 平台图标 → ✅ 自绘 SVG / 官方 App Store icon
- ❌ 装第三方图标包 → ✅ 自画 / 抓官方
- ❌ 硬编码 `#XXXXXX` 当 accent → ✅ `var(--accent-*)` + `color-mix`
- ❌ subtitle 用 `text-ink-3` 灰 → ✅ `.title-sub`（page accent 渐变）
- ❌ subtitle 额外叠 underline / marker → ✅ `.title-sub` 自己处理强调
- ❌ 数据散落在 JSX → ✅ 集中到 [`lib/content.ts`](./lib/content.ts)
- ❌ serif italic 做强调 → ✅ `.accent-display`（heavy + gradient shimmer）

---

## 10. 改动这份文件

DESIGN.md 是参考文档，跟 AGENTS.md 不同 ——

- **AGENTS.md**：行为守则，遇到坑就写
- **DESIGN.md**：设计规范，新增 token / 改 token 就写

如果 `THEMES` 表加了新 halo / 新 token，回来更新第 2 节的表格。如果新增了 keyframe / 缓动曲线，回来更新第 5 节。文件本身保持「找 token → 找用法 → 看示例」的三段式结构，不写故事。
