# 📧 Configurar EmailJS para el Formulario de Contacto

## ¿Qué es EmailJS?
EmailJS es un servicio gratuito que permite enviar emails directamente desde el frontend sin necesidad de un servidor backend.

## 🚀 Pasos para Configurar EmailJS

### Paso 1: Crear cuenta en EmailJS
1. Ve a: https://www.emailjs.com/
2. Haz clic en **"Sign Up"** (es gratis)
3. Crea tu cuenta con tu email

### Paso 2: Crear un Servicio de Email
1. Una vez dentro de EmailJS, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"** (o el servicio de email que uses)
4. Conecta tu cuenta de Gmail (ricardo.sr.developer@gmail.com)
5. Guarda el **Service ID** (algo como `service_xxxxx`)

### Paso 3: Crear una Plantilla de Email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Configura la plantilla así:

**Subject (Asunto):**
```
Nuevo mensaje de contacto desde tu portafolio - {{from_name}}
```

**Content (Contenido):**
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

4. Guarda la plantilla y copia el **Template ID** (algo como `template_xxxxx`)

### Paso 4: Obtener tu Public Key
1. Ve a **"Account"** > **"General"**
2. Copia tu **Public Key** (algo como `xxxxxxxxxxxxx`)

### Paso 5: Configurar en el Código
1. Abre el archivo: `src/application/services/ContactService.ts`
2. Busca estas líneas (alrededor de la línea 200):
```typescript
const serviceId = 'service_ricardo_portfolio';
const templateId = 'template_contact_form';
const publicKey = 'YOUR_PUBLIC_KEY';
```

3. Reemplaza con tus valores reales:
```typescript
const serviceId = 'service_xxxxx'; // Tu Service ID
const templateId = 'template_xxxxx'; // Tu Template ID
const publicKey = 'xxxxxxxxxxxxx'; // Tu Public Key
```

### Paso 6: Probar
1. Guarda los cambios
2. Ejecuta `npm run build`
3. Prueba el formulario en tu sitio web
4. Deberías recibir el email en ricardo.sr.developer@gmail.com

## 📋 Variables de la Plantilla

Las variables disponibles en la plantilla son:
- `{{from_name}}` - Nombre de quien envía
- `{{from_email}}` - Email de quien envía
- `{{message}}` - Mensaje del formulario
- `{{to_email}}` - Tu email (ricardo.sr.developer@gmail.com)
- `{{reply_to}}` - Email para responder (igual a from_email)

## ⚠️ Límites del Plan Gratuito

El plan gratuito de EmailJS incluye:
- 200 emails por mes
- Suficiente para un portafolio personal

## 🔒 Seguridad

- El Public Key es seguro de exponer en el frontend
- EmailJS valida las peticiones
- Los emails se envían directamente desde tu cuenta de Gmail

## 🆘 Si Tienes Problemas

1. Verifica que el Service ID, Template ID y Public Key sean correctos
2. Revisa la consola del navegador (F12) para ver errores
3. Asegúrate de que el servicio de email esté conectado correctamente
4. Verifica que la plantilla tenga las variables correctas

