# 🚀 Inicio Rápido: Poblar Firestore

## Opción 1: Desde la Consola de Firebase (Recomendado para empezar)

### Paso 1: Habilitar Firestore

1. Ve a: https://console.firebase.google.com/project/rickdev-90632/firestore
2. Si no está habilitado, haz clic en **Crear base de datos**
3. Selecciona **Modo de prueba** (para desarrollo rápido)
4. Elige ubicación: `us-central` o la más cercana

### Paso 2: Poblar Manualmente

Sigue la guía detallada en: **`scripts/populate-firestore-manual.md`**

O la guía completa en: **`FIRESTORE_SETUP.md`**

---

## Opción 2: Script Automático (Requiere configuración)

### Paso 1: Instalar Firebase Admin SDK

```bash
npm install firebase-admin
```

### Paso 2: Obtener Credenciales de Servicio

1. Ve a: https://console.firebase.google.com/project/rickdev-90632/settings/serviceaccounts/adminsdk
2. Haz clic en **Generar nueva clave privada**
3. Descarga el archivo JSON
4. Guárdalo como `firebase-service-account.json` en la raíz del proyecto
5. ⚠️ **IMPORTANTE**: Agrega este archivo a `.gitignore`

### Paso 3: Configurar el Script

Edita `scripts/populate-firestore.js` y agrega:

```javascript
const serviceAccount = require('../firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

### Paso 4: Ejecutar el Script

```bash
npm run populate:firestore
```

---

## Opción 3: Usar Firebase CLI (Alternativa)

Puedes usar Firebase CLI para importar datos desde un archivo JSON.

1. Crea un archivo `firestore-data.json` con la estructura
2. Usa: `firebase firestore:import firestore-data.json`

---

## ✅ Verificación

Una vez poblado Firestore:

1. Ve a tu sitio: https://rickdev-90632.web.app
2. Abre la consola del navegador (F12)
3. Deberías ver: **"Datos cargados desde Firestore correctamente"**
4. El contenido debería actualizarse automáticamente

---

## 📚 Documentación Completa

- **`FIRESTORE_SETUP.md`** - Guía completa paso a paso
- **`scripts/populate-firestore-manual.md`** - Guía rápida manual
- **`FIRESTORE_DATA_EXAMPLE.md`** - Datos exactos en formato JavaScript

---

## ⚠️ Notas Importantes

- Si Firestore está vacío, el sitio mostrará los datos estáticos del HTML
- Los datos se cargan automáticamente cuando Firestore tiene contenido
- No necesitas reiniciar el servidor, solo recargar la página

