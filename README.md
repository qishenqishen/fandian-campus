# 饭点 · 校园食堂点评推荐

固定公开地址：https://fandian-campus-qishen.qishen-qs.chatgpt.site

**更新时复用 `.openai/hosting.json` 中的 project_id，不要新建站点或修改 slug。**

本作品为交互式产品演示：按窗口逛招牌菜、发现菜品、食堂与组合筛选、条件选饭、评分与点评、收藏、食堂示意图、近期避雷情报。无需登录。

## 运行与检查

- `python3 -m http.server 4173 --directory dist --bind 127.0.0.1`
- `node --check dist/app.js`
- `node scripts/selfcheck.cjs`
- 无打包步骤，部署目录为 `dist`。

## 数据说明

华江大学为虚构演示校园。菜单、价格、评分、点评、排队时间及营业时间均为演示数据。图片为菜品示意，署名和开放许可在 `dist/assets/credits.json`，页面“数据与产品说明”内可查看。

收藏、用户点评及“有帮助”保存在当前浏览器 localStorage，不跨设备共享。选饭根据预算、口味、等待时间筛选并从符合条件的菜品中随机选择，优先评分≥4.5，不依赖在线模型。

## 产品结构

1. 发现好菜：搜索 → 食堂/价格/口味/时间 → 菜品详情 → 点评或收藏 → 找窗口。
2. 帮我选一顿：预算+口味+等待时间 → 在售候选 → 推荐理由 → 点评或重选。
3. 食堂地图：校园示意位置 → 食堂详情与营业时段 → 本食堂菜品。
4. 避雷情报：具体窗口、菜品、体验时间 → 关联点评 → 有帮助反馈。
5. 我的收藏：个人下次想吃清单，支持同样的筛选与排序。

## 发布

通过 Sites source workflow 将源码提交到同一站点仓库，打包静态资源后 save_site_version，再 deploy_site_version。站点受众设置为 public。不要提交临时凭证。

## GitHub 与固定提交域名

此仓库同时保留源码与 GitHub Pages 自动部署。推送到 `main` 会先执行语法与推荐逻辑自检，再发布 `dist/`。

面试提交入口继续使用文首的固定 Sites 域名。GitHub Pages 是备用部署，不替换该入口。Sites 与 Pages 是两个部署目标；只推送 GitHub 不会自动更新 Sites。后续修改需同步到原 Sites 项目并发布，保持 `.openai/hosting.json` 中的 project_id 和 slug 不变。

GitHub Pages 使用仓库名作为路径，因此请保留仓库所有者和仓库名称；不设置链接过期时间。持续可访问仍依赖账号、仓库和托管服务正常运行。

Pages 工作流参考 GitHub 官方文档：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
