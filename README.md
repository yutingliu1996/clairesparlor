# Claire's Parlor

> 一个空间。四个房间。

[![live](https://img.shields.io/badge/live-v2.clairesparlor.com-1F7A57)](https://v2.clairesparlor.com)

刘玉婷 · Claire 的个人客厅 — 5 年 PM 转型 AI 内容创业者，播客 + 笔记 + 工坊 + 合作一站。

---

## 技术栈

- **Next.js 14** App Router · 静态导出（`output: 'export'`）
- **TypeScript**
- **Tailwind CSS v3**
- **部署**：Vercel（自动适配 Next 静态导出）

零运行时依赖：除了 next/react，没有任何第三方 UI 库或图标包。

## 站点结构

```
/                    极简首页（一个空间 · 四个房间）
/parlor              会客厅（嘉宾 / 小聚 / 12 平台找我）
/studio              工作台（AI 笔记目录 + 阅读路线 + 4 个子房间）
  /studio/l1...l6      L1–L6 章节详情（关键词分组 + 工作场景对照）
  /studio/aside        旁支 · 推荐系统
  /studio/ip           IP 化妆间（玉婷 × 铜板儿 mascot + 6 周边 + 6 prompt）
  /studio/bookshelf    书房（微信读书直连，已读 + 在读）
  /studio/tunes        客厅音乐（网易云 + 4 平台跳转）
/workshop            工坊（自媒体 / AI 创业 / 黑客松 三方向）
/cooperate           合作（客户 + 投资人 + 直接联系）
/manifesto           我的主张（6 条）
/bar                 受邀团队入口（magic-link 邮件登录）
```

## 设计系统

### 每页有自己的"主色"

每条路由对应一个 halo 主题（mint / sage / peach / sky / cream），主题在 `<MainTheme>` 里通过 5 个 CSS 变量铺到 `<main>` 上，向下级联到 nav / hero / accent / 副标题：

| Halo | 用在哪 | accent text | nav pill bg |
|---|---|---|---|
| mint | 首页 / `/bar` | `#1F7A57` | `#DCEFE3` |
| sage | `/workshop` `/manifesto` `/studio/l2` `/studio/l5` | `#1F7A57` | `#E1EFE5` |
| peach | `/parlor` `/studio/l3` `/studio/aside` | `#C2502E` | `#FFE5D8` |
| sky | `/studio` `/studio/l1` `/studio/l6` | `#1E5BA8` | `#DDE9F8` |
| cream | `/cooperate` `/studio/ip` `/studio/l4` | `#8C6A1F` | `#F8EFD5` |

要新增/调整主题：改 `components/main-theme.tsx` 里的 `THEMES` 表。

### 视觉语言（约束）

- **同一字体族**（系统 SF Pro / 苹方），不切换 serif；强调靠 `.accent-display`（重量 900 + 暖色记号笔下划线）
- **emoji 在 raster 甜区**（≤128px）保证清晰，不放大到模糊
- **PageHeader hero 用径向光晕**，无卡片框 — 见 `components/page-header.tsx`
- **3D 浮起卡片**用 `.thiings-card` / `.thiings-mini` — 来自 thiings.co 的视觉语汇
- **滚动后 nav 才显玻璃 + 软阴影**，不用硬边框
- **统一动画曲线**：`spring` (cubic-bezier(0.34, 1.56, 0.64, 1))

### Tailwind tokens

`tailwind.config.ts`：

- `paper` `surface` · 底色
- `ink-{1..5}` · 文字阶梯
- `accent.{DEFAULT,soft,deep}` · brand mint（per-page 主题会通过 CSS 变量覆盖）
- 4 个超柔 tint：`cream` `sage` `sky2` `peach`
- 字号 `display-xl` / `display-lg` / `display-md`（clamp 响应式）
- 阴影 `thiings` / `thiings-hover` / `soft`
- 字体栈 `font-sans` / `font-rounded` / `font-serif` / `font-mono`

## 内容数据层

**所有可改文案集中在 [`lib/content.ts`](./lib/content.ts)。** 改文案不用碰 JSX。

```ts
ROOMS              // 4 个房间：会客厅 / 工作台 / 工坊 / 合作
MANIFESTO          // 6 条主张
CHAPTERS           // L1–L6：标题 / 关键词分组 / examples
PLATFORMS          // 12 平台：handle / link / 分组
GUESTS             // 嘉宾席（占位 6 位）
HANGOUTS           // 客厅小聚（听友群 / 书友共读 / 答疑小屋）
WORKSHOP_TRACKS    // 工坊三方向
READING_BOOKS      // 书房 · 在读
FINISHED_BOOKS     // 书房 · 已读
MASCOTS            // 玉婷 + 铜板儿 IP 性格说明书
MERCH              // 6 张周边 mockup
PROMPTS            // 6 段 AI 出图 prompt
TONGBAR_MESSAGES   // 桌面宠物气泡轮播文案
```

## 自定义组件

`components/` 一览：

| 组件 | 干嘛用的 |
|---|---|
| `nav.tsx` | 顶部 sticky nav，滚动后磨砂玻璃 + 软阴影 |
| `logo.tsx` | "C" 字形 brand mark + accent dot 呼吸灯 |
| `main-theme.tsx` | 路径驱动的 CSS 变量主题注入器 |
| `page-header.tsx` | 通用页面 hero（左标题右光晕 emoji） |
| `room-card.tsx` | 首页 4 个房间大卡（thiings 风浮起 + 副物件） |
| `things-grid.tsx` | 24 个物件墙（首页装饰带） |
| `live-status.tsx` | 顶部状态轮播（"在录 EP·02"） |
| `featured-podcast.tsx` | Apple Music 风的当期播客大卡 |
| `stats-strip.tsx` | 大数字 stats（5 yr / 41 books / ∞） |
| `tongbar.tsx` | 铜板儿桌面宠物（轮播气泡 + 一键关闭） |
| `bgm-vinyl.tsx` | 右下角黑胶 BGM 浮窗 |
| `platform-logo.tsx` | 12 个平台官方 App Store 图标渲染 |
| `wechat-qr-modal.tsx` | 微信公众号扫码弹窗 |
| `lang-context.tsx` | 中英双语 context + `useLang()` hook |
| `reveal-script.tsx` | 滚动入场动画 IntersectionObserver |
| `footer.tsx` | 杂志 colophon 风格底栏 |
| `section-title.tsx` | 内页 section 标题（eyebrow + h2 + sub） |

## 资源

- `public/logos/*.png` — 12 个平台官方 App Store icon（512×512），通过 iTunes Search API 抓的
- `public/wechat-qr.jpg` — 微信公众号二维码
- `public/guests/` `public/moments/` — 嘉宾头像 / 现场照片占位

## 运行 / 部署

```bash
# 本地开发
pnpm install        # or npm / yarn
pnpm dev            # → http://localhost:3000

# 静态构建
pnpm build          # 输出到 ./out

# 部署到 Vercel
npx vercel --prod   # 推一个新 production
npx vercel          # 推一个 preview
```

### ⚠️ 别同时跑 `dev` 和 `build`

build 会覆盖 `.next/` 里 dev 正在用的运行时 chunk → 浏览器收到 404 → 页面变"裸 HTML"。

要 build 之前：

```bash
lsof -ti:3000 | xargs -r kill -9     # 先停 dev
rm -rf .next                          # 保险清缓存
pnpm build
```

如果已经裂了：

```bash
lsof -ti:3000 -ti:3030 | xargs -r kill -9
rm -rf .next out
pnpm dev
```

## 已实装功能

- ✅ L1–L6 章节正文（6 章 + 1 旁支，从 v1 完整迁移）
- ✅ IP 化妆间（mascot + 周边 + AI prompt）
- ✅ 中英双语切换（`useLang` hook，状态持久化在 sessionStorage）
- ✅ 桌面宠物铜板儿 + 黑胶 BGM 浮窗（可独立关闭，per-session）
- ✅ 微信 QR modal
- ✅ 12 平台官方 App Store 图标
- ✅ 全站 per-page 主题（halo 颜色驱动整页 accent / nav / hero）
- ✅ 滚动入场动画 + 路由切换重新观察
- ✅ 静态导出，零后端依赖

## 待办

- [ ] L1–L6 章节插图 / 流程图
- [ ] 嘉宾真人头像替换（`/parlor` Guest Room 占位）
- [ ] 工坊照片墙真照片
- [ ] `/bar` 接真后端（magic-link endpoint，目前 UI stub）
- [ ] 抖音 QR modal（已有微信 modal 模板）
- [ ] 域名从 `v2.clairesparlor.com` 切到 `clairesparlor.com`



## License

代码 MIT。文案 / 设计 / 图片 / 周边 mockup © 2026 刘玉婷 · Claire's Parlor。
平台图标版权归各平台所有，仅作 nominative use（指引用户跳转）。
