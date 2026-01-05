# 🚀 Guía de Migración: JavaScript → TypeScript + Vite

## 📋 Índice
1. [Preparación](#preparación)
2. [Instalación de Dependencias](#instalación-de-dependencias)
3. [Reestructuración de Carpetas](#reestructuración-de-carpetas)
4. [Migración de Archivos](#migración-de-archivos)
5. [Configuración de Tipos](#configuración-de-tipos)
6. [Testing y Validación](#testing-y-validación)
7. [Deployment](#deployment)

---

## 1. Preparación

### 1.1 Backup del Proyecto
```bash
# Crear una rama de backup
git checkout -b backup/pre-typescript-migration
git add .
git commit -m "Backup antes de migración a TypeScript"
git push origin backup/pre-typescript-migration

# Volver a main
git checkout main
```

### 1.2 Verificar Node.js
```bash
node --version  # Debe ser >= 18.0.0
npm --version   # Debe ser >= 9.0.0
```

---

## 2. Instalación de Dependencias

### 2.1 Instalar Nuevas Dependencias
```bash
npm install
```

Esto instalará:
- ✅ TypeScript 5.3.3
- ✅ Vite 5.0.10
- ✅ Firebase 10.7.1 (ya existente)
- ✅ TypeScript ESLint plugins

### 2.2 Verificar Instalación
```bash
npx tsc --version  # Debe mostrar 5.3.3
npx vite --version # Debe mostrar 5.0.10
```

---

## 3. Reestructuración de Carpetas

### 3.1 Nueva Estructura
```
proyecto/
├── src/                    # ← NUEVO: Código fuente TypeScript
│   ├── domain/
│   │   └── entities/
│   ├── application/
│   │   └── services/
│   ├── infrastructure/
│   │   └── repositories/
│   ├── ui/
│   │   ├── components/
│   │   └── services/
│   └── shared/
├── public/                 # Assets estáticos (mantener)
│   ├── .well-known/
│   └── admin.html          # Mantener HTML
├── public-assets/          # ← NUEVO: Assets para Vite
│   ├── images/
│   └── fonts/
├── dist/                   # ← NUEVO: Build output (gitignored)
├── index.html              # ← MOVER: De public/ a raíz
├── admin.html              # ← MOVER: De public/ a raíz
├── tsconfig.json           # ← NUEVO
├── vite.config.ts          # ← NUEVO
└── package.json            # ← ACTUALIZADO
```

### 3.2 Comandos de Reestructuración
```bash
# Crear estructura de carpetas
mkdir -p src/domain/entities
mkdir -p src/application/services
mkdir -p src/infrastructure/repositories
mkdir -p src/ui/components
mkdir -p src/ui/services
mkdir -p src/shared
mkdir -p public-assets/images
mkdir -p public-assets/fonts

# Mover archivos HTML a raíz (si están en public/)
# Nota: En Windows usar PowerShell o mover manualmente
```

---

## 4. Migración de Archivos

### 4.1 Orden de Migración (Clean Architecture)

#### FASE 1: Shared Layer (Base)
1. `shared/constants.js` → `src/shared/constants.ts`
2. `shared/types.js` → `src/shared/types.ts`
3. `shared/utils.js` → `src/shared/utils.ts`
4. `shared/performance.js` → `src/shared/performance.ts`

#### FASE 2: Domain Layer (Entidades)
1. `domain/entities/Project.js` → `src/domain/entities/Project.ts`
2. `domain/entities/Education.js` → `src/domain/entities/Education.ts`
3. `domain/entities/Experience.js` → `src/domain/entities/Experience.ts`

#### FASE 3: Infrastructure Layer
1. `infrastructure/FirebaseService.js` → `src/infrastructure/FirebaseService.ts`
2. `infrastructure/AuthService.js` → `src/infrastructure/AuthService.ts`
3. `infrastructure/repositories/*.js` → `src/infrastructure/repositories/*.ts`

#### FASE 4: Application Layer
1. `application/services/*.js` → `src/application/services/*.ts`

#### FASE 5: UI Layer
1. `ui/components/*.js` → `src/ui/components/*.ts`
2. `ui/services/*.js` → `src/ui/services/*.ts`

#### FASE 6: Entry Points
1. `app.js` → `src/app.ts`
2. `admin.js` → `src/admin.ts`

### 4.2 Template de Migración por Archivo

#### Antes (JavaScript):
```javascript
/**
 * @fileoverview Descripción
 * @module module/path
 */

export class MyClass {
  constructor(data) {
    this._data = data;
  }
  
  getData() {
    return this._data;
  }
}
```

#### Después (TypeScript):
```typescript
/**
 * @fileoverview Descripción
 * @module module/path
 */

// Definir interfaces primero
export interface IMyClassData {
  id: string;
  name: string;
}

/**
 * Clase que representa...
 * @class MyClass
 */
export class MyClass {
  private readonly _data: IMyClassData;
  
  constructor(data: IMyClassData) {
    this._data = data;
    this._validate();
  }
  
  private _validate(): void {
    if (!this._data.id) {
      throw new Error('ID is required');
    }
  }
  
  getData(): IMyClassData {
    return { ...this._data }; // Inmutabilidad
  }
}
```

### 4.3 Cambios Específicos por Capa

#### Domain Entities
- ✅ Definir interfaces para todos los DTOs
- ✅ Usar `readonly` para propiedades inmutables
- ✅ Validación estricta en constructores
- ✅ Tipos explícitos en todos los métodos

#### Infrastructure
- ✅ Tipar todos los servicios de Firebase
- ✅ Manejo de errores tipado
- ✅ Interfaces para repositorios

#### Application Services
- ✅ Tipar parámetros y retornos
- ✅ Usar tipos de Domain, no tipos primitivos
- ✅ Documentar con JSDoc + TypeScript

---

## 5. Configuración de Tipos

### 5.1 Crear Archivo de Tipos Globales
Crear `src/shared/types.ts`:

```typescript
/**
 * Tipos globales y interfaces compartidas
 */

// Firebase Types
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

export type { FirebaseApp, Firestore, Auth };

// Domain Types
export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Application Types
export interface ServiceConfig {
  [key: string]: unknown;
}

// UI Types
export interface RenderOptions {
  container: HTMLElement;
  data: unknown;
}
```

### 5.2 Tipos para Firebase
Crear `src/infrastructure/types/firebase.types.ts`:

```typescript
import type { FirebaseApp, Firestore, Auth } from 'firebase/app';

export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface IFirebaseServices {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}
```

---

## 6. Testing y Validación

### 6.1 Verificar TypeScript
```bash
# Verificar tipos sin compilar
npm run type-check

# Debe pasar sin errores
```

### 6.2 Desarrollo Local
```bash
# Iniciar servidor de desarrollo
npm run dev

# Debe abrir en http://localhost:3000
```

### 6.3 Build de Producción
```bash
# Compilar TypeScript y crear build
npm run build

# Verificar que se creó la carpeta public/ con los archivos
ls public/js/
```

### 6.4 Preview Local
```bash
# Probar build de producción localmente
npm run preview

# Debe abrir en http://localhost:4173
```

---

## 7. Deployment

### 7.1 Actualizar firebase.json
El `firebase.json` ya está configurado para usar `public/` como directorio de hosting, que es donde Vite genera el build.

### 7.2 Deploy
```bash
# Deploy completo (build + deploy)
npm run deploy

# O paso a paso
npm run build
firebase deploy --only hosting
```

### 7.3 Verificar Deployment
1. Visitar: https://rickdev-90632.web.app
2. Abrir consola del navegador (F12)
3. Verificar que no hay errores
4. Verificar que los archivos JS tienen hash en el nombre

---

## 8. Checklist de Migración

### Pre-Migración
- [ ] Backup completo del proyecto
- [ ] Node.js >= 18.0.0 instalado
- [ ] Dependencias instaladas (`npm install`)

### Migración
- [ ] Estructura de carpetas creada
- [ ] Archivos HTML movidos a raíz
- [ ] Shared layer migrado
- [ ] Domain layer migrado
- [ ] Infrastructure layer migrado
- [ ] Application layer migrado
- [ ] UI layer migrado
- [ ] Entry points migrados

### Post-Migración
- [ ] `npm run type-check` pasa sin errores
- [ ] `npm run dev` funciona correctamente
- [ ] `npm run build` genera archivos correctamente
- [ ] `npm run preview` muestra la app correctamente
- [ ] Deploy a Firebase funciona
- [ ] App en producción funciona sin errores

---

## 9. Solución de Problemas

### Error: "Cannot find module"
- Verificar que los path aliases están en `tsconfig.json` y `vite.config.ts`
- Verificar que los imports usan las rutas correctas

### Error: "Type 'X' is not assignable to type 'Y'"
- Revisar las interfaces y tipos
- Verificar que los tipos de Domain se usan correctamente

### Error: Build falla
- Limpiar cache: `rm -rf node_modules dist public/js`
- Reinstalar: `npm install`
- Rebuild: `npm run build`

### Firebase no funciona
- Verificar que los imports de Firebase usan la sintaxis modular
- Verificar que `APP_CONFIG` está correctamente tipado

---

## 10. Próximos Pasos (Post-Migración)

1. **Firebase App Check**: Implementar protección adicional
2. **Web Components**: Migrar componentes UI a Web Components
3. **Testing**: Agregar Vitest para unit tests
4. **Performance**: Implementar lazy loading de módulos
5. **PWA**: Agregar service worker y manifest

---

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Modular SDK](https://firebase.google.com/docs/web/modular-upgrade)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**¡Buena suerte con la migración! 🚀**





