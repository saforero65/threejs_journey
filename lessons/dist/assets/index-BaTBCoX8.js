import{S as I,P as S,W as k,B as A,a as x,b as j,c as O}from"./three-Dh1ykv7H.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();const R="modulepreload",T=function(e,t){return new URL(e,t).href},E={},q=function(t,o,s){let n=Promise.resolve();if(o&&o.length>0){const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),d=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(o.map(c=>{if(c=T(c,s),c in E)return;E[c]=!0;const l=c.endsWith(".css"),$=l?'[rel="stylesheet"]':"";if(!!s)for(let f=i.length-1;f>=0;f--){const y=i[f];if(y.href===c&&(!l||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${$}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":R,l||(u.as="script"),u.crossOrigin="",u.href=c,d&&u.setAttribute("nonce",d),document.head.appendChild(u),l)return new Promise((f,y)=>{u.addEventListener("load",f),u.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return n.then(i=>{for(const a of i||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})};let g=[];const L=document.getElementById("projects-grid"),b=document.getElementById("loading"),P=document.getElementById("no-results"),M=document.getElementById("search-input"),D=document.getElementById("difficulty-select"),C=document.querySelectorAll(".nav-btn"),m=document.getElementById("project-modal"),H=document.getElementById("project-count");let h="all",w="",p="";async function W(){try{const{projects:e}=await q(async()=>{const{projects:t}=await import("./projects-Yzs3pT_8.js");return{projects:t}},[],import.meta.url);g=e,_(),B(g),H.textContent=g.length,b.style.display="none",G()}catch(e){console.error("Error loading projects:",e),b.innerHTML="<p>Error cargando proyectos. Asegúrate de haber ejecutado el build.</p>"}}function _(){const e=document.getElementById("background-canvas"),t=new I,o=new S(75,window.innerWidth/window.innerHeight,.1,1e3),s=new k({canvas:e,alpha:!0});s.setSize(window.innerWidth,window.innerHeight),s.setPixelRatio(Math.min(window.devicePixelRatio,2));const n=new A,r=1e3,i=new Float32Array(r*3);for(let l=0;l<r*3;l++)i[l]=(Math.random()-.5)*10;n.setAttribute("position",new x(i,3));const a=new j({color:"#667eea",size:.02,transparent:!0,opacity:.6}),d=new O(n,a);t.add(d),o.position.z=3;function c(){requestAnimationFrame(c),d.rotation.x+=5e-4,d.rotation.y+=5e-4,s.render(t,o)}c(),window.addEventListener("resize",()=>{o.aspect=window.innerWidth/window.innerHeight,o.updateProjectionMatrix(),s.setSize(window.innerWidth,window.innerHeight)})}function B(e){if(L.innerHTML="",e.length===0){P.style.display="block";return}P.style.display="none",e.forEach(t=>{const o=z(t);L.appendChild(o)})}function z(e){const t=document.createElement("div");t.className="project-card",t.setAttribute("data-project",JSON.stringify(e));const o="⭐".repeat(e.difficulty);return t.innerHTML=`
        <img src="./thumbnails/${e.thumbnail}" alt="${e.name}" class="project-thumbnail" loading="lazy">
        <div class="project-info">
            <div class="project-header">
                <h3 class="project-title">${e.name}</h3>
                <span class="category-badge ${e.category}">${e.category}</span>
            </div>
            <p class="project-description">${e.description}</p>
            <div class="project-footer">
                <span class="difficulty-badge">${o}</span>
                <button class="view-project-btn" onclick="openProject('${e.folder}')">Ver Proyecto</button>
            </div>
        </div>
    `,t.addEventListener("click",s=>{s.target.classList.contains("view-project-btn")||N(e)}),t}function N(e){const t=document.getElementById("modal-title"),o=document.getElementById("modal-category"),s=document.getElementById("modal-difficulty"),n=document.getElementById("modal-description"),r=document.getElementById("modal-view-btn"),i=document.getElementById("modal-fullscreen-btn");t.textContent=e.name,o.textContent=e.category,o.className=`category-badge ${e.category}`,s.textContent="⭐".repeat(e.difficulty),n.textContent=e.description,r.onclick=()=>openProject(e.folder),i.onclick=()=>{openProject(e.folder),m.classList.remove("active")};const a=document.getElementById("modal-info-btn");a.onclick=()=>{const d=`🎯 Proyecto: ${e.name}
📂 Carpeta: ${e.folder}
📚 Categoría: ${e.category}
⭐ Dificultad: ${"⭐".repeat(e.difficulty)}

📁 Para ejecutar este proyecto:
1. cd ${e.folder}
2. npm install
3. npm run dev

🌐 Para compilar desde el showcase:
npm run build-project ${e.folder}

💡 Los archivos fuente están en la carpeta 'src/'
🚀 Los archivos compilados van a la carpeta 'dist/'`;alert(d)},m.classList.add("active")}function v(){let e=g;h!=="all"&&(e=e.filter(t=>t.category===h)),w&&(e=e.filter(t=>t.difficulty===parseInt(w))),p&&(e=e.filter(t=>t.name.toLowerCase().includes(p.toLowerCase())||t.description.toLowerCase().includes(p.toLowerCase())||t.category.toLowerCase().includes(p.toLowerCase()))),B(e)}function G(){C.forEach(t=>{t.addEventListener("click",()=>{C.forEach(o=>o.classList.remove("active")),t.classList.add("active"),h=t.getAttribute("data-category"),v()})}),M.addEventListener("input",t=>{p=t.target.value,v()}),D.addEventListener("change",t=>{w=t.target.value,v()}),document.querySelector(".modal-close").addEventListener("click",()=>{m.classList.remove("active")}),m.addEventListener("click",t=>{t.target===m&&m.classList.remove("active")}),document.addEventListener("keydown",t=>{t.key==="Escape"&&m.classList.contains("active")&&m.classList.remove("active")}),document.querySelector('.nav-btn[data-category="all"]').classList.add("active")}window.openProject=function(e){const t=`🚀 Para abrir el proyecto "${e}":

1️⃣ Abre una nueva terminal
2️⃣ Ejecuta estos comandos:

   cd ${e}
   npm install
   npm run dev

3️⃣ El proyecto se abrirá automáticamente en tu navegador

💡 Cada proyecto de Three.js Journey funciona de forma independiente
   con su propio servidor de desarrollo.

¿Quieres que copiemos los comandos al portapapeles?`;if(confirm(t+`

¿Copiar comandos al portapapeles?`)){const o=`cd ${e}
npm install
npm run dev`;navigator.clipboard.writeText(o).then(()=>{alert(`✅ Comandos copiados al portapapeles!

Pega y ejecuta en tu terminal.`)}).catch(()=>{prompt("Copia estos comandos:",o)})}};document.addEventListener("DOMContentLoaded",W);
//# sourceMappingURL=index-BaTBCoX8.js.map
