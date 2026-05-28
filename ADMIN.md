# ADMIN.md — 管理后台方案

> 目标：给 Claire's Parlor 加一个轻量后台，用来管理需要动态更新的内容：LiveStatus、音乐歌单、播客、社交账号、线下见面会照片、活动等。

---

## 1. 结论

**后台继续放在当前项目里，入口是 `/admin`。**

现阶段不新起独立项目，也不改 monorepo。理由：后台管理的是同一个站点的内容，放在当前项目里可以复用现有 Next App Router、Tailwind、主题系统、双语习惯和 Cloudflare Pages 部署链路，最快让 Claire 真正用起来。

推荐栈：

| 层 | 选择 | 用途 |
|---|---|---|
| 托管 | Cloudflare Pages | 继续部署现有静态站点 |
| 代码 | GitHub | 只管代码，不承接高频内容更新 |
| 数据库 | Supabase Postgres | 存动态内容 |
| 登录 | Supabase Auth | 管理后台登录 |
| 图片 | Supabase Storage | 线下照片、封面、二维码等媒体 |
| 分析 | PostHog | 后续可选 |
| 报错 | Sentry | 后续可选 |
| 邮件 | Resend | 后续报名 / 合作表单再接 |

暂时不引入：Vercel、Clerk、Stripe、Upstash、Pinecone。

---

## 2. 当前项目内的目录落点

```txt
app/
  admin/
    layout.tsx
    page.tsx
    live-status/page.tsx
    music/page.tsx
    podcasts/page.tsx
    socials/page.tsx
    moments/page.tsx
    events/page.tsx

components/
  admin/
    admin-shell.tsx
    admin-nav.tsx
    auth-guard.tsx
    data-table.tsx
    edit-dialog.tsx
    image-uploader.tsx
    publish-toggle.tsx
    sort-order-field.tsx

lib/
  supabase/
    client.ts
    queries.ts
    types.ts
```

约束：

- `/admin` 做成 client-side 管理后台。
- 站点仍保持 `output: 'export'` 静态导出。
- 不依赖 Next API Route、Server Action 或服务端密钥。
- 浏览器只使用 Supabase anon key，权限全部交给 Row Level Security。

---

## 3. 数据策略

现有 `lib/content.ts` 继续作为静态内容和 fallback 的来源。第一阶段只把真正需要频繁更新的内容接入 Supabase。

### 3.1 热更新内容

适合放 Supabase：

- LiveStatus 顶部状态轮播
- 首页 / 会客厅的 featured podcast
- 客厅音乐歌单
- 社交账号和二维码
- 线下见面会照片墙
- Workshop / Coffee Chat / 黑客松等活动

不急着迁移：

- 房间叙事结构
- manifesto
- L1-L6 章节正文
- mascot / merch / prompts 等低频内容

这些仍然留在 `lib/content.ts`，等后台稳定后再决定是否迁移。

### 3.2 前端读取方式

前台页面采用「静态 fallback + 客户端刷新」：

1. 首屏先渲染代码里的 fallback 内容。
2. 组件挂载后从 Supabase 拉取 `enabled = true` 的最新数据。
3. 拉取成功就替换显示；失败则继续展示 fallback。

这样 Supabase 网络波动不会让公开网站白屏。

---

## 4. 首批表结构草案

### 4.1 `live_status_items`

管理顶部 LiveStatus 轮播。

```txt
id uuid primary key
glyph text
zh text
en text
enabled boolean
sort_order int
valid_from timestamptz nullable
valid_to timestamptz nullable
created_at timestamptz
updated_at timestamptz
```

### 4.2 `music_tracks`

管理客厅音乐 / 歌单。

```txt
id uuid primary key
title text
artist text
cover_url text nullable
platform text
url text
note_zh text nullable
note_en text nullable
enabled boolean
sort_order int
created_at timestamptz
updated_at timestamptz
```

### 4.3 `podcast_episodes`

管理播客条目和 featured podcast。

```txt
id uuid primary key
title_zh text
title_en text nullable
description_zh text nullable
description_en text nullable
cover_url text nullable
audio_url text nullable
external_url text nullable
published_at timestamptz nullable
featured boolean
enabled boolean
sort_order int
created_at timestamptz
updated_at timestamptz
```

### 4.4 `social_accounts`

管理平台账号、链接和二维码。

```txt
id uuid primary key
platform text
handle text
url text nullable
qr_url text nullable
enabled boolean
sort_order int
created_at timestamptz
updated_at timestamptz
```

### 4.5 `moments`

管理线下见面会 / Workshop / Coffee Chat 照片。

```txt
id uuid primary key
title_zh text nullable
title_en text nullable
image_url text
location text nullable
taken_at date nullable
tags text[]
enabled boolean
sort_order int
created_at timestamptz
updated_at timestamptz
```

### 4.6 `events`

管理活动卡片。

```txt
id uuid primary key
title_zh text
title_en text nullable
starts_at timestamptz nullable
ends_at timestamptz nullable
location text nullable
cover_url text nullable
signup_url text nullable
status text
enabled boolean
sort_order int
created_at timestamptz
updated_at timestamptz
```

---

## 5. 权限模型

Supabase Auth 只允许 Claire 和维护者邮箱登录后台。

基本策略：

- 公开站点可以读取 `enabled = true` 的内容。
- 已登录管理员可以读取全部内容。
- 只有管理员可以新增、编辑、删除、上传图片。
- 前端绝不暴露 `service_role` key。
- RLS policy 是唯一可信权限边界。

推荐在 Supabase 里维护一个 `admin_users` 表：

```txt
id uuid primary key
email text unique
created_at timestamptz
```

所有写入 policy 都检查当前用户邮箱是否在 `admin_users` 中。

---

## 6. 环境变量

Cloudflare Pages 和本地 `.env.local` 需要：

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

因为项目是静态导出，只能使用 `NEXT_PUBLIC_*`。敏感密钥不得放入前端环境变量。

---

## 7. 落地顺序

### P1：Supabase 基础 + LiveStatus 动态化

- 创建 Supabase project。
- 建 `live_status_items` 表和 RLS。
- 新增 `lib/supabase/client.ts`。
- 改 `components/live-status.tsx`：保留当前 `MESSAGES` 作为 fallback，挂载后读取 Supabase。

### P2：`/admin/live-status`

- 新增后台 shell 和登录保护。
- 做 LiveStatus 列表、新建、编辑、启用/停用、排序。
- 验证 Claire 可以不改代码直接发布状态。

### P3：音乐、播客、社交账号

- 复用后台表单和列表组件。
- 接入 `music_tracks`、`podcast_episodes`、`social_accounts`。
- 前台页面继续保留 fallback。

### P4：图片与活动

- 接 Supabase Storage。
- 做 `moments` 图片上传和管理。
- 做 `events` 活动管理。

### P5：观测和自动化

- 需要内容热度时接 PostHog。
- 需要线上报错提醒时接 Sentry。
- 需要报名 / 合作自动邮件时接 Resend。

---

## 8. 以后什么时候拆出去

先不拆。等出现下面任意两项，再考虑新项目或 monorepo：

- 后台需要独立域名和独立发布节奏。
- 出现多人角色、审核流、权限矩阵。
- 后台页面数量明显超过公开站点页面。
- 需要 Worker / cron / 邮件队列 / 批处理等独立运行时。
- 共享类型、UI、数据库迁移脚本变多，单项目目录开始拥挤。

如果要拆，目标形态是：

```txt
apps/
  web/
  admin/
packages/
  ui/
  supabase/
  content-schema/
```

当前写法要保持可迁移：后台代码集中在 `app/admin/*`、`components/admin/*`、`lib/supabase/*`，不要散进公开页面。
