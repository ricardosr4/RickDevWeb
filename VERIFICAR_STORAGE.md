# Checklist para Verificar Firebase Storage

## ✅ Pasos de Verificación:

### 1. Verificar que Storage esté habilitado
- [ ] Ve a: https://console.firebase.google.com/project/rickdev-90632/storage
- [ ] Debes ver una pantalla con archivos o "No hay archivos" (NO el mensaje de actualizar plan)
- [ ] Si ves "Actualizar proyecto", haz clic y configura Storage

### 2. Verificar las Reglas de Storage
- [ ] Ve a la pestaña **"Rules"** en Storage
- [ ] Las reglas deben ser:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

- [ ] Haz clic en **"Publicar"** si hiciste cambios

### 3. Verificar Autenticación
- [ ] Abre el admin: https://rickdev-90632.web.app/admin.html
- [ ] Inicia sesión correctamente
- [ ] Verifica que estés autenticado (deberías ver el dashboard)

### 4. Verificar en la Consola del Navegador
1. Presiona **F12** para abrir la consola
2. Ve a la pestaña **"Console"**
3. Intenta subir una imagen
4. Busca estos mensajes:
   - ✅ "Usuario autenticado: [tu-email]"
   - ✅ "Storage obtenido"
   - ✅ "Storage bucket: rickdev-90632.firebasestorage.app"
   - ❌ Si ves errores, cópialos y compártelos

### 5. Verificar Configuración de Firebase
- [ ] Ve a: https://console.firebase.google.com/project/rickdev-90632/settings/general
- [ ] Verifica que el **Storage bucket** esté configurado
- [ ] Debe ser algo como: `rickdev-90632.firebasestorage.app`

### 6. Errores Comunes y Soluciones

#### Error: "CORS policy" o "preflight request"
**Solución**: Storage no está habilitado o las reglas están mal configuradas
1. Ve a Storage en Firebase Console
2. Verifica que esté habilitado (debes ver archivos o "No hay archivos")
3. Verifica las reglas (deben permitir `write: if request.auth != null`)

#### Error: "unauthenticated" o "Debes estar autenticado"
**Solución**: 
1. Cierra sesión en el admin
2. Inicia sesión nuevamente
3. Intenta subir la imagen de nuevo

#### Error: "403 Forbidden"
**Solución**: Las reglas de Storage no permiten escritura
1. Ve a Storage > Rules
2. Asegúrate de que las reglas incluyan: `allow write: if request.auth != null;`
3. Haz clic en "Publicar"

#### Error: "storage/unknown" o "ERR_FAILED"
**Solución**: 
1. Verifica tu conexión a internet
2. Espera 2-3 minutos después de habilitar Storage
3. Recarga la página del admin
4. Intenta de nuevo

## 🔍 Información para Debug

Si sigues teniendo problemas, comparte esta información:

1. **Mensajes de la consola** (F12 > Console)
2. **Estado de Storage** (¿ves archivos o el mensaje de actualizar?)
3. **Reglas actuales** (copia las reglas de Storage > Rules)
4. **¿Estás autenticado?** (¿ves el dashboard o la pantalla de login?)

