/**
 * @fileoverview Script pre-deploy simplificado
 * Se ejecuta antes de cada deploy para copiar archivos de dist/public a public
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  console.log('🚀 Ejecutando pre-deploy...');
  
  try {
    // Copiar archivos generados de dist a public (sin sobrescribir HTML originales)
    const distDir = path.join(__dirname, '../dist');
    const publicDir = path.join(__dirname, '../public');
    
    // Copiar archivos JS
    const distJsDir = path.join(distDir, 'js');
    const publicJsDir = path.join(publicDir, 'js');
    
    if (fs.existsSync(distJsDir)) {
      console.log('📦 Copiando archivos JS...');
      if (fs.existsSync(publicJsDir)) {
        fs.rmSync(publicJsDir, { recursive: true, force: true });
      }
      copyDir(distJsDir, publicJsDir);
    }
    
    // Copiar archivos assets
    const distAssetsDir = path.join(distDir, 'assets');
    const publicAssetsDir = path.join(publicDir, 'assets');
    
    if (fs.existsSync(distAssetsDir)) {
      console.log('📦 Copiando archivos assets...');
      if (fs.existsSync(publicAssetsDir)) {
        fs.rmSync(publicAssetsDir, { recursive: true, force: true });
      }
      copyDir(distAssetsDir, publicAssetsDir);
    }
    
    // Copiar HTML procesados de dist/public a public
    const distPublicDir = path.join(distDir, 'public');
    if (fs.existsSync(distPublicDir)) {
      console.log('📦 Copiando archivos HTML procesados...');
      const htmlFiles = ['index.html', 'admin.html'];
      htmlFiles.forEach(file => {
        const srcFile = path.join(distPublicDir, file);
        const destFile = path.join(publicDir, file);
        if (fs.existsSync(srcFile)) {
          fs.copyFileSync(srcFile, destFile);
          console.log(`   ✓ ${file}`);
        }
      });
    }
    
    console.log('✅ Pre-deploy completado');
  } catch (error) {
    console.error('❌ Error en pre-deploy:', error);
    process.exit(1);
  }
}

main();

