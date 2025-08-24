# Three.js Journey - Interactive Showcase

Un landing page interactivo que muestra todos los proyectos del curso Three.js Journey de forma organizada y explorable.

## 🚀 Características

- **Grid de proyectos interactivo** con thumbnails y descripciones
- **Filtrado por categorías**: Básico, Intermedio, Avanzado, Proyectos, Shaders
- **Búsqueda en tiempo real** por nombre, descripción o categoría
- **Filtro por dificultad** con sistema de estrellas
- **Background animado** con Three.js
- **Modal de detalles** para cada proyecto
- **Enlaces directos** a los proyectos en modo desarrollo
- **Diseño responsive** para móviles y desktop

## 📁 Estructura

```
lessons/
├── src/                    # Código fuente del showcase
│   ├── index.html         # HTML principal
│   ├── style.css          # Estilos del showcase
│   ├── script.js          # Lógica de la aplicación
│   └── data/
│       └── projects.js    # Datos de proyectos (generado automáticamente)
├── public/
│   ├── favicon.svg        # Icono del sitio
│   └── thumbnails/        # Thumbnails de proyectos (generados automáticamente)
├── scripts/
│   ├── setup-showcase.js  # Script de configuración inicial
│   └── build-all.js      # Script para compilar todos los proyectos (opcional)
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Instalación y uso

### 1. Instalar dependencias

```bash
cd lessons
npm install
```

### 2. Configurar el showcase

```bash
npm run setup
```

Este comando:
- Genera thumbnails por defecto para todos los proyectos
- Crea el archivo `src/data/projects.js` con la información de los proyectos
- Detecta automáticamente qué proyectos están disponibles

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

El showcase estará disponible en `http://localhost:3000`

### 4. Compilar para producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🎨 Personalización

### Agregar proyectos

1. Edita el archivo `scripts/setup-showcase.js`
2. Agrega tu proyecto al array `projectsConfig`:

```javascript
{
  name: 'Mi Proyecto',
  folder: 'mi-proyecto',
  description: 'Descripción del proyecto',
  category: 'Básico', // Básico, Intermedio, Avanzado, Proyecto, Shaders
  difficulty: 3, // 1-5 estrellas
  thumbnail: 'mi-proyecto.png'
}
```

3. Ejecuta `npm run setup` para regenerar los datos

### Cambiar thumbnails

1. Coloca tus imágenes personalizadas en `public/thumbnails/`
2. Usa el nombre especificado en `thumbnail` (ej: `mi-proyecto.png`)
3. Tamaño recomendado: 400x300px

### Modificar categorías y filtros

Edita las categorías en:
- `src/index.html` (botones de navegación)
- `src/style.css` (estilos de badges)
- `scripts/setup-showcase.js` (configuración de proyectos)

## 🔧 Scripts disponibles

- `npm run dev` - Ejecutar showcase en modo desarrollo
- `npm run build` - Compilar showcase para producción
- `npm run setup` - Configurar el showcase (generar thumbnails y datos)
- `npm run preview` - Vista previa de la build del showcase
- `npm run build-project [nombre]` - Compilar un proyecto específico
- `npm run build-all-projects` - Compilar todos los proyectos (toma tiempo)

### Ejemplos de uso

```bash
# Configurar por primera vez
npm run setup

# Ejecutar en desarrollo
npm run dev

# Compilar un proyecto específico
npm run build-project 04-transform-objects
npm run build-project 20-physics
npm run build-project 27-shaders

# Ver todos los proyectos disponibles
npm run build-project
```

## 📦 Compilar proyectos individuales

Para compilar un proyecto específico para producción:

```bash
cd [nombre-del-proyecto]
npm install
npm run build
```

## 🌐 Despliegue

El showcase está diseñado para funcionar tanto:

1. **En desarrollo**: Enlaces directos a `../proyecto/src/index.html`
2. **En producción**: Se puede modificar para usar proyectos compilados

Para producción, puedes:
1. Compilar todos los proyectos con `node scripts/build-all.js`
2. Modificar los enlaces en `script.js` para apuntar a `/projects/`

## 🎯 Características técnicas

- **Vite** como bundler
- **Three.js** para el background animado
- **CSS Grid** para layout responsive
- **Vanilla JavaScript** para máximo rendimiento
- **SVG** para thumbnails por defecto
- **Local Storage** para recordar filtros (opcional)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es parte del curso Three.js Journey. Consulta los términos de uso del curso original.

## 🙏 Agradecimientos

- [Bruno Simon](https://bruno-simon.com/) por el increíble curso Three.js Journey
- [Three.js](https://threejs.org/) por la librería
- [Vite](https://vitejs.dev/) por el excelente tooling
