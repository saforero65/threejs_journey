import fs from "fs-extra";
import path from "path";

// Proyectos disponibles (sin compilar automáticamente)
const projectsConfig = [
  {
    name: "Transform Objects",
    folder: "04-transform-objects",
    description:
      "Aprende a transformar objetos en Three.js: posición, rotación y escala.",
    category: "Básico",
    difficulty: 1,
    thumbnail: "transform-objects.png",
  },
  {
    name: "Animations",
    folder: "05-animations",
    description: "Crea animaciones fluidas con requestAnimationFrame y GSAP.",
    category: "Básico",
    difficulty: 2,
    thumbnail: "animations.png",
  },
  {
    name: "Cameras",
    folder: "06-cameras",
    description: "Domina los diferentes tipos de cámaras y controles.",
    category: "Básico",
    difficulty: 2,
    thumbnail: "cameras.png",
  },
  {
    name: "Fullscreen & Resizing",
    folder: "07-fullscreen-and-resizing",
    description: "Maneja pantalla completa y redimensionamiento responsivo.",
    category: "Básico",
    difficulty: 2,
    thumbnail: "fullscreen.png",
  },
  {
    name: "Geometries",
    folder: "08-geometries",
    description: "Explora geometrías primitivas y personalizadas.",
    category: "Básico",
    difficulty: 2,
    thumbnail: "geometries.png",
  },
  {
    name: "Debug UI",
    folder: "09-debug-ui",
    description: "Implementa interfaces de depuración con lil-gui.",
    category: "Básico",
    difficulty: 2,
    thumbnail: "debug-ui.png",
  },
  {
    name: "Textures",
    folder: "10-textures",
    description: "Aplica texturas y mapas a tus modelos 3D.",
    category: "Intermedio",
    difficulty: 3,
    thumbnail: "textures.png",
  },
  {
    name: "Materials",
    folder: "11-materials",
    description: "Domina los diferentes tipos de materiales.",
    category: "Intermedio",
    difficulty: 3,
    thumbnail: "materials.png",
  },
  {
    name: "3D Text",
    folder: "12-3d-text",
    description: "Crea texto en 3D con geometrías de texto.",
    category: "Intermedio",
    difficulty: 3,
    thumbnail: "3d-text.png",
  },
  {
    name: "Lights",
    folder: "14-lights",
    description: "Ilumina tus escenas con diferentes tipos de luces.",
    category: "Intermedio",
    difficulty: 3,
    thumbnail: "lights.png",
  },
  {
    name: "Shadows",
    folder: "15-shadows",
    description: "Implementa sombras realistas en tus escenas.",
    category: "Intermedio",
    difficulty: 3,
    thumbnail: "shadows.png",
  },
  {
    name: "Haunted House",
    folder: "16-haunted-house",
    description: "Proyecto completo: construye una casa embrujada.",
    category: "Proyecto",
    difficulty: 4,
    thumbnail: "haunted-house.png",
  },
  {
    name: "Particles",
    folder: "17-particles",
    description: "Crea efectos de partículas impresionantes.",
    category: "Intermedio",
    difficulty: 4,
    thumbnail: "particles.png",
  },
  {
    name: "Galaxy Generator",
    folder: "18-galaxy-generator",
    description: "Genera galaxias procedurales con partículas.",
    category: "Proyecto",
    difficulty: 4,
    thumbnail: "galaxy-generator.png",
  },
  {
    name: "Scroll Based Animation",
    folder: "19-scroll-based-animation",
    description: "Animaciones basadas en scroll para experiencias web.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "scroll-animation.png",
  },
  {
    name: "Physics",
    folder: "20-physics",
    description: "Integra física realista con Cannon.js.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "physics.png",
  },
  {
    name: "Imported Models",
    folder: "21-imported-models",
    description: "Importa y anima modelos 3D externos.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "imported-models.png",
  },
  {
    name: "Raycaster & Mouse Events",
    folder: "22-raycaster-and-mouse-events",
    description: "Interacción con mouse usando raycasting.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "raycaster.png",
  },
  {
    name: "Custom Models with Blender",
    folder: "23-custom-models-with-blender",
    description: "Crea modelos personalizados con Blender.",
    category: "Avanzado",
    difficulty: 5,
    thumbnail: "blender-models.png",
  },
  {
    name: "Environment Map",
    folder: "24-environment-map",
    description: "Implementa mapas de entorno para reflexiones.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "environment-map.png",
  },
  {
    name: "Realistic Render",
    folder: "25-realistic-render",
    description: "Crea renders fotorrealistas con técnicas avanzadas.",
    category: "Avanzado",
    difficulty: 5,
    thumbnail: "realistic-render.png",
  },
  {
    name: "Code Structuring",
    folder: "26-code-structuring-for-bigger-projects",
    description: "Estructura código para proyectos grandes.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "code-structuring.png",
  },
  {
    name: "Shaders",
    folder: "27-shaders",
    description: "Introducción a los shaders GLSL.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "shaders.png",
  },
  {
    name: "Shader Patterns",
    folder: "28-shader-patterns",
    description: "Crea patrones complejos con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "shader-patterns.png",
  },
  {
    name: "Raging Sea",
    folder: "29-raging-sea",
    description: "Simula océanos realistas con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "raging-sea.png",
  },
  {
    name: "Animated Galaxy",
    folder: "30-animated-galaxy",
    description: "Galaxias animadas con shaders de partículas.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "animated-galaxy.png",
  },
  {
    name: "Coffee Smoke Shader",
    folder: "32-coffee-smoke-shader",
    description: "Efectos de humo procedural con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "coffee-smoke.png",
  },
  {
    name: "Hologram Shader",
    folder: "33-hologram-shader",
    description: "Efectos holográficos impresionantes.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "hologram.png",
  },
  {
    name: "Fireworks Shaders",
    folder: "34-fireworks-shaders",
    description: "Fuegos artificiales espectaculares con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "fireworks.png",
  },
  {
    name: "Lights Shading",
    folder: "35-lights-shading-shaders",
    description: "Iluminación personalizada con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "lights-shading.png",
  },
  {
    name: "Raging Sea Shading",
    folder: "36-raging-sea-shading-shaders",
    description: "Océano con shading avanzado.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "sea-shading.png",
  },
  {
    name: "Halftone Shading",
    folder: "37-halftone-shading-shaders",
    description: "Efectos halftone con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "halftone.png",
  },
  {
    name: "Earth Shaders",
    folder: "38-earth-shaders",
    description: "Planeta Tierra con shaders realistas.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "earth.png",
  },
  {
    name: "Particles Cursor Animation",
    folder: "39-particles-cursor-animation-shader",
    description: "Partículas que siguen el cursor.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "cursor-particles.png",
  },
  {
    name: "Particles Morphing",
    folder: "40-particles-morphing-shader",
    description: "Morfeo de partículas con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "morphing-particles.png",
  },
  {
    name: "GPGPU Flow Field",
    folder: "41-gpgpu-flow-field-particles-shaders",
    description: "Simulación de fluidos con GPGPU.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "gpgpu-flow.png",
  },
  {
    name: "Wobbly Sphere",
    folder: "42-wobbly-sphere-shader",
    description: "Esferas gelatinosas con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "wobbly-sphere.png",
  },
  {
    name: "Sliced Model",
    folder: "43-sliced-model-shader",
    description: "Modelos cortados con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "sliced-model.png",
  },
  {
    name: "Procedural Terrain",
    folder: "44-procedural-terrain-shader",
    description: "Terrenos procedurales con shaders.",
    category: "Shaders",
    difficulty: 5,
    thumbnail: "procedural-terrain.png",
  },
  {
    name: "Post Processing",
    folder: "45-post-processing",
    description: "Efectos de post-procesamiento.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "post-processing.png",
  },
  {
    name: "Performance Tips",
    folder: "46-performance-tips",
    description: "Optimiza el rendimiento de tus aplicaciones.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "performance.png",
  },
  {
    name: "Loading Progress",
    folder: "47-intro-and-loading-progress",
    description: "Implementa pantallas de carga elegantes.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "loading-progress.png",
  },
  {
    name: "Mixing HTML and WebGL",
    folder: "48-mixing-html-and-webgl",
    description: "Combina HTML y WebGL para UIs híbridas.",
    category: "Avanzado",
    difficulty: 4,
    thumbnail: "html-webgl.png",
  },
];

async function generateThumbnails() {
  console.log("🖼️  Generating default thumbnails...");

  const thumbnailsDir = path.join(process.cwd(), "public", "thumbnails");
  await fs.ensureDir(thumbnailsDir);

  for (const project of projectsConfig) {
    const thumbnailPath = path.join(thumbnailsDir, project.thumbnail);
    if (!(await fs.pathExists(thumbnailPath))) {
      // Crear un SVG simple como thumbnail por defecto
      const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad1)"/>
  <text x="50%" y="40%" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">${project.name}</text>
  <text x="50%" y="60%" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial" font-size="14">${project.category}</text>
  <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.3)"/>
  <circle cx="40" cy="20" r="8" fill="rgba(255,255,255,0.3)"/>
  <circle cx="60" cy="20" r="8" fill="rgba(255,255,255,0.3)"/>
</svg>`;
      await fs.writeFile(thumbnailPath, svg);
    }
  }
}

async function generateProjectsData() {
  // Filtrar proyectos que existen
  const existingProjects = [];

  for (const project of projectsConfig) {
    const projectPath = path.join(process.cwd(), project.folder);
    if (await fs.pathExists(projectPath)) {
      existingProjects.push({
        ...project,
        // Marcar si tiene build disponible
        hasBuilt: await fs.pathExists(path.join(projectPath, "dist")),
      });
    }
  }

  // Generar archivo de datos de proyectos
  const projectsDataPath = path.join(
    process.cwd(),
    "src",
    "data",
    "projects.js"
  );
  await fs.ensureDir(path.dirname(projectsDataPath));

  const projectsData = `export const projects = ${JSON.stringify(
    existingProjects,
    null,
    2
  )}`;
  await fs.writeFile(projectsDataPath, projectsData);

  console.log(
    `📊 Generated projects data with ${existingProjects.length} projects`
  );

  return existingProjects;
}

async function main() {
  console.log("🚀 Setting up showcase...");

  // Generar thumbnails
  await generateThumbnails();

  // Generar datos de proyectos
  await generateProjectsData();

  console.log(`🎉 Showcase setup completed!`);
  console.log(
    `💡 Tip: Los proyectos se enlazan directamente a sus carpetas src para desarrollo en vivo.`
  );
  console.log(
    `📦 Para compilar un proyecto específico: cd [nombre-proyecto] && npm install && npm run build`
  );
}

main().catch(console.error);
