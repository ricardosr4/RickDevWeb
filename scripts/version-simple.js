/**
 * @fileoverview Script simplificado para manejar versionamiento
 * Compatible con Node.js estándar
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const versionFile = path.join(rootDir, 'version.json');
const htmlFile = path.join(rootDir, 'public', 'index.html');

/**
 * Lee la versión actual
 */
function getVersion() {
  try {
    const content = fs.readFileSync(versionFile, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error al leer version.json:', error);
    return { version: '1.1.0', build: 0 };
  }
}

/**
 * Incrementa la versión patch y el build
 */
function incrementVersion() {
  const current = getVersion();
  const [major, minor, patch] = current.version.split('.').map(Number);
  
  const newVersion = `${major}.${minor}.${patch + 1}`;
  const newBuild = current.build + 1;
  
  const newVersionData = {
    version: newVersion,
    build: newBuild,
    lastUpdated: new Date().toISOString()
  };
  
  fs.writeFileSync(versionFile, JSON.stringify(newVersionData, null, 2), 'utf-8');
  return newVersionData;
}

/**
 * Obtiene la versión como string para cache busting
 */
function getVersionString() {
  const versionData = getVersion();
  return `${versionData.version}.${versionData.build}`;
}

/**
 * Actualiza las versiones en el HTML
 */
function updateHTMLVersion() {
  try {
    let html = fs.readFileSync(htmlFile, 'utf-8');
    const version = getVersionString();
    
    // Actualizar styles.css
    html = html.replace(
      /href="styles\.css(\?v=[^"]*)?"/g,
      `href="styles.css?v=${version}"`
    );
    
    // Actualizar js/app.js
    html = html.replace(
      /src="js\/app\.js(\?v=[^"]*)?"/g,
      `src="js/app.js?v=${version}"`
    );
    
    // Actualizar modulepreload
    html = html.replace(
      /href="js\/app\.js(\?v=[^"]*)?"/g,
      `href="js/app.js?v=${version}"`
    );
    
    // Actualizar data-version en html tag
    if (html.includes('data-version')) {
      html = html.replace(
        /<html[^>]*data-version="[^"]*"/,
        `<html lang="es" data-version="${version}"`
      );
    } else {
      html = html.replace(
        '<html lang="es">',
        `<html lang="es" data-version="${version}">`
      );
    }
    
    fs.writeFileSync(htmlFile, html, 'utf-8');
    console.log(`✓ HTML actualizado con versión ${version}`);
    return version;
  } catch (error) {
    console.error('Error al actualizar HTML:', error);
    process.exit(1);
  }
}

/**
 * Función principal
 */
function main() {
  console.log('🚀 Preparando versionamiento para deploy...');
  
  // Incrementar versión automáticamente
  const newVersion = incrementVersion();
  console.log(`✓ Versión incrementada: ${newVersion.version} (build ${newVersion.build})`);
  
  // Actualizar HTML con nuevas versiones
  const versionString = updateHTMLVersion();
  
  console.log(`✓ Versionamiento completado: ${versionString}`);
  return versionString;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { getVersion, incrementVersion, getVersionString, updateHTMLVersion };

