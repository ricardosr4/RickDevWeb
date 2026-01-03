/**
 * @fileoverview Script para actualizar versiones en archivos HTML
 * @module scripts/update-version
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { incrementVersion, getVersionString } from './version.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const htmlFile = join(rootDir, 'public', 'index.html');
const cssFile = join(rootDir, 'public', 'styles.css');

/**
 * Actualiza las versiones en el HTML
 */
function updateHTMLVersion() {
  try {
    let html = readFileSync(htmlFile, 'utf-8');
    const version = getVersionString();
    
    // Actualizar versiones en enlaces de CSS y JS
    html = html.replace(
      /href="([^"]*\.css)"|src="([^"]*\.js)"/g,
      (match, css, js) => {
        if (css) {
          return `href="${css}?v=${version}"`;
        }
        if (js) {
          return `src="${js}?v=${version}"`;
        }
        return match;
      }
    );
    
    // Actualizar específicamente los archivos conocidos
    html = html.replace(
      /href="styles\.css"/g,
      `href="styles.css?v=${version}"`
    );
    
    html = html.replace(
      /src="js\/app\.js"/g,
      `src="js/app.js?v=${version}"`
    );
    
    // Agregar meta tag de versión
    if (!html.includes('data-version')) {
      html = html.replace(
        '<html lang="es">',
        `<html lang="es" data-version="${version}">`
      );
    } else {
      html = html.replace(
        /data-version="[^"]*"/,
        `data-version="${version}"`
      );
    }
    
    writeFileSync(htmlFile, html, 'utf-8');
    console.log(`✓ HTML actualizado con versión ${version}`);
  } catch (error) {
    console.error('Error al actualizar HTML:', error);
    process.exit(1);
  }
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  const versionType = args[0] || 'patch'; // patch, minor, major
  
  console.log(`Incrementando versión (${versionType})...`);
  const newVersion = incrementVersion(versionType);
  console.log(`✓ Nueva versión: ${newVersion.version} (build ${newVersion.build})`);
  
  updateHTMLVersion();
  
  console.log('✓ Versionamiento completado');
}

main();

