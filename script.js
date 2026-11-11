const catalog = document.querySelector("#catalog");
const stampEntry = document.querySelector("#stamp-entry");
const portfolio = document.querySelector("#portfolio");
const home = document.querySelector("body > main");
const siteFooter = document.querySelector(".site-footer");
const workPages = [...portfolio.querySelectorAll(".work")];
const categories = [
  { id: "design", title: "Design", subtitle: "平面设计作品集" },
  { id: "marketing", title: "Marketing", subtitle: "商业分析作品集" },
  { id: "campaign", title: "Campaign", subtitle: "活动策划作品集" },
  { id: "photography", title: "Photography", subtitle: "摄影集" },
  { id: "video", title: "Video", subtitle: "视频设计作品集" }
];
const themeButtons = [...catalog.querySelectorAll("[data-theme-choice]")];
const stampSelector = catalog.querySelector(".stamp-selector");
const stampTrack = catalog.querySelector(".stamp-track");
const stampTemplate = catalog.querySelector("#stamp-template");
const stampArrows = [...catalog.querySelectorAll("[data-step]")];
const stamps = categories.map(({ id, title }, index) => {
  const stamp = stampTemplate.content.firstElementChild.cloneNode(true);
  stamp.dataset.theme = id;
  stamp.querySelector(".stamp-code b").textContent = String(index + 1).padStart(2, "0");
  stamp.querySelector(".stamp-name").textContent = title.toUpperCase();
  stampTrack.append(stamp);
  return stamp;
});
let active = "";
let selectedTheme = 0;
let stampFrame = 0;
let stampProgress = 0;

const wrapTheme = index => (index + categories.length) % categories.length;

function renderStamps(progress) {
  stampProgress = progress;
  const width = stampTrack.clientWidth;
  const height = stampTrack.clientHeight;
  const side = width < 600 ? .35 : .44;
  stamps.forEach((stamp, index) => {
    const slot = wrapTheme(selectedTheme - index + 2) - 2 + progress;
    const distance = Math.abs(slot);
    const beyond = Math.max(0, distance - 1);
    const x = Math.sign(slot) * width * (Math.min(distance, 1) * side + beyond * .25);
    const y = Math.sign(slot) * height * (Math.min(distance, 1) * .38 + beyond * .4);
    const scale = 1 - Math.min(distance, 1) * .4;
    stamp.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${slot * 12}deg)`;
    stamp.style.opacity = Math.max(0, 1 - beyond);
    stamp.style.zIndex = 10 - Math.round(distance * 3);
    stamp.dataset.slot = slot;
  });
}

function setThemeLabels(index) {
  const { id, title, subtitle } = categories[index];
  catalog.dataset.theme = id;
  document.querySelector("#catalog-title").textContent = title.toUpperCase();
  document.querySelector("#catalog-subtitle").textContent = subtitle;
  themeButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
}

function selectTheme(index) {
  cancelAnimationFrame(stampFrame);
  stampFrame = 0;
  selectedTheme = wrapTheme(index);
  setThemeLabels(selectedTheme);
  const { id, title } = categories[selectedTheme];
  stampEntry.href = "#" + id;
  stampEntry.setAttribute("aria-label", "打开 " + title + " 作品集");
  stampArrows.forEach(button => button.removeAttribute("aria-disabled"));
  renderStamps(0);
}

function moveStamp(direction) {
  if (stampFrame) return;
  const next = wrapTheme(selectedTheme + direction);
  if (reducedMotion.matches) {
    selectTheme(next);
    return;
  }
  setThemeLabels(next);
  stampArrows.forEach(button => button.setAttribute("aria-disabled", "true"));
  const started = performance.now();
  function advance(now) {
    const t = Math.min(1, (now - started) / 850);
    if (t === 1 || reducedMotion.matches) selectTheme(next);
    else {
      renderStamps(direction * smoothProgress(t));
      stampFrame = requestAnimationFrame(advance);
    }
  }
  stampFrame = requestAnimationFrame(advance);
}

new ResizeObserver(() => renderStamps(stampProgress)).observe(stampTrack);
themeButtons.forEach((button, index) => button.addEventListener("click", () => selectTheme(index)));
stampArrows.forEach(button => button.addEventListener("click", () => moveStamp(Number(button.dataset.step))));
catalog.addEventListener("keydown", event => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  moveStamp(event.key === "ArrowRight" ? 1 : -1);
});

let stampGesture;
let suppressStampClick = false;
stampSelector.addEventListener("pointerdown", event => {
  suppressStampClick = false;
  if (!event.isPrimary || event.button !== 0 || event.target.closest("button")) return;
  stampGesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
});
window.addEventListener("pointercancel", event => {
  if (stampGesture?.id === event.pointerId) stampGesture = null;
});
window.addEventListener("pointerup", event => {
  if (stampGesture?.id !== event.pointerId) return;
  const x = event.clientX - stampGesture.x;
  const y = event.clientY - stampGesture.y;
  stampGesture = null;
  if (Math.abs(x) < 36 || Math.abs(x) < Math.abs(y) * 1.25) return;
  suppressStampClick = true;
  moveStamp(x > 0 ? 1 : -1);
});
stampEntry.addEventListener("click", event => {
  if (!stampFrame && !(suppressStampClick && event.detail)) return;
  event.preventDefault();
  suppressStampClick = false;
});

const designPage = document.querySelector(".design-page");
const designJourney = designPage.querySelector(".design-journey");
const designScene = designPage.querySelector(".design-scene");
const clockView = designPage.querySelector(".design-clock");
const clockStage = designPage.querySelector(".clock-stage");
const clockTrail = clockStage.querySelector(".image-trail");
const clockHour = clockStage.querySelector(".hour");
const clockMinute = clockStage.querySelector(".minute");
const clockSecond = clockStage.querySelector(".second");
const learnMore = designPage.querySelector(".clock-learn");
const clockBack = designPage.querySelector(".clock-back");
const designGallery = designPage.querySelector(".design-gallery");
const galleryPoster = designGallery.querySelector(".gallery-poster");
const galleryError = designGallery.querySelector(".poster-error");
const posterOriginal = document.querySelector("#poster-original");
const posterFlight = designPage.querySelector(".poster-flight");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const posterNames = [
  "C罗1", "C罗2", "C罗3", "C罗4", "everyone", "哈姆雷特", "大客厅", "女模特",
  "时光博物馆", "时光博物馆2", "构成艺术", "艺术中心", "霸王别姬", "青花瓷", "音墙"
];
const exposureInterval = 150;
const exposureLifetime = 2250;
const initialAngle = 42;
const degreesPerMs = 360 / 7200;
const exposures = [];
let posterImages = [];
let posterLoad;
let elapsed = 0;
let nextExposure = 0;
let lastFrame = null;
let clockFrame = 0;
let designDetail = false;
let posterIndex = 0;
let posterRequest = 0;
let movingPoster;
let detailScrollFrame = 0;

function pointHand(hand, angle) {
  hand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

function drawClock() {
  while (exposures.length && elapsed - exposures[0].born >= exposureLifetime) {
    exposures.shift().image.remove();
  }
  while (posterImages.length && nextExposure * exposureInterval <= elapsed) {
    leaveExposure(nextExposure++);
  }
  for (const { image, born } of exposures) {
    image.style.opacity = Math.pow(1 - (elapsed - born) / exposureLifetime, .78);
  }
  pointHand(clockHour, 3 + elapsed / 86400);
  pointHand(clockMinute, 28 + elapsed / 3600);
  pointHand(clockSecond, (initialAngle + elapsed * degreesPerMs) % 360);
}

function leaveExposure(sequence) {
  const born = sequence * exposureInterval;
  const angle = (initialAngle + born * degreesPerMs) % 360;
  const radians = angle * Math.PI / 180;
  const { image: thumbnail, index } = posterImages[sequence % posterImages.length];
  const image = thumbnail.cloneNode();
  image.className = "trail-image";
  image.style.transform = `translate(-50%, -50%)
    translate(calc(var(--trail-radius) * ${Math.sin(radians)}), calc(var(--trail-radius) * ${-Math.cos(radians)}))
    rotate(${angle}deg)`;
  clockTrail.append(image);
  exposures.push({ image, born, angle, index });
}

function animateDesignClock(now) {
  if (lastFrame !== null) elapsed += Math.min(now - lastFrame, 80);
  lastFrame = now;
  drawClock();
  clockFrame = requestAnimationFrame(animateDesignClock);
}

function pauseDesignClock() {
  cancelAnimationFrame(clockFrame);
  clockFrame = 0;
  lastFrame = null;
}

function syncClock() {
  if (active !== "design" || designDetail || movingPoster || document.hidden || !posterImages.length) {
    pauseDesignClock();
    return;
  }
  if (reducedMotion.matches) {
    pauseDesignClock();
    if (!exposures.length) elapsed = 1800;
    drawClock();
  } else if (!clockFrame) {
    clockFrame = requestAnimationFrame(animateDesignClock);
  }
}

function startDesignPreview() {
  drawClock();
  // Decode the small copies before starting the dial.
  posterLoad ??= Promise.allSettled(posterNames.map(async (name, index) => {
    const image = new Image();
    image.src = `public/assets/design-clock/${name}.jpg`;
    image.alt = "";
    image.draggable = false;
    await image.decode();
    return { image, index };
  })).then(results => {
    posterImages = results.filter(result => result.status === "fulfilled").map(result => result.value);
    if (posterImages.length < posterNames.length) posterLoad = null;
    syncClock();
  });
  syncClock();
}

function resetDesignPreview() {
  pauseDesignClock();
  cancelAnimationFrame(detailScrollFrame);
  detailScrollFrame = 0;
  clearPosterFlight();
  clockTrail.replaceChildren();
  exposures.length = 0;
  elapsed = 0;
  nextExposure = 0;
  posterRequest++;
  posterIndex = 0;
  galleryPoster.removeAttribute("src");
  designDetail = false;
  designPage.dataset.view = "clock";
  clockView.inert = false;
  designGallery.inert = true;
}

new ResizeObserver(([entry]) => {
  const { width, height } = entry.contentRect;
  if (width && height) clockStage.style.setProperty("--trail-radius", `${Math.min(width * .32, height * .34)}px`);
}).observe(clockStage);

function showPoster(index, thumbnail) {
  posterIndex = (index + posterNames.length) % posterNames.length;
  const name = posterNames[posterIndex];
  const position = `${String(posterIndex + 1).padStart(2, "0")} / ${posterNames.length}`;
  document.querySelector("#poster-name").textContent = name;
  document.querySelector("#poster-position").textContent = position;
  document.querySelector("#poster-announced-position").textContent = position;
  posterOriginal.href = `可使用图片/作品集/${name}.${name === "青花瓷" ? "png" : "jpg"}`;
  galleryError.hidden = true;
  galleryPoster.alt = name + " · 平面设计海报";
  if (thumbnail) galleryPoster.src = thumbnail.src;
  else galleryPoster.removeAttribute("src");

  const request = ++posterRequest;
  const image = new Image();
  image.src = `public/assets/design-gallery/${name}.webp`;
  image.decode().then(() => {
    if (request === posterRequest) galleryPoster.src = image.src;
  }).catch(() => {
    if (request === posterRequest && !thumbnail) galleryError.hidden = false;
  });
}

function clearPosterFlight() {
  movingPoster?.image?.classList.remove("lifted");
  movingPoster = null;
  posterFlight.hidden = true;
  posterFlight.removeAttribute("src");
  designScene.style.setProperty("--approach", "0");
}

function beginPosterFlight() {
  pauseDesignClock();
  const exposure = exposures.at(-1);
  const image = exposure?.image;
  showPoster(exposure?.index ?? 0, image);
  movingPoster = { image };
  if (!image || reducedMotion.matches) return;

  const box = image.getBoundingClientRect();
  const scene = designScene.getBoundingClientRect();
  const ratio = image.naturalWidth / image.naturalHeight;
  const width = Math.min(image.offsetWidth, image.offsetHeight * ratio);
  movingPoster.source = {
    x: box.left + box.width / 2 - scene.left,
    y: box.top + box.height / 2 - scene.top,
    width, ratio, angle: exposure.angle > 180 ? exposure.angle - 360 : exposure.angle
  };
  posterFlight.src = image.src;
  posterFlight.hidden = false;
  image.classList.add("lifted");
}

function drawPosterFlight(progress) {
  designScene.style.setProperty("--approach", progress);
  const source = movingPoster.source;
  if (!source) return;
  const stage = designScene.getBoundingClientRect();
  const target = galleryPoster.getBoundingClientRect();
  const t = smoothProgress(progress);
  const width = Math.min(target.width, target.height * source.ratio);
  posterFlight.style.left = `${mix(source.x, target.left + target.width / 2 - stage.left, t)}px`;
  posterFlight.style.top = `${mix(source.y, target.top + target.height / 2 - stage.top, t)}px`;
  posterFlight.style.width = `${mix(source.width, width, t)}px`;
  posterFlight.style.aspectRatio = source.ratio;
  posterFlight.style.transform = `translate(-50%, -50%) rotate(${source.angle * (1 - t)}deg)`;
}

function setDesignView(nextDetail, moveFocus) {
  cancelAnimationFrame(detailScrollFrame);
  detailScrollFrame = 0;
  if (nextDetail && !movingPoster && !designDetail) beginPosterFlight();
  designDetail = nextDetail;
  designPage.dataset.view = nextDetail ? "detail" : "clock";
  clockView.inert = nextDetail;
  designGallery.inert = !nextDetail;
  clearPosterFlight();
  portfolio.scrollTop = 0;
  syncClock();
  if (moveFocus) (nextDetail ? clockBack : learnMore).focus({ preventScroll: true });
}

function completeDesignApproach() {
  history.pushState({ designReturn: true }, "", "#design/detail");
  setDesignView(true, true);
}

function designDistance() {
  return designJourney.offsetHeight - designScene.offsetHeight;
}

learnMore.addEventListener("click", () => {
  if (reducedMotion.matches || designDistance() < 1) {
    completeDesignApproach();
    return;
  }
  if (detailScrollFrame) return;
  if (!movingPoster) beginPosterFlight();
  const from = portfolio.scrollTop;
  const start = performance.now();
  function advance(now) {
    if (active !== "design" || designDetail) return;
    const t = clampProgress((now - start) / 570);
    portfolio.scrollTop = mix(from, designDistance(), smoothProgress(t));
    if (t < 1) detailScrollFrame = requestAnimationFrame(advance);
    else detailScrollFrame = 0;
  }
  detailScrollFrame = requestAnimationFrame(advance);
});

function returnToClock() {
  if (history.state?.designReturn) history.back();
  else {
    history.replaceState(null, "", "#design");
    setDesignView(false, true);
  }
}

clockBack.addEventListener("click", returnToClock);
document.querySelectorAll("[data-poster-step]").forEach(button => {
  button.addEventListener("click", () => showPoster(posterIndex + Number(button.dataset.posterStep)));
});

const detail = document.querySelector("#detail-dialog");
const detailBody = document.querySelector("#detail-body");

function openDetail(title, description, media) {
  document.querySelector("#detail-title").textContent = title;
  clearDetail();
  if (description) detailBody.append(makeText("p", description));
  if (media?.kind === "video") {
    const player = document.createElement("video");
    const status = makeText("p", "正在载入视频…");
    status.setAttribute("role", "status");
    player.controls = true;
    player.playsInline = true;
    if (media.cover) player.poster = media.cover;
    if (media.captions) {
      const track = document.createElement("track");
      track.kind = "captions";
      track.label = "中文字幕";
      track.srclang = "zh";
      track.src = media.captions;
      player.append(track);
    }
    player.addEventListener("loadeddata", () => { status.textContent = ""; });
    player.addEventListener("playing", () => { status.textContent = ""; });
    player.addEventListener("ended", () => { status.textContent = "播放结束。可使用播放器重新播放。"; });
    player.addEventListener("error", () => { status.textContent = "视频未能载入。请关闭后重试，或检查文件是否可用。"; });
    detailBody.append(player, status);
    player.src = media.src;
    detail.showModal();
    player.play().catch(() => {}); // The native play button is available if autoplay is denied.
    return;
  }
  if (media?.src) detailBody.prepend(mediaImage(media.src, media.alt || title));
  detail.showModal();
}

function clearDetail() {
  const player = detailBody.querySelector("video");
  if (player) {
    player.pause();
    player.removeAttribute("src");
    player.load();
  }
  detailBody.replaceChildren();
}

detail.addEventListener("close", () => {
  if (!detail.open) clearDetail();
});

function makeText(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function mediaImage(src, alt) {
  const image = new Image();
  image.alt = alt;
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => {
    image.replaceWith(makeText("span", "图片未能载入", "media-empty"));
  });
  image.src = src;
  return image;
}

const folders = document.querySelector("#folder-stack");
const marketingRecords = portfolioContent.marketing.length ? portfolioContent.marketing :
  Array.from({ length: 4 }, (_, index) => ({
    title: "档案位 " + String(index + 1).padStart(2, "0"),
    summary: "案例资料待补充",
    description: "案例名称、简述及成果资料待补充。"
  }));

marketingRecords.forEach((record, index) => {
  const folder = document.createElement("button");
  folder.type = "button";
  folder.className = "folder";
  folder.style.setProperty("--folder-offset", index % 2);
  folder.setAttribute("aria-haspopup", "dialog");
  folder.append(makeText("span", String(index + 1).padStart(2, "0"), "folder-tab"),
    makeText("strong", record.title), makeText("span", record.summary, "folder-summary"));
  folder.addEventListener("click", () => openDetail(record.title, record.description || record.summary));
  folders.append(folder);
});

const campaignGroups = portfolioContent.campaign.length ? portfolioContent.campaign : [
  { title: "分组位 01 · 待补充", media: [] },
  { title: "分组位 02 · 待补充", media: [] }
];
const campaignStage = document.querySelector(".campaign-stage");
const campaignArchive = document.querySelector("#campaign-archive");
const campaignGroup = document.querySelector("#campaign-group");
const campaignClose = document.querySelector("#campaign-close");
const collage = document.querySelector("#campaign-collage");
const truck = document.querySelector(".truck");

function artworkCard(record) {
  const card = document.createElement(record.src ? "button" : "article");
  card.className = "media-card";
  if (record.src) {
    card.type = "button";
    card.setAttribute("aria-haspopup", "dialog");
    card.append(mediaImage(record.src, record.alt || record.title));
    card.addEventListener("click", () => openDetail(record.title, record.description, record));
  } else {
    card.append(makeText("span", record.placeholder, "media-empty"));
  }
  card.append(makeText("span", record.title, "media-caption"));
  return card;
}

function showCampaignGroup() {
  const group = campaignGroups[Number(campaignGroup.value)];
  const records = group.media.length ? group.media : [
    { title: "活动现场", placeholder: "照片待补充" },
    { title: "活动视觉", placeholder: "物料待补充" },
    { title: "活动记录", placeholder: "记录待补充" }
  ];
  collage.replaceChildren(...records.map(artworkCard));
}

function setCampaignOpen(open, moveFocus = true) {
  campaignArchive.hidden = !open;
  campaignStage.classList.toggle("expanded", open);
  truck.setAttribute("aria-expanded", String(open));
  if (open) showCampaignGroup();
  if (moveFocus) (open ? campaignGroup : truck).focus();
}

campaignGroups.forEach((group, i) => campaignGroup.add(new Option(group.title, i)));
campaignGroup.addEventListener("change", showCampaignGroup);
truck.addEventListener("click", () => setCampaignOpen(campaignArchive.hidden));
campaignClose.addEventListener("click", () => setCampaignOpen(false));

const undertowHost = document.querySelector("#undertow-host");
const photoView = document.querySelector("#photo-view");
const photoExhibit = document.querySelector("#photo-exhibit");
const photoRecords = portfolioContent.photography.length ? portfolioContent.photography :
  [{ title: "摄影展位", placeholder: "摄影原图待补充" }];
document.querySelector("#photo-collection").append(...photoRecords.map(artworkCard));

function setPhotographyView(mode) {
  const showList = mode === "list";
  photoExhibit.hidden = !showList;
  undertowHost.hidden = showList;
  photoView.textContent = showList ? "返回雨幕" : "摄影作品列表";
  photoView.setAttribute("aria-expanded", showList);

  if (mode !== "rain") {
    // Dropping the browsing context also releases Undertow's renderer and input listeners.
    undertowHost.replaceChildren();
  } else if (!undertowHost.firstElementChild) {
    const frame = document.createElement("iframe");
    frame.title = "Photography · 摄影雨幕";
    frame.src = "public/undertow/index.html";
    undertowHost.append(frame);
  }
}

photoView.addEventListener("click", () => {
  setPhotographyView(photoExhibit.hidden ? "list" : "rain");
  portfolio.scrollTop = 0;
});

const videoCollection = document.querySelector("#video-collection");
const videoRecords = portfolioContent.videos.length ? portfolioContent.videos : [
  { title: "视频展位 01" }, { title: "视频展位 02" }, { title: "视频展位 03" }
];

videoRecords.forEach(record => {
  const card = document.createElement(record.src ? "button" : "article");
  card.className = "video-card";
  if (record.cover) card.append(mediaImage(record.cover, record.title + " · 封面"));
  else card.append(makeText("span", "封面待补充", "video-cover-empty"));
  card.append(makeText("strong", record.title),
    makeText("span", record.src ? "播放视频 ↗" : "视频文件待补充"));
  if (record.src) {
    card.type = "button";
    card.setAttribute("aria-haspopup", "dialog");
    card.addEventListener("click", () => openDetail(record.title, record.description, { ...record, kind: "video" }));
  }
  videoCollection.append(card);
});

const clampProgress = value => Math.max(0, Math.min(1, value));
const mix = (start, end, t) => start + (end - start) * t;
const smoothProgress = t => t * t * (3 - 2 * t);
let workScrollFrame = 0;

function updateWorkScroll() {
  workScrollFrame = 0;
  if (active === "design" && !designDetail && !reducedMotion.matches) {
    const distance = designDistance();
    const progress = clampProgress(portfolio.scrollTop / Math.max(1, distance));
    if (progress > 0) {
      if (!movingPoster) beginPosterFlight();
      drawPosterFlight(progress);
      if (portfolio.scrollTop >= distance - 1) completeDesignApproach();
    } else if (movingPoster && !detailScrollFrame) {
      clearPosterFlight();
      syncClock();
    }
  }
}

portfolio.addEventListener("scroll", () => { workScrollFrame ||= requestAnimationFrame(updateWorkScroll); }, { passive: true });
window.addEventListener("resize", () => {
  workScrollFrame ||= requestAnimationFrame(updateWorkScroll);
});

function readRoute() {
  return location.hash.slice(1) || "cover";
}

function showRoute(route, moveFocus = true) {
  const pageId = route === "design/detail" ? "design" : route;
  const category = categories.findIndex(item => item.id === pageId);
  if (detail.open) detail.close();
  if (active === "design") {
    if (pageId === "design") {
      setDesignView(route === "design/detail", moveFocus);
      return;
    }
    resetDesignPreview();
  }
  active = category < 0 ? "" : pageId;
  portfolio.hidden = !active;
  home.inert = Boolean(active);
  siteFooter.inert = Boolean(active);
  document.body.classList.toggle("work-open", Boolean(active));
  workPages.forEach(page => { page.hidden = page.dataset.page !== active; });
  setPhotographyView(active === "photography" ? "rain" : "inactive");
  if (active) {
    selectTheme(category);
    portfolio.scrollTop = 0;
    if (active === "design") {
      startDesignPreview();
      setDesignView(route === "design/detail", moveFocus && route === "design/detail");
    }
    if (active === "campaign") {
      campaignGroup.selectedIndex = 0;
      setCampaignOpen(false, false);
    }
    if (moveFocus && !designDetail) portfolio.querySelector(".portfolio-bar a").focus({ preventScroll: true });
    updateWorkScroll();
    return;
  }
  const section = route === "catalog" ? catalog : document.getElementById(route === "about" ? "about" : "cover");
  if (moveFocus) {
    const target = route === "catalog" ? stampEntry : section;
    if (target === section) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
  section.scrollIntoView({ behavior: "auto" });
}

function navigate(route) {
  if (readRoute() !== route) history.pushState(null, "", "#" + route);
  showRoute(route);
}

[...document.querySelectorAll("[data-nav]"), stampEntry].forEach(link => {
  link.addEventListener("click", event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
    event.preventDefault();
    navigate(link.dataset.nav || categories[selectedTheme].id);
  });
});

window.addEventListener("popstate", () => showRoute(readRoute()));
document.addEventListener("keydown", event => {
  if (event.key !== "Escape" || !active || detail.open) return;
  if (active === "design" && designDetail) returnToClock();
  else if (active === "design" && movingPoster) setDesignView(false, true);
  else navigate("catalog");
});
document.addEventListener("visibilitychange", () => {
  syncClock();
  if (document.hidden) detailBody.querySelector("video")?.pause();
});
window.addEventListener("pagehide", () => {
  pauseDesignClock();
  detailBody.querySelector("video")?.pause();
});
window.addEventListener("pageshow", syncClock);
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches && movingPoster) setDesignView(false, false);
  syncClock();
});

selectTheme(0);
history.scrollRestoration = "manual";
showRoute(readRoute(), false);
