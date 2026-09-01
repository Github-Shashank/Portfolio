const root=document;
const progress=document.getElementById("progress");
const header=document.querySelector("header");
const menu=document.getElementById("menu");
const glow=document.getElementById("cursorGlow");

addEventListener("scroll",()=>{
  const d=document.documentElement;
  const max=d.scrollHeight-d.clientHeight;
  progress.style.width=(max>0?d.scrollTop/max*100:0)+"%";
},{passive:true});

menu?.addEventListener("click",()=>header.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>header.classList.remove("open")));

const sections=[...document.querySelectorAll("section[id]")];
const navLinks=[...document.querySelectorAll("nav a")];
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("visible");
      navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
    }
  });
},{threshold:.18});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

if(glow){
  addEventListener("pointermove",e=>{
    glow.style.left=e.clientX+"px";
    glow.style.top=e.clientY+"px";
  },{passive:true});
}

const counters=[...document.querySelectorAll("[data-count]")];
const countObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target, target=parseFloat(el.dataset.count), suffix=el.dataset.suffix||"";
    const decimals=String(target).includes(".")?2:0;
    const start=performance.now(), duration=900;
    function tick(now){
      const p=Math.min((now-start)/duration,1), eased=1-Math.pow(1-p,3);
      el.textContent=(target*eased).toFixed(decimals)+suffix;
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
},{threshold:.8});
counters.forEach(el=>countObserver.observe(el));

const projects={
  BudgetFlow:{type:"WEB APPLICATION",text:"A full-stack personal finance web application with authentication, transaction management, monthly budgets, dashboard analytics and a JSON summary API.",tags:["Python","Flask","REST API","HTML/CSS","SQLite"],url:"https://github.com/Github-Shashank/Personal-Budget-Tracker"},
  PyMat:{type:"PYTHON LIBRARY",text:"A modular matrix library for numerical computing with matrix arithmetic, multiplication, transpose, determinant, cofactors, inverse, validation and unit tests.",tags:["Python","OOP","Modularization","unittest"],url:"https://github.com/Github-Shashank/PyMat"},
  TrEx:{type:"TERMINAL TOOL",text:"A lightweight C terminal file explorer focused on keyboard-driven navigation, file listing, sorting, scrolling and terminal-aware interaction.",tags:["C","Terminal UI","Systems"],url:"https://github.com/Github-Shashank/trex"}
};
const modal=document.getElementById("projectModal");
const title=document.getElementById("modalTitle");
const type=document.getElementById("modalType");
const text=document.getElementById("modalText");
const tags=document.getElementById("modalTags");
const link=document.getElementById("modalLink");
let lastFocus=null;
function openProject(name){
  const p=projects[name]; if(!p)return;
  lastFocus=document.activeElement;
  title.textContent=name; type.textContent=p.type; text.textContent=p.text;
  tags.innerHTML=p.tags.map(t=>`<span>${t}</span>`).join("");
  link.href=p.url; modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
  document.querySelector(".modal-close").focus();
}
function closeProject(){
  modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.style.overflow="";
  lastFocus?.focus();
}
document.querySelectorAll(".project-card").forEach(card=>{
  card.addEventListener("click",e=>{if(e.target.closest("a"))return;openProject(card.dataset.project)});
  card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openProject(card.dataset.project)}});
});
document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeProject));
addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeProject()});

document.querySelectorAll(".project-card").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    if(!matchMedia("(hover: hover) and (pointer: fine)").matches)return;
    const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg) translateY(-5px)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});

const profile=document.getElementById("profileImage");
if(profile){
  profile.addEventListener("error",()=>{
    console.warn("Profile image not found: assets/profile.jpg");
  });
}

/* ================================================= */
/* PROFILE IMAGE FALLBACK */
/* ================================================= */

const profileImage = document.getElementById("profileImage");

if (profileImage) {
    const profileSources = [
        "assets/profile.jpg",
        "assets/profile.jpeg",
        "assets/profile.png",
        "assets/profile.webp"
    ];

    let profileIndex = 0;

    profileImage.addEventListener("error", () => {
        profileIndex++;

        if (profileIndex < profileSources.length) {
            profileImage.src = profileSources[profileIndex];
        } else {
            profileImage.style.visibility = "hidden";
        }
    });

    // Start with the requested filename.
    profileImage.src = profileSources[0];
}
