#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

const projectName = process.argv[2];

if (!projectName) {
  console.log("❌ Por favor especifica el nombre del proyecto");
  console.log("💡 Uso: npm run build-project <nombre-proyecto>");
  console.log("📋 Ejemplo: npm run build-project 04-transform-objects");
  process.exit(1);
}

async function buildProject(projectFolder) {
  const projectPath = path.join(process.cwd(), projectFolder);

  console.log(`🔨 Building ${projectFolder}...`);

  try {
    // Verificar si el proyecto existe
    if (!(await fs.pathExists(projectPath))) {
      console.log(`❌ Project ${projectFolder} not found`);
      console.log(`📁 Available projects:`);

      const folders = await fs.readdir(process.cwd());
      const projects = folders.filter(
        (folder) =>
          folder.match(/^\d+-/) &&
          fs.pathExistsSync(path.join(process.cwd(), folder, "package.json"))
      );

      projects.forEach((project) => console.log(`   - ${project}`));
      return false;
    }

    // Verificar si tiene package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    if (!(await fs.pathExists(packageJsonPath))) {
      console.log(`⚠️  No package.json found in ${projectFolder}`);
      return false;
    }

    // Instalar dependencias si no existen node_modules
    const nodeModulesPath = path.join(projectPath, "node_modules");
    if (!(await fs.pathExists(nodeModulesPath))) {
      console.log(`📦 Installing dependencies for ${projectFolder}...`);
      execSync("npm install", { cwd: projectPath, stdio: "inherit" });
    }

    // Compilar el proyecto
    console.log(`⚙️  Building ${projectFolder}...`);
    execSync("npm run build", { cwd: projectPath, stdio: "inherit" });

    // Verificar que se creó el dist
    const distPath = path.join(projectPath, "dist");
    if (await fs.pathExists(distPath)) {
      console.log(`✅ ${projectFolder} built successfully!`);
      console.log(`📁 Build output: ${distPath}`);

      // Copiar al directorio público del showcase si existe
      const showcasePublic = path.join(
        process.cwd(),
        "public",
        "projects",
        projectFolder
      );
      if (await fs.pathExists(path.join(process.cwd(), "public"))) {
        await fs.ensureDir(path.dirname(showcasePublic));
        await fs.copy(distPath, showcasePublic);
        console.log(`📋 Copied to showcase: ${showcasePublic}`);
      }

      return true;
    } else {
      console.log(
        `❌ Build failed for ${projectFolder} - no dist folder found`
      );
      return false;
    }
  } catch (error) {
    console.error(`❌ Error building ${projectFolder}:`, error.message);
    return false;
  }
}

async function main() {
  const success = await buildProject(projectName);

  if (success) {
    console.log(`🎉 Project ${projectName} built successfully!`);
    console.log(`🌐 You can now use the compiled version in production`);
  } else {
    console.log(`💥 Failed to build ${projectName}`);
    process.exit(1);
  }
}

main().catch(console.error);
