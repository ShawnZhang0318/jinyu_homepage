const shell=document.querySelector("#portfolio");
const pages=[...document.querySelectorAll(".work")];
let active="",designIndex=0,wheelProgress=0,rainProgress=0,clockRaf=0,clockStartedAt=0;
const designs=[
  ["概念海报 · 让想法被看见","art-poster"],["刊物练习 · 静谧的一期","art-editorial"],["色彩研究 · 日常的温度","art-color"],["作品集封面 · Bare Branches","art-cover"],["字形练习 · 字与形","art-type"],["版式研究 · Layout as language","art-grid"]
];
const cover=document.querySelector("#cover"),aboutSection=document.querySelector("#about");
const coverShutters=document.querySelector(".cover-shutters"),shutterFrame=document.querySelector(".shutter-frame");
const shutterSlats=Array.from({length:10},(_,index)=>{
  const slat=document.createElement("span");slat.className="shutter-slat";
  slat.style.setProperty("--row-top",`${index*10}%`);
  slat.innerHTML='<i class="shutter-face shutter-front"></i><i class="shutter-face shutter-back"></i>';
  shutterFrame.append(slat);return slat;
});
let coverTransitioning=false,coverStartTime=0,coverScrollStart=0,coverScrollEnd=0,coverScrollBehavior="";
const coverTransitionDuration=1750;
function easeTransition(value){return value<.5?4*value*value*value:1-Math.pow(-2*value+2,3)/2}
function animateCoverTransition(now){
  const progress=Math.min(1,(now-coverStartTime)/coverTransitionDuration);
  const eased=easeTransition(progress);
  window.scrollTo(0,coverScrollStart+(coverScrollEnd-coverScrollStart)*eased);
  const stagger=.045,span=1-stagger*(shutterSlats.length-1);
  shutterSlats.forEach((slat,index)=>{
    const local=Math.max(0,Math.min(1,(progress-stagger*index)/span));
    slat.style.transform=`rotateX(${easeTransition(local)*180}deg)`;
  });
  if(progress<1){requestAnimationFrame(animateCoverTransition);return}
  window.scrollTo(0,coverScrollEnd);
  coverShutters.classList.add("done");coverShutters.classList.remove("active");
  document.documentElement.style.scrollBehavior=coverScrollBehavior;
  coverTransitioning=false;
}
function startCoverTransition(){
  if(coverTransitioning||!shell.hidden)return;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){aboutSection.scrollIntoView({behavior:"auto"});return}
  coverTransitioning=true;
  const imageRect=document.querySelector(".cover-art").getBoundingClientRect();
  shutterSlats.forEach((slat,index)=>{
    const rowTop=window.innerHeight*index/shutterSlats.length;
    slat.style.setProperty("--photo-left",`${imageRect.left}px`);
    slat.style.setProperty("--photo-top",`${imageRect.top-rowTop}px`);
    slat.style.setProperty("--photo-width",`${imageRect.width}px`);
    slat.style.setProperty("--photo-height",`${imageRect.height}px`);
    slat.style.transform="rotateX(0deg)";
  });
  coverScrollStart=window.scrollY;coverScrollEnd=coverScrollStart+aboutSection.getBoundingClientRect().top;
  coverScrollBehavior=document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior="auto";
  coverStartTime=performance.now();coverShutters.classList.remove("done");coverShutters.classList.add("active");
  requestAnimationFrame(animateCoverTransition);
}
cover.addEventListener("click",event=>{
  if(event.target.closest(".scroll-cue"))event.preventDefault();
  startCoverTransition();
});
window.addEventListener("wheel",event=>{
  if(coverTransitioning){event.preventDefault();return}
  if(!shell.hidden||event.deltaY<=0||cover.getBoundingClientRect().bottom<window.innerHeight*.4)return;
  event.preventDefault();startCoverTransition();
},{passive:false});
function navState(target){document.querySelectorAll(".nav-link").forEach(x=>x.classList.toggle("active",x.dataset.nav===target))}
function openWork(name){
  active=name;shell.hidden=false;pages.forEach(x=>x.hidden=x.dataset.page!==name);shell.scrollTop=0;navState("all");
  if(name==="design")resetDesign();
  if(name==="campaign"){document.querySelector(".campaign-stage").classList.remove("open")}
  if(name==="photography")resetRain();
}
function closeWork(where){
  shell.hidden=true;document.querySelector(".design-page").classList.remove("show-spot");document.querySelector(".lightbox").classList.remove("open");
  if(where==="about"){navState("about");document.querySelector("#about").scrollIntoView({behavior:"smooth"})}
  else if(where==="cover"){navState("");document.querySelector("#cover").scrollIntoView({behavior:"smooth"})}
  else{navState("all");document.querySelector("#catalog").scrollIntoView({behavior:"smooth"})}
}
document.querySelectorAll("[data-nav]").forEach(x=>x.addEventListener("click",e=>{e.preventDefault();closeWork(x.dataset.nav==="about"?"about":x.dataset.nav==="cover"?"cover":"all")}));
document.querySelectorAll("[data-open]").forEach(x=>x.addEventListener("click",()=>openWork(x.dataset.open)));
function updateDesign(){
  const [name,cls]=designs[designIndex], spot=document.querySelector(".spotlight"), index=String(designIndex+1).padStart(2,"0")+" / 06";
  spot.querySelector(".spot-count").textContent=index;spot.querySelector(".spot-name").textContent=name;
  const source=document.querySelector(".o"+(designIndex+1)+" .art"), art=document.createElement("div");
  art.className="art "+cls;
  if(source&&source.querySelector("img")){const img=source.querySelector("img").cloneNode(true);img.alt="个人作品集封面设计";art.append(img)}
  else if(source)art.innerHTML=source.innerHTML;
  spot.querySelector(".spot-art").replaceChildren(art);
}
const secondHand=document.querySelector(".second");
const orbitCards=[...document.querySelectorAll(".orbit")];
const clockRevolution=30000;
function animateClock(now){
  if(active!=="design"||shell.hidden){clockRaf=0;return}
  const sweep=(now-clockStartedAt)/clockRevolution*360;
  secondHand.style.transform=`translateX(-50%) rotate(${sweep%360}deg)`;
  orbitCards.forEach((card,index)=>{
    const progress=Math.max(0,Math.min(1,(sweep-index*60)/60));
    const reveal=progress*progress*(3-2*progress);
    card.style.opacity=reveal.toFixed(3);
    card.style.transform=`translateY(${(1-reveal)*10}px) scale(${.94+reveal*.06})`;
  });
  clockRaf=requestAnimationFrame(animateClock);
}
function resetDesign(){
  designIndex=0;wheelProgress=0;document.querySelector(".design-page").classList.remove("show-spot");document.querySelector(".clock-gallery").classList.remove("zooming");updateDesign();
  cancelAnimationFrame(clockRaf);clockStartedAt=performance.now();
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){secondHand.style.transform="translateX(-50%) rotate(0deg)";orbitCards.forEach(card=>{card.style.opacity="1";card.style.transform="none"});return}
  clockRaf=requestAnimationFrame(animateClock);
}
function showSpot(){document.querySelector(".design-page").classList.add("show-spot")}
document.querySelector(".clock-enter").addEventListener("click",showSpot);
document.querySelector(".browse-design").addEventListener("click",showSpot);
document.querySelector(".spot-close").addEventListener("click",()=>document.querySelector(".design-page").classList.remove("show-spot"));
document.querySelector(".spot-prev").addEventListener("click",()=>{designIndex=(designIndex+5)%6;updateDesign()});
document.querySelector(".spot-next").addEventListener("click",()=>{designIndex=(designIndex+1)%6;updateDesign()});
document.querySelector(".clock-gallery").addEventListener("wheel",e=>{
  if(active!=="design"||shell.hidden)return;e.preventDefault();wheelProgress+=Math.abs(e.deltaY);
  if(wheelProgress>220&&!document.querySelector(".design-page").classList.contains("show-spot")){e.currentTarget.classList.add("zooming");showSpot();wheelProgress=0}
  else if(document.querySelector(".design-page").classList.contains("show-spot")&&Math.abs(e.deltaY)>28){designIndex=(designIndex+(e.deltaY>0?1:5))%6;updateDesign()}
},{passive:false});
document.querySelectorAll(".folder").forEach(folder=>folder.addEventListener("click",()=>{
  const was=folder.classList.contains("active");document.querySelectorAll(".folder").forEach(x=>{x.classList.remove("active");x.setAttribute("aria-expanded","false")});if(!was){folder.classList.add("active");folder.setAttribute("aria-expanded","true")}
}));
const stage=document.querySelector(".campaign-stage");
document.querySelector(".truck").addEventListener("click",e=>{stage.classList.add("open");e.currentTarget.setAttribute("aria-expanded","true")});
document.querySelector(".collapse-collage").addEventListener("click",()=>{stage.classList.remove("open");document.querySelector(".truck").setAttribute("aria-expanded","false")});
const rain=document.querySelector(".rain-stage");
function resetRain(){rainProgress=0;rain.classList.remove("revealed")}
function advanceRain(n){if(active!=="photography"||shell.hidden||rain.classList.contains("revealed"))return;rainProgress+=n;if(rainProgress>=1)rain.classList.add("revealed")}
rain.addEventListener("click",e=>advanceRain(e.target.closest(".rain-open")?1:.55));
rain.addEventListener("wheel",e=>{if(active!=="photography"||rain.classList.contains("revealed"))return;e.preventDefault();advanceRain(Math.max(.2,Math.abs(e.deltaY)/500))},{passive:false});
rain.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();advanceRain(1)}});
const lightbox=document.querySelector(".lightbox");
document.querySelector(".mory-project").addEventListener("click",()=>lightbox.classList.add("open"));
lightbox.querySelector("button").addEventListener("click",()=>lightbox.classList.remove("open"));
lightbox.addEventListener("click",e=>{if(e.target===lightbox)lightbox.classList.remove("open")});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){lightbox.classList.remove("open");document.querySelector(".design-page").classList.remove("show-spot")}});
