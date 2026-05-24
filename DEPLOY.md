# Deploy · Cloudflare Pages

> 把 `web/` 部署到 Cloudflare Pages（Git 集成 / 自动 CI）。
> 第一步先上 `*.pages.dev`，绑域 `clairesparlor.com` 留到后面。

---

## 0. 前置

- 仓库托管：GitHub / GitLab（Cloudflare Pages 支持的两家）
- Cloudflare 账号已开通（免费版即可）
- 本地构建已 OK：`pnpm build` → 产物在 `web/out/`

---

## 1. 仓库准备（一次性）

### 1.1 锁定包管理器为 pnpm

仓库里同时存在 `web/package-lock.json` 和 `web/pnpm-lock.yaml`，Cloudflare 默认会按 npm 走，导致和本地 pnpm 不一致。

**做法**：删掉 npm 锁文件，只保留 pnpm。

```bash
cd web
rm package-lock.json
git add -A && git commit -m "chore(web): drop npm lockfile, pin pnpm"
```

`package.json` 已经写了 `"packageManager": "pnpm@10.33.2"`，Cloudflare V2 build 会通过 Corepack 自动用上对应版本的 pnpm。

### 1.2 检查 Node 版本

`web/.nvmrc` 已写 `22`。Cloudflare V2 build 会自动读取。
> 如果以后要降到 Node 20 LTS，改 `.nvmrc` 就行。

---

## 2. Cloudflare Pages 配置

进 [Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git](https://dash.cloudflare.com/?to=/:account/pages)，
授权访问仓库，选 `claire`。

### 2.1 Build settings

| 字段 | 值 |
|---|---|
| **Project name** | `claires-parlor`（→ `claires-parlor.pages.dev`） |
| **Production branch** | `main` |
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `pnpm install --frozen-lockfile && pnpm build` |
| **Build output directory** | `out` |
| **Root directory (advanced)** | `web` |

> ⚠️ **Root directory 必须设成 `web`**，因为这是 monorepo（仓库根还有 `podcast/`）。

### 2.2 Environment variables（可选）

无外部 API、无需密钥。先留空。
未来如果接 Magic Link 邮箱登录之类的服务，再来这里加。

只需设一项：

| Variable | Value | 说明 |
|---|---|---|
| `NODE_VERSION` | `22` | 双保险，和 `.nvmrc` 配合 |

### 2.3 Save and Deploy

点 **Save and Deploy**，Cloudflare 会拉代码 → `pnpm install` → `pnpm build` → 把 `web/out/` 推到 CDN。
首次部署 1-3 分钟。

---

## 3. 验证

部署完进项目页面：

- 预览域：`https://claires-parlor.pages.dev`
- 检查每个房间路由能开：`/parlor` `/studio` `/studio/l1` `/workshop` `/cooperate` `/manifesto` `/bar` `/studio/ip` `/studio/bookshelf` `/studio/tunes`
- 检查 per-page halo 主题色生效（mint / sage / peach / sky / cream 各一页）
- 静态资源 `/_next/static/*` 响应头里能看到 `cache-control: public, max-age=31536000, immutable`（来自 `public/_headers`）

---

## 4. 后续：绑定 clairesparlor.com（之后再做）

1. Cloudflare Pages 项目 → Custom domains → Set up a custom domain
2. 输入 `clairesparlor.com`，照向导走（如果域名已经在 Cloudflare 托管，DNS 一键写入）
3. 加一条 `www.clairesparlor.com` 的 301 → apex（在 Pages 项目里就能配）
4. README 里的 badge 链接已经指向 `https://clairesparlor.com`，无需改

---

## 5. CI 行为

- **Push 到 `main`** → 触发生产部署 → 推到 `claires-parlor.pages.dev`
- **Push 到其他分支 / PR** → 触发预览部署 → 拿到一个 `<hash>.claires-parlor.pages.dev` 链接
- **Rollback**：Cloudflare Pages → Deployments → 选历史版本 → Rollback

---

## 6. 常见踩坑

| 症状 | 原因 | 解决 |
|---|---|---|
| Build 用 npm 而不是 pnpm | 仓库里还残留 `package-lock.json` | 删掉，commit |
| `Module not found` 在 CI 但本地正常 | Node 版本不一致 | 检查 `.nvmrc` 和 `NODE_VERSION` |
| `out/` 找不到 | Root directory 没设 `web` | 改 build settings |
| 首页 404 | Build output directory 写成了 `.next` 不是 `out` | 改成 `out` |
| 路由 404（如 `/studio/l1`） | `next.config.mjs` 的 `trailingSlash: true` 被改掉 | 保持 `true`，Cloudflare Pages 才能映射 `/studio/l1/index.html` |
