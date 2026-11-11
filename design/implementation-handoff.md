# 实现交接 · 邮票对角换位与 Photography 雨幕

两项已接入本地网站，待 Design QA Lead 统一复查，Owner 最终验收。此前的 [Learn more 与转场交接](implementation-handoff-learn-more.md) 可用于回看；其中旧 Photography 截图已失效。

## 查看方式

[邮票目录](http://127.0.0.1:8765/?v=stamp-undertow#catalog) · [Photography](http://127.0.0.1:8765/?v=stamp-undertow#photography)。服务若关闭，在 `E:\开源\小鱼个人主页` 运行：

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

- **邮票**：初始左上 Marketing、中央 Design、右下 Video。右滑或右箭头将 Marketing 移到中央，Design 退到右下；左滑或左箭头反向。再向左可从 Design 循环到 Video。五类按钮可直达，点击中央邮票进入，`← ALL` 返回目录。
- **雨幕**：进入 Photography 后等光丝落到水面。桌面滚轮推进，点击一条光丝，或用左右键选中、Enter 展开。手机双指缩放，轻点同一条光丝两次，先选中再展开。按左上的上箭头返回雨幕。顶部「摄影作品列表」是独立浏览入口。当前未收到正式摄影图，展开会显示「摄影原图待补充」。

## 实际画面与录屏

Edge 实际页面，桌面 1024×780；375×812 和 320×812 为触屏模拟。对照录屏中的照片是仅供测试的几何卡片，没有写入站点内容。

| 画面 | 桌面 | 手机 |
| --- | --- | --- |
| 邮票向右换位 | [开始](review/latest/stamps-desktop-before.jpg) · [途中](review/latest/stamps-desktop-middle.jpg) · [到位](review/latest/stamps-desktop-after.jpg) · [双向录屏](review/latest/stamps-desktop.webm) | [375px 途中](review/latest/stamps-375-middle.jpg) · [375px 触屏录屏](review/latest/stamps-375.webm) · [320px 途中](review/latest/stamps-320-middle.jpg) |
| 正式 Photography | [雨幕远景](review/latest/production-desktop-rain.jpg) | [雨幕远景](review/latest/site-empty-rain.jpg) · [照片空态](review/latest/site-empty-story.jpg) · [无 WebGL 的 320px](review/latest/production-320-webgl-unavailable.jpg) |
| Undertow 原版对照 | [远景 → 进入 → 展开 → 返回](review/latest/original-desktop.webm) | [375px 触屏录屏](review/latest/original-mobile.webm) |
| 站内 Undertow 对照 | [远景 → 进入 → 展开 → 返回](review/latest/site-desktop.webm) · [测试卡片展开](review/latest/site-desktop-story.jpg) | [375px 触屏录屏](review/latest/site-mobile.webm) · [测试卡片展开](review/latest/site-mobile-story.jpg) |

## 实现差异与检查

- 邮票沿用正式目录的字体、邮票样式和五类直达。对角位置在窄屏稍向内收，留住相邻票的名称。按 [Owner 确认示意](stamp-diagonal-motion-proposal.md) 保留约 850ms、60% 到 100% 的缩放、约 12° 摆正、主题过渡和同一批邮票节点的连续换位。已验证箭头、键盘、320/375px 横滑与纵向自然滚动、两端循环、分类直达、进入返回、减少动态效果及无横向溢出。
- 雨幕基于 [Undertow 原版源码](https://github.com/HaichaoLihc/create-photo-flipbook-ui/tree/d7a43c979e9a2fb709e985d8df8c0d9ba805d034/ui-collections/stream-implement-3d/dist)。保留 2,400 条光丝、原着色器、波动、地面倒影、泛光、相机缩放和照片流展开。站点顶栏留在场景外，故事切换只在场景内发生，地址仍为 `#photography`。离页和切换到作品列表都会卸载渲染。高分辨率下限制渲染像素数；减少动态效果时停止自动流动，仍可缩放和查看。
- 已分别运行原版与站内版，验证滚轮／双指推进、键盘／触屏选丝、照片解码与展开、返回、离页后浏览器后退重新加载。另查了无正式素材和无 WebGL 的浏览入口。录屏使用 Edge 软件渲染，帧率不代表真机表现。真机、Safari、Firefox、硬件 GPU 性能和正式摄影素材的最终画面待复查。
- 自测记录：[邮票](review/latest/stamps-checks.json) · [雨幕原版](review/latest/original-checks.json) · [站内雨幕](review/latest/site-checks.json) · [生产空态、减少动态效果与降级](review/latest/extras-checks.json)。

## 待补素材与代码

Photography 仍缺摄影原图、分组和标题／说明。其他类别沿用上一轮的[素材清单](implementation-handoff-learn-more.md#剩余素材)。本轮无需额外 Owner 决定即可打开预览；最终视觉与真实素材仍由 Design QA Lead 和 Owner 检查。

- `index.html`、`styles.css`、`script.js`：邮票轨道、手势与分类入口；Photography 场景挂载和退出。
- `public/undertow/`：固定版本源码、本站适配和 [MIT 许可](../public/undertow/LICENSE)；`portfolio-content.js` 是正式摄影素材入口。
