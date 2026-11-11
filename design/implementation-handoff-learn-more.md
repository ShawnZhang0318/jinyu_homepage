# 全站实现交接 · Learn more 与转场复查

> 历史交付记录。邮票和 Photography 当前版本以 [本轮实现交接](implementation-handoff.md) 为准。

按 Owner 确认的 Learn more 草稿接入 Design。按最新反馈，About Me 正文后直接接邮票目录。最终验收由 Owner 决定。

## 本地查看

[首页](http://127.0.0.1:8765/) · [邮票目录](http://127.0.0.1:8765/#catalog) · [Design 时钟](http://127.0.0.1:8765/#design)。若服务已关闭，在 `E:\开源\小鱼个人主页` 运行：

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

| 审查项 | 修改与复现 |
| --- | --- |
| QA-F01 · 时钟与详情 | 从 Design 邮票进入，或直接打开 Design 链接。资源就绪后时钟自动播放，展示区的唯一操作是右下角 Learn more。点入时取最新曝光作品，尚未曝光则取第一张。详情桌面左图右文，手机上图下文；用左右按钮手动换作品，返回、Escape 或浏览器后退回到时钟并续播。 |
| QA-F02 · About Me 到邮票目录 | 从完整封面向下读完 About Me，继续滚动即可看到第三页。目录直接接在介绍区下方。 |
| QA-F03 · 连续推进 | 在时钟视图分几次向下滚动，时钟在顶栏下固定并放大、向右推进，最新海报脱离尾迹接入同一个详情。Learn more 沿用同一段推进，约 570ms。详情期间时钟冻结。 |

## 本轮截图与录屏

Edge 实际页面。桌面 1280×900，320×812 和 375×812 为触屏视口模拟。

| 画面 | 桌面 | 320px | 375px |
| --- | --- | --- | --- |
| Design 自动播放 | [截图](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/desktop-clock.jpg) | [截图](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/mobile320-clock.jpg) | [截图](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/mobile375-clock.jpg) |
| 时钟推进中 | [截图](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/desktop-clock-approach.jpg) | [截图](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/mobile320-clock-approach.jpg) | [截图](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/mobile375-clock-approach.jpg) |
| Learn more 详情 | [截图](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/desktop-detail.jpg) | [截图](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/mobile320-detail.jpg) | [截图](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/mobile375-detail.jpg) |

- 时钟自动播放、推进、手动切换与返回续播。桌面走滚轮，手机走 Learn more。[桌面录屏](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/desktop-clock-to-detail.webm) · [375px 录屏](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/mobile375-clock-to-detail.webm) · [320px 录屏](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/mobile320-clock-to-detail.webm)
- 减少动态效果。[320px 静态尾迹](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/mobile320-reduced-motion.jpg)

其余分类沿用全站第一版，旧截图只用于复看相应分类。[Marketing](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/full-site-v1/desktop-marketing.jpg) · [Campaign](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/full-site-v1/desktop-campaign-archive.jpg) · [Photography](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/full-site-v1/desktop-photography-rain.jpg) · [Video](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/full-site-v1/desktop-video.jpg)

## 实现选择与检查

- 对照确认草稿保留细线 Learn more、手动翻阅和完整海报，继续用站内顶栏。详情用现有高清 WebP，并保留查看原图。滚轮和点击共用一个推进终点，过渡中暂停并接走最新曝光作品，完成后手机详情可自然滚动。
- About Me 和目录在文档流中直接相邻，七段正文在介绍区内可连续阅读。
- About Me 左侧用同一张倒影的边缘镜像补齐横纹。倒影主体保持原有位移，以对齐封面树根。
- 三个视口验证自动播放、曝光坐标与角度固定、约 2.25 秒淡出移除、最多 15 张同时存在。Learn more 为桌面 144×44px、手机 140×44px，顶栏字号 13px，操作区至少 44px 高。复测滚轮中途折返、详情冻结、手动翻阅、焦点、后退、Escape、离页清理和减少动态效果。
- 用模拟页面可见性事件验证后台暂停和回前台恢复。真机、Safari、Firefox 和真实标签页切换仍待复查。正式素材到齐后需验证 QA-F04 的真实内容和媒体。[浏览器自测记录](C:/Users/30492/.codex/visualizations/2026/11/10/01a1c4e2-9873-7c00-9636-bd529c5ef467/learn-more-qa/checks.json)

## 剩余素材

| 类别 | 待提供 |
| --- | --- |
| Design | 15 张作品的正式名称、时间、职责、项目介绍，以及低分辨率作品的高清导出。 |
| Marketing | 真实案例名称、背景、方法、职责、成果和可公开的文件或图表。 |
| Campaign | 活动名称及分组、时间、职责、视觉物料、现场照片和记录。 |
| Photography | 摄影原图、分组及可公开的标题或说明。 |
| Video | 正式视频源、封面、片名、简介、职责和可用字幕。 |

## 代码位置

- `index.html` · About Me、邮票目录、Design 时钟与详情。
- `styles.css` · Learn more、共享推进场景、响应式详情与减少动态效果。
- `script.js` · 曝光、自动播放生命周期、推进计算、详情状态与浏览历史。
- `portfolio-content.js` · 其他分类的真实内容入口。当前保留明确的空状态。
