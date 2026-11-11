# Photography 雨幕修正方向

日期：2026-11-11。Owner 明确否决现有二维曲线效果，要求采用此前提供的 GitHub 项目。现有雨幕不能继续作为可接受的简化版本。

## 问题来源

当前 `script.js` 使用 `#rain-lines` 和 SVG path 生成少量曲线。前版交接把雨幕实现为二维面板，丢失原参考的密集光丝、空间纵深、光照反射、照片流与推进。这是实现取舍偏离目标，不是参考项目缺少可用源码。

## 应使用的具体参考

- 项目：https://github.com/HaichaoLihc/create-photo-flipbook-ui
- 正确子项目：`ui-collections/stream-implement-3d/`（Undertow），不要误用同仓库的翻书效果。
- 说明：https://github.com/HaichaoLihc/create-photo-flipbook-ui/blob/main/ui-collections/stream-implement-3d/README.md
- 核心代码目录：https://github.com/HaichaoLihc/create-photo-flipbook-ui/tree/main/ui-collections/stream-implement-3d/dist
- 许可：https://github.com/HaichaoLihc/create-photo-flipbook-ui/blob/main/LICENSE

本次已通过 GitHub 读取 README、根 LICENSE、目录以及 `dist/js/app.js` 和 `shaders.js`。README 明确说明：WebGL 2、2,400 条光丝、每条光丝展开照片故事；原生 JavaScript/CSS，无运行时依赖和构建步骤，`dist/` 本身就是可编辑源码。代码含相机缩放、光丝模拟、地面反射和 bloom。根许可为 MIT，复用代码时保留原版权和许可声明。

## 下一轮开发要求

1. 先单独运行原项目效果，确认密集光丝、波动、地面反射、空间推进及照片展开的基准。不要先自行重画一个“类似”的二维版本。
2. 以该子项目现有渲染和交互逻辑为基础集成 Photography。保留原有视觉机制，再适配本站入口、退出、手机尺寸、性能与减少动态效果。不要将“没依赖”误解为可以直接双击 HTML；其模块和 JSON 需要通过本地 HTTP 服务加载。
3. 原项目已列出 `app.js`、`shaders.js`、`gl.js`、`photos.js`、`catalog.js`、`stories.js`、`story.js`、`math.js` 等职责。接入时保持模块关系，处理原 hash 路由与本站 `#photography` 的冲突，避免进入后无法返回目录。
4. 摄影素材由本站替换；原仓库照片文件不在 Git 中，JSON 保存了演示图片及来源信息。不能把原演示照片、日记或署名当成 Owner 的作品。素材缺失与雨幕效果实现分别处理，缺素材不构成继续用二维曲线替代雨幕的理由。
5. WebGL 不支持等情况下可以提供清楚的降级入口，但常规支持设备应展示原效果，不能将降级页面作为主效果交付。
6. 提交原项目与接入后同一段操作的桌面/手机对比录屏：远景 → 缩放推进 → 照片故事 → 返回。包含手机触控、离页停止渲染、再次进入、失败状态的检查。

当前仅确定修正方向并准备交接，本轮没有移植源码或改动正式 Photography 页面。Owner 仍需审核新的邮票示意，之后按其安排交给开发方集中修改。
