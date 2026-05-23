# Claire's Parlor — v2

新版个人站。Next.js 14 (App Router) + TypeScript + Tailwind v3。
设计语言：苹果极简 × [thiings.co](https://www.thiings.co/things) — 大留白、单色 ink、3D-ish 物件浮在白卡上。

## 设计原则

1. **多页 > 单页**：原 5205 行单 HTML 已拆成 7 条独立路由，按"4 个房间"组织。
2. **一屏一锚点**：去掉液态玻璃 / 6 套 tint / 状态轮播 / emoji parade。每屏只放该屏的主角。
3. **主张归零**：Hero 只有一句"一个空间，四个房间"+ 4 张房间卡。其它内容点进去看。
4. **共建感保留**：占位卡、TBA、空墙——原站"过程比成品诚实"的气质照搬。

## 结构

```
/                 极简首页（One space, four rooms）
/parlor           会客厅（嘉宾席 · 客厅小聚 · 找我 12 平台）
/studio           工作台（AI 笔记目录 · 阅读路线）
/studio/l1...l6   各章详情（占位，等正文搬进来）
/studio/aside     旁支 · 推荐系统
/studio/bookshelf 书房（微信读书直连）
/studio/tunes     客厅音乐（网易云外链 + 4 平台卡）
/workshop         工坊（3 方向 · 场次 · 预习链回 /studio）
/cooperate        合作（客户 / 投资人 / 联系）
/manifesto        我的主张（6 条）
```

## 运行

```bash
cd web
npm install        # 或 pnpm install
npm run dev        # 本地预览：http://localhost:3000
npm run build      # 静态导出到 ./out
```

`next.config.mjs` 里 `output: 'export'`，build 后输出纯静态文件，可直接传 Vercel / Cloudflare Pages / GitHub Pages / 阿里 OSS。

## 内容编辑

所有可改文案集中在 `lib/content.ts`：
- `ROOMS` — 4 个房间的名称、文案、emoji
- `MANIFESTO` — 6 条主张
- `CHAPTERS` — L1–L6 的标题、关键词、tagline
- `PLATFORMS` — 12 平台 handle / 链接
- `GUESTS` / `HANGOUTS` / `WORKSHOP_TRACKS` / `READING_BOOKS` / `FINISHED_BOOKS`

页面只是组件 + 数据，改文案不用碰 JSX。

## 设计 tokens

`tailwind.config.ts` 暴露：
- 颜色：`paper` / `surface` / `ink-{1..5}` / `accent` / 4 个超柔和 tint
- 字号阶梯：`display-xl` / `display-lg` / `display-md`（用 clamp 做响应式）
- 阴影：`thiings` / `thiings-hover` / `soft` — thiings 风的"浮起 + 慢落"
- 字体栈：`font-sans` / `font-rounded`（SF Pro Rounded）/ `font-serif` / `font-mono`

## 还要做的

- [ ] L1–L6 正文从原 `index.html` 搬运（每章独立 page 里现在是占位）
- [ ] thiings 风 3D 物件 PNG 替换当前 emoji（可去 thiings.co 或自己 render）
- [ ] 双语切换（原站有，已留 hooks，未实装）
- [ ] WeChat / Douyin 二维码 modal
- [ ] BGM 浮窗（如果还想要的话——建议放 `/studio/tunes` 即可，不用全站常驻）

## 跟原站的对照

| 原 v1 | v2 现在的位置 |
|---|---|
| Hero 4 rooms + 5 role-entries | 首页 4 rooms（5 entries 已合并入房间页） |
| Manifesto section | `/manifesto` 独立页 |
| Notes-lead + Icon Map + TOC + L1-L6 | `/studio` 一页统筹 |
| 各章节内容 | `/studio/l1` ... `/studio/l6` |
| Reading order | `/studio` 末尾 |
| Find me | `/parlor` 末尾 |
| Bookshelf | `/studio/bookshelf` |
| Tunes | `/studio/tunes` |
| Guest Room + Hangouts | `/parlor` |
| Workshop（含 prereqs/photos/reviews）| `/workshop` |
| Cooperate + Join CTA | `/cooperate` |
| Colophon | 全局 `<Footer />` |
