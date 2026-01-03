# 🔑 Cómo Obtener tu Public Key de EmailJS

## ❌ Error Actual:
```
The Public Key is invalid. To find this ID, visit https://dashboard.emailjs.com/admin/account
```

## ✅ Solución Paso a Paso:

### Paso 1: Iniciar Sesión en EmailJS
1. Ve a: https://dashboard.emailjs.com/
2. Inicia sesión con tu cuenta de EmailJS

### Paso 2: Ir a la Configuración de la Cuenta
1. Una vez dentro del dashboard, haz clic en tu **nombre de usuario** (arriba a la derecha)
2. O ve directamente a: https://dashboard.emailjs.com/admin/account

### Paso 3: Encontrar tu Public Key
1. En la página de "Account" o "General", busca la sección **"API Keys"** o **"Public Key"**
2. Verás algo como:
   ```
   Public Key: abcdefghijklmnopqrstuvwxyz123456
   ```
3. **COPIA** esta Public Key completa

### Paso 4: Actualizar en el Código
1. Abre el archivo: `src/application/services/ContactService.ts`
2. Busca esta línea (alrededor de línea 245):
   ```typescript
   const publicKey = 'YOUR_PUBLIC_KEY';
   ```
3. Reemplaza con tu Public Key real:
   ```typescript
   const publicKey = 'abcdefghijklmnopqrstuvwxyz123456'; // Tu Public Key real
   ```

### Paso 5: Verificar que Sea Correcta
- ✅ La Public Key debe tener **al menos 10 caracteres**
- ✅ No debe tener espacios
- ✅ Debe ser una cadena de texto continua
- ✅ Copia y pega exactamente como aparece en EmailJS

### Paso 6: Recompilar y Probar
1. Guarda el archivo
2. Ejecuta: `npm run build`
3. Haz deploy: `npm run predeploy && firebase deploy --only hosting`
4. Prueba el formulario nuevamente

## 📋 Checklist:

Antes de probar, verifica:
- [ ] Estás logueado en EmailJS Dashboard
- [ ] Has ido a: https://dashboard.emailjs.com/admin/account
- [ ] Has copiado tu Public Key completa
- [ ] Has actualizado la Public Key en `ContactService.ts`
- [ ] La Public Key tiene al menos 10 caracteres
- [ ] No hay espacios en la Public Key
- [ ] Has guardado el archivo
- [ ] Has recompilado el proyecto

## 🔍 Ubicación Visual:

En el dashboard de EmailJS, la Public Key generalmente está en:
- **Account** > **General** > **API Keys** > **Public Key**

O también puede estar en:
- **Settings** > **API Keys** > **Public Key**

## ⚠️ Importante:

- La Public Key es **pública** y es seguro exponerla en el frontend
- No la confundas con la **Private Key** (que no debes usar en el frontend)
- Si no ves la Public Key, asegúrate de estar en la sección correcta del dashboard

## 🆘 Si No Encuentras la Public Key:

1. Verifica que estés en la página correcta: https://dashboard.emailjs.com/admin/account
2. Busca en el menú lateral: "Account", "Settings", "API Keys", o "General"
3. Si aún no la encuentras, crea una nueva cuenta de EmailJS o contacta al soporte

## 💡 Tip:

Si ya tienes una Public Key pero sigue dando error, intenta:
1. Generar una nueva Public Key (si EmailJS lo permite)
2. Verificar que no haya espacios al inicio o final al copiar
3. Asegurarte de que estés usando la Public Key, no la Private Key


