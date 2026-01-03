# Sitio Web - Ricardo

Sitio web profesional con arquitectura limpia, publicado en Firebase Hosting con sistema de versionamiento automático.

## 🚀 Instalación y Publicación

### Deploy Automático (Recomendado)

El sistema incluye versionamiento automático que se actualiza en cada deploy:

```bash
npm run deploy
```

Este comando automáticamente:
1. ✅ Incrementa la versión (patch + build)
2. ✅ Actualiza todas las referencias en el HTML
3. ✅ Realiza el deploy a Firebase Hosting

**Versión actual**: Ver `version.json`

### Deploy Manual

Si prefieres hacer el deploy manualmente:

```bash
# 1. Incrementar versión
npm run version:patch

# 2. Deploy a Firebase
firebase deploy --only hosting
```

## 📦 Sistema de Versionamiento

El proyecto incluye un sistema automático de versionamiento para evitar problemas de caché:

- **Formato**: `MAJOR.MINOR.PATCH.BUILD`
- **Ejemplo**: `1.1.4.4`
- Se actualiza automáticamente en cada deploy
- Ver [VERSIONING.md](./VERSIONING.md) para más detalles

## 🏗️ Arquitectura

El proyecto sigue **Clean Architecture** con separación de capas:

- **Domain**: Entidades de negocio
- **Application**: Servicios y lógica
- **Infrastructure**: Firebase y APIs externas
- **UI**: Componentes de presentación
- **Shared**: Utilidades compartidas

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para documentación completa.

## 📋 Instalación y Publicación (Primera vez)

### 1. Instalar Node.js y npm

Si no tienes Node.js instalado, descárgalo desde: https://nodejs.org/

### 2. Instalar Firebase CLI

Abre una terminal en esta carpeta y ejecuta:

```bash
npm install -g firebase-tools
```

### 3. Iniciar sesión en Firebase

```bash
firebase login
```

### 4. Publicar el sitio

```bash
firebase deploy --only hosting
```

El sitio se publicará en: https://rickdev-90632.web.app

## Estructura del Proyecto

- `public/index.html` - Página principal del sitio
- `public/styles.css` - Estilos CSS del sitio
- `firebase.json` - Configuración de Firebase Hosting
- `.firebaserc` - Configuración del proyecto Firebase

## Características

- Header moderno y responsive
- Diseño con gradientes
- Navegación funcional
- Configuración de Firebase incluida


