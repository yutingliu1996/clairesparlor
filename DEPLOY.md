# Deploy · Cloudflare Pages

> 把当前项目部署到 Cloudflare Pages（Git 集成 / 自动 CI）。
> 生产域名是 `clairesparlor.com`，`*.pages.dev` 作为 Pages 预览 / 回滚入口。

---

## 0. 前置

- 仓库托管：GitHub / GitLab（Cloudflare Pages 支持的两家）
- Cloudflare 账号已开通（免费版即可）
- 本地构建已 OK：`pnpm build` → 产物在 `out/`

---

## 1. 仓库准备（一次性）

### 1.1 锁定包管理器为 pnpm

`package.json` 已写 `"packageManager": "pnpm@10.33.2"`，Cloudflare V2 build 会通过 Corepack 自动使用对应版本的 pnpm。

仓库里现在没有 `package-lock.json`。如果以后误生成 npm 锁文件，删掉它，只保留 `pnpm-lock.yaml`。

### 1.2 检查 Node 版本

`.nvmrc` 已写 `22`，Cloudflare V2 build 会自动读取。

> 如果以后要降到 Node 20 LTS，改 `.nvmrc` 和 Cloudflare Pages 的 `NODE_VERSION` 即可。

---

## 2. Cloudflare Pages 配置

进 [Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git](https://dash.cloudflare.com/?to=/:account/pages)，授权访问当前代码仓库。

### 2.1 Build settings

| 字段 | 值 |
|---|---|
| **Project name** | `claires-parlor`（→ `claires-parlor.pages.dev`） |
| **Production branch** | `main` |
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `pnpm install --frozen-lockfile && pnpm build` |
| **Build output directory** | `out` |
| **Root directory (advanced)** | 留空 |

> 如果 Cloudflare 连接的是这个项目所在的仓库，Root directory 留空即可。

### 2.2 Environment variables

当前公开站点无需外部 API 密钥。建议只设：

| Variable | Value | 说明 |
|---|---|---|
| `NODE_VERSION` | `22` | 双保险，和 `.nvmrc` 配合 |

等 `/admin` 接 Supabase 后，再在 Cloudflare Pages 里加：

| Variable | 说明 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

### 2.3 Save and Deploy

点 **Save and Deploy**，Cloudflare 会拉代码 → `pnpm install` → `pnpm build` → 把 `out/` 推到 CDN。首次部署通常 1-3 分钟。

---

## 3. 验证

部署完进项目页面：

- 生产域：`https://clairesparlor.com`
- 预览域：`https://claires-parlor.pages.dev`
- 检查每个房间路由能开：`/parlor` `/studio` `/studio/l1` `/studio/l2` `/workshop` `/cooperate` `/manifesto` `/bar` `/studio/ip` `/studio/bookshelf` `/studio/tunes`
- 检查 per-page halo 主题色生效（mint / peach / sky / sage / leaf / cream）
- 静态资源 `/_next/static/*` 响应头里能看到 `cache-control: public, max-age=31536000, immutable`（来自 `public/_headers`）

---

## 4. 自定义域名

`clairesparlor.com` 已作为生产域名使用。若未来需要重绑：

1. Cloudflare Pages 项目 → Custom domains → Set up a custom domain
2. 输入 `clairesparlor.com`，照向导走（如果域名已经在 Cloudflare 托管，DNS 一键写入）
3. 如需 `www.clairesparlor.com`，在 Pages 项目里加 redirect 到 apex

---

## 5. CI 行为

- **Push 到 `main`** → 触发生产部署 → 推到 `clairesparlor.com` 和 `claires-parlor.pages.dev`
- **Push 到其他分支 / PR** → 触发预览部署 → 拿到一个 `<hash>.claires-parlor.pages.dev` 链接
- **Rollback**：Cloudflare Pages → Deployments → 选历史版本 → Rollback

---

## 6. 常见踩坑

| 症状 | 原因 | 解决 |
|---|---|---|
| Build 用 npm 而不是 pnpm | 仓库里误生成了 `package-lock.json` | 删掉，只保留 `pnpm-lock.yaml` |
| `Module not found` 在 CI 但本地正常 | Node 版本不一致 | 检查 `.nvmrc` 和 `NODE_VERSION` |
| `out/` 找不到 | Build output directory 写错，或 Root directory 仍是旧的 `web` | Output 设 `out`，Root directory 留空 |
| 首页 404 | Build output directory 写成了 `.next` 不是 `out` | 改成 `out` |
| 路由 404（如 `/studio/l1`） | `next.config.mjs` 的 `trailingSlash: true` 被改掉 | 保持 `true`，Cloudflare Pages 才能映射 `/studio/l1/index.html` |
| Supabase 环境变量不生效 | 改完变量后没重新部署 | 在 Pages 里重跑一次 production deploy |
