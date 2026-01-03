/**
 * @fileoverview Script para manejar el versionamiento automático
 * @module scripts/version
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const versionFile = join(rootDir, 'version.json');

/**
 * Lee la versión actual
 * @returns {Object} Objeto con version y build
 */
export function getVersion() {
  try {
    const content = readFileSync(versionFile, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error al leer version.json:', error);
    return { version: '1.1.0', build: 0 };
  }
}

/**
 * Incrementa la versión según el tipo
 * @param {string} type - Tipo de incremento: 'patch', 'minor', 'major'
 * @returns {Object} Nueva versión
 */
export function incrementVersion(type = 'patch') {
  const current = getVersion();
  const [major, minor, patch] = current.version.split('.').map(Number);
  
  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
    default:
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
  }
  
  const newBuild = current.build + 1;
  const newVersionData = {
    version: newVersion,
    build: newBuild,
    lastUpdated: new Date().toISOString()
  };
  
  writeFileSync(versionFile, JSON.stringify(newVersionData, null, 2), 'utf-8');
  
  return newVersionData;
}

/**
 * Obtiene la versión como string para cache busting
 * @returns {string} Versión formateada
 */
export function getVersionString() {
  const versionData = getVersion();
  return `${versionData.version}.${versionData.build}`;
}

