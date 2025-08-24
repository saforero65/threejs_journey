import * as THREE from "three";
import "./style.css";

// Importar datos de proyectos (se generará automáticamente)
let projectsData = [];

// Elementos del DOM
const projectsGrid = document.getElementById("projects-grid");
const loading = document.getElementById("loading");
const noResults = document.getElementById("no-results");
const searchInput = document.getElementById("search-input");
const difficultySelect = document.getElementById("difficulty-select");
const navButtons = document.querySelectorAll(".nav-btn");
const modal = document.getElementById("project-modal");
const projectCount = document.getElementById("project-count");

// Estado de la aplicación
let currentCategory = "all";
let currentDifficulty = "";
let currentSearch = "";

// Inicializar la aplicación
async function init() {
  try {
    // Cargar datos de proyectos
    const { projects } = await import("./data/projects.js");
    projectsData = projects;

    // Inicializar background 3D
    initBackground();

    // Mostrar proyectos
    displayProjects(projectsData);

    // Actualizar contador
    projectCount.textContent = projectsData.length;

    // Ocultar loading
    loading.style.display = "none";

    // Configurar eventos
    setupEventListeners();
  } catch (error) {
    console.error("Error loading projects:", error);
    loading.innerHTML =
      "<p>Error cargando proyectos. Asegúrate de haber ejecutado el build.</p>";
  }
}

// Configurar Three.js background
function initBackground() {
  const canvas = document.getElementById("background-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Crear geometría de partículas
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // Material de partículas
  const particlesMaterial = new THREE.PointsMaterial({
    color: "#667eea",
    size: 0.02,
    transparent: true,
    opacity: 0.6,
  });

  // Crear partículas
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  camera.position.z = 3;

  // Animación
  function animate() {
    requestAnimationFrame(animate);

    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;

    renderer.render(scene, camera);
  }

  animate();

  // Redimensionar
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Mostrar proyectos en la grid
function displayProjects(projects) {
  projectsGrid.innerHTML = "";

  if (projects.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  projects.forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });
}

// Crear tarjeta de proyecto
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.setAttribute("data-project", JSON.stringify(project));

  const difficultyStars = "⭐".repeat(project.difficulty);

  card.innerHTML = `
        <img src="./thumbnails/${project.thumbnail}" alt="${project.name}" class="project-thumbnail" loading="lazy">
        <div class="project-info">
            <div class="project-header">
                <h3 class="project-title">${project.name}</h3>
                <span class="category-badge ${project.category}">${project.category}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-footer">
                <span class="difficulty-badge">${difficultyStars}</span>
                <button class="view-project-btn" onclick="openProject('${project.folder}')">Ver Proyecto</button>
            </div>
        </div>
    `;

  // Evento click para modal
  card.addEventListener("click", (e) => {
    if (!e.target.classList.contains("view-project-btn")) {
      showProjectModal(project);
    }
  });

  return card;
}

// Mostrar modal de proyecto
function showProjectModal(project) {
  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalDifficulty = document.getElementById("modal-difficulty");
  const modalDescription = document.getElementById("modal-description");
  const modalViewBtn = document.getElementById("modal-view-btn");
  const modalFullscreenBtn = document.getElementById("modal-fullscreen-btn");

  modalTitle.textContent = project.name;
  modalCategory.textContent = project.category;
  modalCategory.className = `category-badge ${project.category}`;
  modalDifficulty.textContent = "⭐".repeat(project.difficulty);
  modalDescription.textContent = project.description;
  // Configurar botones
  modalViewBtn.onclick = () => openProject(project.folder);
  modalFullscreenBtn.onclick = () => {
    openProject(project.folder);
    modal.classList.remove("active");
  };

  // Botón info
  const modalInfoBtn = document.getElementById("modal-info-btn");
  modalInfoBtn.onclick = () => {
    const infoText = `🎯 Proyecto: ${project.name}
📂 Carpeta: ${project.folder}
📚 Categoría: ${project.category}
⭐ Dificultad: ${"⭐".repeat(project.difficulty)}

� PARA ESTE PROYECTO ESPECÍFICO:
1. cd ${project.folder}
2. npm install
3. npm run dev

🌐 PARA TODO EL SHOWCASE (BUILD COMPLETO):
1. Desde la carpeta principal del showcase:
   npm run build
2. Subir carpeta 'dist/' a tu hosting

💡 DIFERENCIA:
• Proyecto individual = Desarrollo/modificación de UN proyecto
• Showcase build = Página completa con TODOS los proyectos para producción`;
    alert(infoText);
  };

  modal.classList.add("active");
}

// Filtrar proyectos
function filterProjects() {
  let filtered = projectsData;

  // Filtrar por categoría
  if (currentCategory !== "all") {
    filtered = filtered.filter(
      (project) => project.category === currentCategory
    );
  }

  // Filtrar por dificultad
  if (currentDifficulty) {
    filtered = filtered.filter(
      (project) => project.difficulty === parseInt(currentDifficulty)
    );
  }

  // Filtrar por búsqueda
  if (currentSearch) {
    filtered = filtered.filter(
      (project) =>
        project.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
        project.description
          .toLowerCase()
          .includes(currentSearch.toLowerCase()) ||
        project.category.toLowerCase().includes(currentSearch.toLowerCase())
    );
  }

  displayProjects(filtered);
}

// Configurar event listeners
function setupEventListeners() {
  // Navegación por categorías
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      filterProjects();
    });
  });

  // Búsqueda
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    filterProjects();
  });

  // Filtro de dificultad
  difficultySelect.addEventListener("change", (e) => {
    currentDifficulty = e.target.value;
    filterProjects();
  });

  // Cerrar modal
  const modalClose = document.querySelector(".modal-close");
  modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // Tecla ESC para cerrar modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      modal.classList.remove("active");
    }
  });

  // Activar primer botón de navegación
  document
    .querySelector('.nav-btn[data-category="all"]')
    .classList.add("active");
}

// Función para abrir proyectos
window.openProject = function (projectFolder) {
  // Crear una ventana emergente para mostrar instrucciones
  const instructions = `🎯 Proyecto: "${projectFolder}"

📁 Este proyecto está ubicado en la carpeta: ${projectFolder}/

🚀 Para ejecutar este proyecto específico:
1️⃣ Abre una nueva terminal en la carpeta del proyecto
2️⃣ Ejecuta estos comandos:

   cd ${projectFolder}
   npm install
   npm run dev

💡 Cada proyecto Three.js funciona independientemente con su propio servidor.

🌐 Este showcase ya está compilado y listo para producción.
   Solo necesitas ejecutar proyectos individuales si quieres desarrollar/modificar alguno.`;

  // Crear botones personalizados en lugar de confirm
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.8); display: flex; align-items: center; 
    justify-content: center; z-index: 10000; color: white; font-family: Arial;
  `;

  modal.innerHTML = `
    <div style="background: #1a1a1a; padding: 30px; border-radius: 15px; max-width: 500px; text-align: center;">
      <h3 style="margin-top: 0; color: #667eea;">🎯 ${projectFolder}</h3>
      <div style="text-align: left; margin: 20px 0; line-height: 1.6;">
        <p><strong>📁 Ubicación:</strong> ${projectFolder}/</p>
        <p><strong>🚀 Para ejecutar:</strong></p>
        <code style="background: #333; padding: 10px; display: block; border-radius: 5px; margin: 10px 0;">
cd ${projectFolder}<br>npm install<br>npm run dev
        </code>
        <p style="font-size: 0.9em; color: #ccc;">💡 Cada proyecto funciona independientemente</p>
      </div>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button id="copy-commands" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          📋 Copiar Comandos
        </button>
        <button id="close-modal" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          ❌ Cerrar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners para los botones
  document.getElementById("copy-commands").onclick = () => {
    const commands = `cd ${projectFolder}\nnpm install\nnpm run dev`;
    navigator.clipboard
      .writeText(commands)
      .then(() => {
        alert("✅ Comandos copiados al portapapeles!");
        document.body.removeChild(modal);
      })
      .catch(() => {
        prompt("Copia estos comandos:", commands);
        document.body.removeChild(modal);
      });
  };

  document.getElementById("close-modal").onclick = () => {
    document.body.removeChild(modal);
  };

  // Cerrar con click fuera del modal
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
};

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);
