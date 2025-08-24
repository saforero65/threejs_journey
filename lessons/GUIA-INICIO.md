# 🚀 Guía de inicio rápido

## ¿Qué es esto?

Este es un **showcase interactivo** que muestra todos los proyectos del curso Three.js Journey de forma organizada y fácil de explorar.

## 🎯 Características principales

✅ **43+ proyectos** organizados por categoría y dificultad  
✅ **Filtrado avanzado** por categoría, dificultad y búsqueda  
✅ **Thumbnails automáticos** para cada proyecto  
✅ **Enlaces directos** a los proyectos en modo desarrollo  
✅ **Background 3D animado** con Three.js  
✅ **Totalmente responsive** para móviles y desktop  

## 🏃‍♂️ Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar el showcase
npm run setup

# 3. Ejecutar en desarrollo
npm run dev
```

¡Listo! El showcase estará en `http://localhost:3001`

## 📋 Cómo funciona

### Estructura del proyecto
```
lessons/
├── 04-transform-objects/      # Proyecto 1
├── 05-animations/             # Proyecto 2
├── ...                        # Más proyectos
├── src/                       # Código del showcase
├── public/thumbnails/         # Miniaturas (auto-generadas)
└── scripts/                   # Scripts de build
```

### Enlaces de proyectos

Los proyectos se enlazan directamente a sus carpetas `src/` para desarrollo en vivo:
- `../04-transform-objects/src/index.html`
- `../05-animations/src/index.html`
- etc.

Esto significa que:
- ✅ Los cambios se ven inmediatamente
- ✅ No necesitas compilar para probar
- ✅ Cada proyecto mantiene su propio servidor de desarrollo

## 🔧 Compilar proyectos

### Un proyecto específico
```bash
npm run build-project 04-transform-objects
```

### Todos los proyectos (toma tiempo ⏰)
```bash
npm run build-all-projects
```

### Manualmente
```bash
cd 04-transform-objects
npm install
npm run build
```

## 🎨 Personalización

### Cambiar thumbnails
1. Pon tu imagen en `public/thumbnails/`
2. Nombre: `[nombre-proyecto].png` (ej: `mi-proyecto.png`)
3. Tamaño recomendado: 400x300px

### Agregar proyectos
1. Edita `scripts/setup-showcase.js`
2. Agrega al array `projectsConfig`:
```javascript
{
  name: 'Mi Proyecto',
  folder: 'mi-proyecto',
  description: 'Descripción del proyecto',
  category: 'Básico',
  difficulty: 3,
  thumbnail: 'mi-proyecto.png'
}
```
3. Ejecuta `npm run setup`

## 🌐 Para producción

Si quieres desplegar en producción:

1. **Opción A: Desarrollo en vivo** (recomendado)
   - Los proyectos se enlazan directamente a `src/`
   - Ideal para portafolios y demos

2. **Opción B: Compilado**
   - Compila proyectos con `npm run build-all-projects`
   - Cambia enlaces en `script.js` para apuntar a `/projects/`
   - Mejor para sitios estáticos

## 🎯 Casos de uso

### Para estudiantes
- 📚 Explora todos los proyectos del curso
- 🔍 Busca proyectos por tema o dificultad
- 💡 Ve ejemplos en vivo sin configurar nada

### Para instructores
- 📋 Organiza y presenta todo el contenido
- 🎮 Demo interactiva para clases
- 📊 Seguimiento visual del progreso

### Para desarrolladores
- 🛠️ Base para tu propio portafolio Three.js
- 🎨 Inspírate con diferentes técnicas
- 🚀 Punto de partida para nuevos proyectos

## 💡 Tips

### Desarrollo eficiente
- Usa `npm run dev` para el showcase
- Cada proyecto se abre en su propio servidor
- Los cambios se ven instantáneamente

### Organización
- Los proyectos están ordenados por dificultad
- Usa filtros para encontrar lo que buscas
- Los modales muestran información detallada

### Performance
- Los thumbnails son SVG ligeros
- El background 3D es optimizado
- Solo se carga lo que necesitas

## 🆘 Problemas comunes

### Puerto ocupado
```
Port 3000 is in use, trying another one...
```
✅ **Normal**: Vite automáticamente usa otro puerto

### Proyecto no aparece
1. Verifica que existe la carpeta del proyecto
2. Ejecuta `npm run setup` para regenerar
3. Revisa `src/data/projects.js`

### Thumbnail no se ve
1. Verifica el nombre del archivo en `public/thumbnails/`
2. Debe coincidir con el `thumbnail` en la configuración
3. Los SVG se generan automáticamente si no existen

### Error al compilar proyecto
1. Verifica que el proyecto tiene `package.json`
2. Instala dependencias: `cd [proyecto] && npm install`
3. Algunos proyectos pueden tener dependencias específicas

## 🚀 ¡A explorar!

Ya tienes todo listo para explorar el increíble mundo de Three.js. ¡Disfruta aprendiendo y creando experiencias 3D increíbles!

---

**💖 Desarrollado con amor para la comunidad Three.js Journey**
