# Cómo Habilitar Firebase Storage (GRATIS)

## ⚠️ IMPORTANTE: Storage está disponible en el plan GRATIS (Spark)

No necesitas pagar. Solo necesitas habilitarlo.

## Pasos para Habilitar Storage:

### Paso 1: Habilitar Storage
1. Ve a: https://console.firebase.google.com/project/rickdev-90632/storage
2. Si ves el mensaje "Para usar Storage, actualiza el plan de facturación":
   - **NO necesitas actualizar el plan**
   - Haz clic en **"Actualizar proyecto"** (esto solo habilita Storage, NO cambia el plan)
   - O busca un botón que diga **"Empezar"** o **"Get Started"**

### Paso 2: Configurar Storage
1. Selecciona el modo de Storage:
   - **Modo de producción**: Más seguro (recomendado)
   - **Modo de prueba**: Para desarrollo (permite todo por 30 días)
   
2. Para desarrollo rápido, elige **"Modo de prueba"**

3. Selecciona una ubicación (ej: `us-central1` o `southamerica-east1` para Chile)

4. Haz clic en **"Listo"** o **"Done"**

### Paso 3: Configurar Reglas de Seguridad
1. Ve a la pestaña **"Rules"** (Reglas) en Storage
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública
    match /profile/{allPaths=**} {
      allow read: if true;
      // Permitir escritura solo a usuarios autenticados
      allow write: if request.auth != null;
    }
    
    // Para otros archivos, solo lectura pública
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Haz clic en **"Publicar"** o **"Publish"**

### Paso 4: Verificar
1. Deberías ver una pantalla con "No hay archivos" o una carpeta vacía
2. Esto significa que Storage está habilitado correctamente

## Nota Importante:
- El plan **Spark (gratis)** incluye:
  - 5 GB de almacenamiento
  - 1 GB de descarga por día
  - Esto es más que suficiente para un portafolio personal

## Si sigues viendo el error:
1. Espera 2-3 minutos después de habilitar Storage
2. Recarga la página del admin
3. Intenta subir la imagen nuevamente




