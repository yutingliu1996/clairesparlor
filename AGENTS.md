# AGENTS.md — 工作守则

> 这份文件给所有以后接手这个项目的 AI agent / 开发者。先把这里读完再动代码，
> 避免无效迭代。Claire 的反馈是"做减法 + 不跑偏"，不是"加更多功能"。

---

## 1. 这个站点是什么

**Claire's Parlor / Claire 的会客厅** — 刘玉婷的个人客厅。
5 年 PM 转型 AI 内容创业者，主线是**播客**，副线是笔记/工坊/合作。

核心叙事：**一个空间，四个房间。**

```
🛋️ 会客厅 Parlor      跟世界打交道（播客 / 嘉宾 / 社群 / 12 平台）
💻 工作台 Studio      自己埋头做事（AI 笔记 / 书房 / 音乐 / IP 化妆间）
🪄 工作坊 Workshop    教学员手艺（自媒体 / AI 创业 / 黑客松）
🤝 合作 Cooperate     客户 / 投资人 / 金主
```

气质关键词：**"过程比成品诚实"** · **"频道是共建的，不是我演你看"**。
保留占位卡 / TBA / 空墙是有意为之，不是没做完。

---

## 2. 设计哲学（不可妥协）

### 苹果极简 × thiings.co
- **大留白**。每个区块只放一个主角。
- **同一字体族**（system sans / SF Pro / 苹方）。强调靠**重量 + 颜色 + 装饰**，不切 serif。
- **单色 ink + 单 accent**。多色出现的地方 = bug。
- **3D-ish 物件浮在白卡上**（thiings 的视觉语汇）。

### 哪些事情绝对不要做（红线）

| ❌ 不要 | ✅ 要 |
|---|---|
| 给 section 加硬边框分割 | 用阴影 / 光晕 / 留白 |
| 把 emoji 放大过 ~128 px | 维持在 Apple raster 甜区，要更大就用 SVG |
| 给中文加 italic | Songti 没真斜体，斜过来又细又怪 |
| 用 emoji 当 logo / 平台图标 | 自绘 SVG（logo）/ 官方 App Store 图标（平台）|
| 装第三方图标包 react-icons / lucide | 自画 / 从官方 brand kit 抓 |
| 在 JSX 里硬编码 `#XXXXXX` accent 色 | 走 CSS 变量 `var(--accent-text)` 等 |
| 在 subtitle 用 `text-ink-3` 灰色 | 用 `.title-sub`，跟 page accent 同色 |
| 给 subtitle 加 marker stroke 装饰 | 装饰留给 `.accent-display`，subtitle 安静 |
| 在文案 / 组件里散落数据 | 集中到 `lib/content.ts` |
| 用 serif italic 做强调 | 用 `.accent-display`（heavy + marker） |

---

## 3. 视觉系统

### 3.1 色彩 — Per-page Halo Theme

**每条路由有自己的主色。** 主色驱动整页的 nav 胶囊 / hero 光晕 / accent 字 / 副标题。
不要全站用同一个绿。

| Halo | 用在哪 | accent text | nav pill bg |
|---|---|---|---|
| `mint` | `/` `/bar` | `#1F7A57` | `#DCEFE3` |
| `sage` | `/workshop` `/manifesto` `/studio/l2` `/studio/l5` | `#1F7A57` | `#E1EFE5` |
| `peach` | `/parlor` `/studio/l3` `/studio/aside` | `#C2502E` | `#FFE5D8` |
| `sky` | `/studio` `/studio/l1` `/studio/l6` | `#1E5BA8` | `#DDE9F8` |
| `cream` | `/cooperate` `/studio/ip` `/studio/l4` | `#8C6A1F` | `#F8EFD5` |

实现：[`components/main-theme.tsx`](./components/main-theme.tsx) 在 `<main>` 上注入 7 个
CSS 变量，向下级联。要新增/调主题：改 `THEMES` 表 + `pathToHalo` 映射。

7 个 token：
```
--accent-text          light bg 上的强调字
--accent-stroke        marker 下划线（边）
--accent-stroke-mid    marker 下划线（中央，更饱满）
--accent-text-dark     dark bg 上的强调字
--accent-stroke-dark   dark bg 上的 marker 下划线
--accent-pill          nav active 胶囊 bg
--accent-dot           brand logo 角的呼吸点
```

### 3.2 字体

- **唯一字体族**：`font-sans`（SF Pro Display / 苹方），其它字体类（`font-rounded` / `font-serif` / `font-mono`）只在很特殊的场景用（colophon / 代码 / 等距数字），**不要混进 hero 标题**。
- **强调走 weight + 装饰**，不切 family：
  - `.accent-display` — heavy 900 + 暖色 marker stroke + 字距 -0.035em
  - `.accent` — heavy 800 + marker（小一号）
  - `.title-sub` — 当前页 accent 色 + 0.66 透明度（副标题专用）
- **字号阶梯严格**：`text-display-xl` / `text-display-lg` / `text-display-md`（用 clamp 响应式）。**不要在 hero 用 `text-3xl`、`text-5xl` 这种 Tailwind 默认字号**。

### 3.3 视觉元素

- **PageHeader hero**：左边大字 + 右边一个 emoji 浮在径向光晕里。**没有卡片框**。光晕颜色 = page halo。详见 [`components/page-header.tsx`](./components/page-header.tsx)。
- **emoji 留在 raster 甜区**：`clamp(92px, 10.5vw, 122px)`。要更大就考虑换 SVG，别硬放。
- **thiings 浮起卡**：`.thiings-card`（大）/ `.thiings-mini`（小）。共有的是软 shadow + spring 弹性 hover + 圆角 28/16px。
- **Nav**：sticky + frosted glass，**滚动 8px 后才出现** soft drop shadow。**没有硬边框**。

### 3.4 动画

- **统一缓动曲线**：`cubic-bezier(0.34, 1.56, 0.64, 1)`（spring 弹性）和 `cubic-bezier(0.4, 0, 0.2, 1)`（standard ease）。
- **常驻动画**：`float-y` / `float-tilt`（hero 物件浮动）/ `breathe`（呼吸点）/ `halo-pulse`（光晕慢扩张）/ `marquee-x`（横向走马灯）。
- 滚动入场动画走 `.reveal` + IntersectionObserver（[`components/reveal-script.tsx`](./components/reveal-script.tsx)）。**路由切换时要重新观察**，不然新页面元素永远 opacity:0。

### 3.5 暗色模式

**默认跟随系统**（`prefers-color-scheme`），用户点 toggle 才锁定。3 态循环：
🌗 auto → ☀️ light → 🌙 dark → 🌗 auto

- **No FOUC**：[`app/layout.tsx`](./app/layout.tsx) 的 `<head>` 有同步内联脚本，**先于 React 渲染**就把 `data-theme` 写到 `<html>`。
- **暗色覆盖集中在 `globals.css` 末尾**的 `[data-theme='dark']` 选择器。Tailwind 的 opacity 修饰类会编译成新 class（如 `.bg-cream\/35`），**单独写选择器**才能盖到，不要假设 `.bg-cream` 的 dark 规则会自动覆盖 `.bg-cream/35`。
- 暗色下：tint 色块 → 低不透明度径向光晕；纯色 pill → 14% 透明 brand 色；渐变背板 → 调暗 to-stops。

---

## 4. 文案语气

- **中文为主**，英文是备份。`useLang()` 控制双语切换。**不要因为窄屏自动 fallback 到英文**（曾经犯过这个错）。
- **短句、动词、不油腻**。Claire 自己的口语：
  - ✅ "听播客 · 翻笔记 · 报 workshop · 找合作"
  - ✅ "推门进 L1 房间"
  - ✅ "金主爸爸"
  - ❌ "欢迎您的莅临 / 全方位赋能 / 一站式解决方案"
- **杂志编辑风格**：每个 section 是 `eyebrow + 大标题 + lede + 内容`。eyebrow 用 `.eyebrow`（mono / 11px / uppercase / letter-spacing 0.18em）。
- **共建感**：占位卡用 "TBA" / "等真人来了" / "这墙先空着" 这种诚实文案，不要写"敬请期待"。

---

## 5. 代码约定

### 5.1 文件组织

```
web/
├── app/                  路由（App Router）
│   ├── layout.tsx        全局 shell（含 <head> 脚本 / Provider）
│   ├── page.tsx          首页
│   └── {parlor,studio,workshop,cooperate,manifesto,bar}/page.tsx
├── components/           可复用组件，kebab-case 命名
├── lib/
│   └── content.ts        所有可改文案 / 数据集中在这
└── public/
    └── logos/            12 个平台官方 App Store icon (PNG)
```

### 5.2 内容数据

**所有可改文案在 [`lib/content.ts`](./lib/content.ts)。** 改文案不要碰 JSX。
14 个 export：`ROOMS` / `MANIFESTO` / `CHAPTERS` / `PLATFORMS` / `GUESTS` /
`HANGOUTS` / `WORKSHOP_TRACKS` / `READING_BOOKS` / `FINISHED_BOOKS` /
`MASCOTS` / `MERCH` / `PROMPTS` / `TONGBAR_MESSAGES`。

### 5.3 平台图标

12 个平台 PNG 在 `public/logos/{key}.png`，**512×512 来自 iTunes Search API**：

```bash
curl "https://itunes.apple.com/search?term=APP_NAME&entity=software&country=cn&limit=1" \
  | jq -r '.results[0].artworkUrl512'
```

X (Twitter) 用 ID 直拉：`https://itunes.apple.com/lookup?id=333903271`。
Gmail 代替 mailto 的 mail icon。

**不要装 react-icons / lucide / simple-icons**。要换图标 → 重抓 iTunes API。

### 5.4 Logo

自定义 SVG `<Logo />`（[`components/logo.tsx`](./components/logo.tsx)）：
黑底圆角方块 + 白色 "C" arc + 角落呼吸点（颜色跟 page halo 走）。
Favicon 是同一段 SVG inline 在 `metadata.icons`。

---

## 6. 操作避坑

### 6.1 别同时跑 `dev` 和 `build`

`next build` 会覆盖 `.next/` 里 dev 正在用的运行时 chunk，浏览器收到 404 → 整页变 "裸 HTML"。

```bash
# 要 build / deploy 之前
lsof -ti:3000 -ti:3030 | xargs -r kill -9
rm -rf .next
npx next build

# 已经裂了 → 同上 + 重启 dev
npx next dev
```

### 6.2 部署

```bash
cd web
npx vercel --prod      # 生产，aliased 到 v2.clairesparlor.com
npx vercel             # preview，独立 URL
```

项目已 link 到 `harzss-projects/claires-parlor`，`.vercel/project.json` 别删。

### 6.3 Git

仓库根在 `web/`（之前误把 `web/` 当 submodule 加到外层，被回滚过两次）。
**不要在 `/Users/chenjie/Workspace/claire/` 再 init 一个 outer git**，会冲突。

---

## 7. 跟用户协作的模式（来自迭代）

Claire 的反馈通常是**做减法**，不是加功能。当她说：

| Claire 说 | 通常意思 |
|---|---|
| "有点冗余" | 删掉副标题 / 移除二级文字 |
| "太朴素" | 加视觉层次（光晕 / 阴影 / 渐变），不是加文字 |
| "为什么不一致" | 找别的页面的处理方式，对齐过来 |
| "不要自己发挥" | 用现成的（官方 logo / iOS icon），不要自创 |
| "代码被回滚" | 工作区被外部清掉了，重新应用并重 git init |
| "重新应用" | 把上次的改动按相同思路再做一遍 |

**先做最简单的版本看效果，再迭代**。先不要写一大堆配置项 / 切换开关，
她经常是看到效果再决定要不要保留。

---

## 8. 这份文件怎么维护

新接手的人发现：
- 又踩了同一个坑 → 写到第 6 节
- 又被同样反馈打回 → 写到第 7 节
- 设计了新约定 → 写到第 2 / 3 / 5 节
- Claire 表达了新偏好 → 第 1 / 4 节

**保持简短直接，举具体例子，避免抽象建议**。这份文件是给"读完就能少踩坑"的，
不是给"读完更困惑"的。
