# 工作台产品目录

入口 `/studio/products/`，工作台 `/studio/` 顶部提供产品卡片。

目录数据在 `lib/products.json`，由 `lib/content.ts` 导出。每个产品保留独立 id、固定 href、简介、预览和实际状态；新增产品时追加条目，不覆盖已有网址。只收录已准备好给访客使用的产品，不添加虚构占位。

首个产品：全球杂志书架 `/studio/products/reading-room/`。静态 HTML 位于 `public/studio/products/reading-room/index.html`，26张公开封面已内嵌；原始聊天截图、私有笔记与开发记录不发布。入口使用普通 a 链接，避免 Next 客户端路由把独立 HTML 当成应用路由。

书架的收藏与笔记仅保存在访客自己的浏览器，可导出备份，不发送到服务端。刊物核验日为2026-09-18；页面发布不表示期刊数据自动更新。

发布流程沿用 DEPLOY.md：本地构建成功、检查实际差异、合并主分支后由现有 Cloudflare 流程发布。
