# 📧 Configurar EmailJS - GUÍA COMPLETA PASO A PASO

## ⚠️ PROBLEMA ACTUAL:
```
Error 400: The Public Key is invalid
```

Esto significa que **NO has configurado EmailJS** o las credenciales son incorrectas.

## ✅ SOLUCIÓN COMPLETA (10 minutos):

### PASO 1: Crear Cuenta en EmailJS
1. Ve a: **https://www.emailjs.com/**
2. Haz clic en **"Sign Up"** (es GRATIS)
3. Crea tu cuenta con tu email: **ricardo.sr.developer@gmail.com**

### PASO 2: Crear Servicio de Email
1. Una vez dentro del dashboard, ve a **"Email Services"** (menú lateral)
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"**
4. Conecta tu cuenta de Gmail: **ricardo.sr.developer@gmail.com**
5. Autoriza el acceso
6. **COPIA el Service ID** (algo como `service_abc123xyz`)
   - Se muestra después de crear el servicio
   - Ejemplo: `service_ricardo_gmail`

### PASO 3: Crear Plantilla de Email
1. Ve a **"Email Templates"** (menú lateral)
2. Haz clic en **"Create New Template"**
3. Configura así:

**Subject (Asunto):**
```
Nuevo mensaje de contacto - {{from_name}}
```

**Content (Contenido HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Nuevo Mensaje de Contacto</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
    <p style="margin: 0 0 20px 0; font-size: 16px;">Has recibido un nuevo mensaje desde tu portafolio web:</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #6366f1;">
      <p style="margin: 0 0 10px 0;"><strong style="color: #6366f1;">Nombre:</strong> {{from_name}}</p>
      <p style="margin: 0 0 10px 0;"><strong style="color: #6366f1;">Email:</strong> {{from_email}}</p>
      <p style="margin: 0;"><strong style="color: #6366f1;">Mensaje:</strong></p>
      <div style="margin-top: 10px; padding: 15px; background: #f3f4f6; border-radius: 5px; white-space: pre-wrap;">{{message}}</div>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">Puedes responder directamente a: <a href="mailto:{{from_email}}" style="color: #6366f1; text-decoration: none;">{{from_email}}</a></p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0;">Este mensaje fue enviado desde tu portafolio web</p>
  </div>
</body>
</html>
```

4. **IMPORTANTE**: Asegúrate de que la plantilla tenga estas variables:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{message}}`

5. Haz clic en **"Save"**
6. **COPIA el Template ID** (algo como `template_abc123xyz`)
   - Se muestra en la lista de plantillas
   - Ejemplo: `template_contact_portfolio`

### PASO 4: Obtener tu Public Key
1. Haz clic en tu **nombre de usuario** (arriba a la derecha)
2. O ve directamente a: **https://dashboard.emailjs.com/admin/account**
3. Busca la sección **"API Keys"** o **"Public Key"**
4. **COPIA tu Public Key** completa
   - Debe tener al menos 10 caracteres
   - Ejemplo: `abcdefghijklmnopqrstuvwxyz123456`

### PASO 5: Actualizar el Código
1. Abre el archivo: **`src/application/services/ContactService.ts`**
2. Busca estas líneas (alrededor de línea 241-243):
   ```typescript
   const serviceId = 'service_ricardo_portfolio';
   const templateId = 'template_contact_form';
   const publicKey = 'YOUR_PUBLIC_KEY';
   ```

3. **REEMPLAZA** con tus valores reales:
   ```typescript
   const serviceId = 'service_abc123xyz'; // Tu Service ID real
   const templateId = 'template_abc123xyz'; // Tu Template ID real
   const publicKey = 'abcdefghijklmnopqrstuvwxyz123456'; // Tu Public Key real
   ```

4. **GUARDA** el archivo

### PASO 6: Recompilar y Deployar
1. Abre la terminal en la carpeta del proyecto
2. Ejecuta:
   ```bash
   npm run build
   ```
3. Si no hay errores, ejecuta:
   ```bash
   npm run predeploy
   ```
4. Luego:
   ```bash
   firebase deploy --only hosting
   ```

### PASO 7: Probar
1. Ve a tu sitio: **https://rickdev-90632.web.app**
2. Ve a la sección de **Contacto**
3. Llena el formulario:
   - Nombre: Test
   - Email: test@test.com
   - Mensaje: Este es un mensaje de prueba
4. Haz clic en **"Enviar Mensaje"**
5. Deberías ver: **"¡Mensaje enviado exitosamente!"**
6. Revisa tu email: **ricardo.sr.developer@gmail.com**

## 📋 CHECKLIST FINAL:

Antes de probar, verifica:
- [ ] Tienes cuenta en EmailJS
- [ ] Has creado un servicio de email (Gmail)
- [ ] Has copiado tu **Service ID**
- [ ] Has creado una plantilla de email
- [ ] La plantilla tiene las variables: `{{from_name}}`, `{{from_email}}`, `{{message}}`
- [ ] Has copiado tu **Template ID**
- [ ] Has copiado tu **Public Key** (de al menos 10 caracteres)
- [ ] Has actualizado las 3 credenciales en `ContactService.ts`
- [ ] Has guardado el archivo
- [ ] Has ejecutado `npm run build` (sin errores)
- [ ] Has hecho deploy

## 🔍 CÓMO VERIFICAR TUS CREDENCIALES:

### Service ID:
- Formato: `service_xxxxx`
- Dónde: EmailJS Dashboard > Email Services > Tu servicio

### Template ID:
- Formato: `template_xxxxx`
- Dónde: EmailJS Dashboard > Email Templates > Tu plantilla

### Public Key:
- Formato: Cadena de texto larga (mínimo 10 caracteres)
- Dónde: EmailJS Dashboard > Account > API Keys > Public Key

## ⚠️ ERRORES COMUNES:

### Error: "The Public Key is invalid"
- **Causa**: La Public Key no está configurada o es incorrecta
- **Solución**: Ve a https://dashboard.emailjs.com/admin/account y copia tu Public Key real

### Error: "Service ID not found"
- **Causa**: El Service ID no existe o es incorrecto
- **Solución**: Verifica que el servicio esté creado y copia el ID correcto

### Error: "Template ID not found"
- **Causa**: El Template ID no existe o es incorrecto
- **Solución**: Verifica que la plantilla esté creada y copia el ID correcto

## 🆘 SI AÚN NO FUNCIONA:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta enviar el formulario
4. Copia el error completo y compártelo

## 💡 IMPORTANTE:

- El email de destino está configurado correctamente: **ricardo.sr.developer@gmail.com**
- El problema es que **NO has configurado EmailJS** todavía
- Una vez que configures las 3 credenciales (Service ID, Template ID, Public Key), funcionará

