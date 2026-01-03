/**
 * @fileoverview Script que se ejecuta antes del deploy
 * @module scripts/pre-deploy
 */

import { execSync } from 'child_process';
import { incrementVersion, getVersionString } from './version.js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const htmlFile = join(rootDir, 'public', 'index.html');

/**
 * Actualiza las versiones en el HTML antes del deploy
 */
function updateVersionsInHTML() {
  try {
    const version = getVersionString();
    let html = readFileSync(htmlFile, 'utf-8');
    
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
    
    // Actualizar data-version en html tag
    html = html.replace(
      /<html[^>]*data-version="[^"]*"/,
      `<html lang="es" data-version="${version}"`
    );
    
    if (!html.includes('data-version')) {
      html = html.replace(
        '<html lang="es">',
        `<html lang="es" data-version="${version}">`
      );
    }
    
    writeFileSync(htmlFile, html, 'utf-8');
    console.log(`✓ Versiones actualizadas en HTML: ${version}`);
  } catch (error) {
    console.error('Error al actualizar versiones:', error);
    process.exit(1);
  }
}

/**
 * Función principal
 */
function main() {
  console.log('🚀 Preparando deploy...');
  
  // Incrementar versión patch automáticamente
  const newVersion = incrementVersion('patch');
  console.log(`✓ Versión incrementada: ${newVersion.version} (build ${newVersion.build})`);
  
  // Actualizar HTML con nuevas versiones
  updateVersionsInHTML();
  
  console.log('✓ Pre-deploy completado');
}

main();

