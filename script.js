const shell=document.querySelector("#portfolio");
const pages=[...document.querySelectorAll(".work")];
let active="",designIndex=0,wheelProgress=0,rainProgress=0;
const designs=[
  ["概念海报 · 让想法被看见","art-poster"],["刊物练习 · 静谧的一期","art-editorial"],["色彩研究 · 日常的温度","art-color"],["作品集封面 · Bare Branches","art-cover"],["字形练习 · 字与形","art-type"],["版式研究 · Layout as language","art-grid"]
];
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
function resetDesign(){designIndex=0;wheelProgress=0;document.querySelector(".design-page").classList.remove("show-spot");document.querySelector(".clock-gallery").classList.remove("zooming");updateDesign()}
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
