# 🔧 Solucionar Error 400 de EmailJS

## ❌ Error Actual:
```
Failed to load resource: the server responded with a status of 400
Error al enviar el formulario
```

## 🔍 Causas Comunes del Error 400:

### 1. Credenciales No Configuradas
Si ves este error, probablemente las credenciales de EmailJS no están configuradas.

**Solución:**
1. Abre: `src/application/services/ContactService.ts`
2. Busca estas líneas (alrededor de línea 200):
```typescript
const serviceId = 'service_ricardo_portfolio';
const templateId = 'template_contact_form';
const publicKey = 'YOUR_PUBLIC_KEY';
```

3. Reemplaza con tus valores reales de EmailJS

### 2. Service ID Incorrecto
El Service ID debe ser el que creaste en EmailJS.

**Cómo verificar:**
1. Ve a EmailJS Dashboard
2. Ve a "Email Services"
3. Copia el Service ID (algo como `service_xxxxx`)

### 3. Template ID Incorrecto
El Template ID debe ser el de la plantilla que creaste.

**Cómo verificar:**
1. Ve a EmailJS Dashboard
2. Ve a "Email Templates"
3. Copia el Template ID (algo como `template_xxxxx`)

### 4. Public Key Incorrecto
El Public Key debe ser el de tu cuenta de EmailJS.

**Cómo verificar:**
1. Ve a EmailJS Dashboard
2. Ve a "Account" > "General"
3. Copia tu Public Key

### 5. Variables de Plantilla Incorrectas
La plantilla debe tener las variables correctas.

**Variables requeridas en la plantilla:**
- `{{from_name}}`
- `{{from_email}}`
- `{{message}}`

**Cómo verificar:**
1. Ve a EmailJS Dashboard
2. Ve a "Email Templates"
3. Abre tu plantilla
4. Verifica que tenga estas variables

## ✅ Pasos para Solucionar:

### Paso 1: Verificar que EmailJS esté Configurado
1. Abre: `src/application/services/ContactService.ts`
2. Verifica que las credenciales NO sean los valores por defecto:
   - ❌ `service_ricardo_portfolio` (valor por defecto)
   - ❌ `template_contact_form` (valor por defecto)
   - ❌ `YOUR_PUBLIC_KEY` (valor por defecto)

### Paso 2: Configurar EmailJS (Si No Lo Has Hecho)
1. Sigue las instrucciones en: `CONFIGURAR_EMAILJS.md`
2. Crea tu cuenta en EmailJS
3. Configura el servicio de email
4. Crea la plantilla
5. Obtén tus credenciales

### Paso 3: Actualizar las Credenciales
1. Abre: `src/application/services/ContactService.ts`
2. Reemplaza:
```typescript
const serviceId = 'TU_SERVICE_ID_REAL'; // Ejemplo: 'service_abc123'
const templateId = 'TU_TEMPLATE_ID_REAL'; // Ejemplo: 'template_xyz789'
const publicKey = 'TU_PUBLIC_KEY_REAL'; // Ejemplo: 'abcdefghijklmnop'
```

### Paso 4: Recompilar y Probar
1. Ejecuta: `npm run build`
2. Prueba el formulario nuevamente

## 🧪 Cómo Probar:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta enviar el formulario
4. Busca estos mensajes:
   - ✅ "Enviando email con EmailJS..." (debe aparecer)
   - ✅ "Email enviado exitosamente" (si funciona)
   - ❌ Mensajes de error específicos (si falla)

## 📋 Checklist:

Antes de probar, verifica:
- [ ] Tienes una cuenta en EmailJS
- [ ] Has creado un servicio de email
- [ ] Has creado una plantilla de email
- [ ] Has copiado tu Service ID
- [ ] Has copiado tu Template ID
- [ ] Has copiado tu Public Key
- [ ] Has actualizado las credenciales en `ContactService.ts`
- [ ] Has ejecutado `npm run build`
- [ ] Has hecho deploy o estás probando en desarrollo

## 🆘 Si Aún No Funciona:

1. **Verifica en la consola** qué error específico aparece
2. **Revisa EmailJS Dashboard** que el servicio esté activo
3. **Verifica la plantilla** que tenga las variables correctas
4. **Prueba desde EmailJS** usando el botón "Test" en la plantilla

## 💡 Tip:

Si quieres probar sin configurar EmailJS primero, puedes comentar temporalmente el código de EmailJS y usar `console.log` para ver los datos:

```typescript
// Temporalmente, solo para probar
console.log('Datos del formulario:', formData);
this._showMessage('Formulario validado correctamente (EmailJS no configurado)', 'success');
```

Pero recuerda configurar EmailJS para que los emails lleguen realmente.

