# 赵靖瑜个人作品集

这是一个原生 HTML、CSS 和 JavaScript 的作品集网站，不需要安装构建工具或依赖。Photography 雨幕使用浏览器 WebGL 2 模块，需要通过本地 HTTP 服务运行。

## 本地预览

在项目目录启动：

\`\`\`powershell
python -m http.server 8765 --bind 127.0.0.1
\`\`\`

打开 [http://127.0.0.1:8765/](http://127.0.0.1:8765/)。

首页向下滚动可进入 About Me 和五类邮票目录。可直接用这些地址预览：

- [邮票目录](http://127.0.0.1:8765/#catalog)：滑动或箭头连续切换邮票；五类按钮可直接选择分类。
- [Design](http://127.0.0.1:8765/#design)：自动播放作品时钟，点击 Learn more 浏览详情。
- [Photography](http://127.0.0.1:8765/#photography)：WebGL 2 雨幕；滚轮或双指缩放，选中光丝后可展开摄影作品。

## 内容与项目文件

在 [portfolio-content.js](portfolio-content.js) 添加已经确认可以公开的 Marketing、Campaign、Photography 与 Video 内容。没有素材的类别会显示待补充状态。Design 海报使用 `public/assets/design-clock/` 和 `public/assets/design-gallery/` 中的图像。Undertow 源码与 MIT 许可位于 `public/undertow/`。

封面、About Me 背景和人物原图作为网站资源保存在 `public/assets/`，文件与原图哈希一致。新增素材时，请保留原件，并按需导出网页资源到此目录。不要把审核用的测试卡片当作正式作品。

[当前实现交接、截图和录屏](design/implementation-handoff.md)记录了页面入口、交互步骤、检查结果与待补素材。[Undertow 上游来源及本站改动](public/undertow/UPSTREAM.md)。
