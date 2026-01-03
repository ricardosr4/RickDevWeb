# Configuración del Panel de Administración

## 🎯 Descripción

El panel de administración te permite gestionar todo el contenido de tu portafolio web directamente desde el navegador. Puedes editar tu perfil, agregar/modificar experiencias laborales, educación y habilidades, y todos los cambios se guardan automáticamente en Firestore.

## 🔐 Configuración Inicial

### Paso 1: Habilitar Firebase Authentication

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/project/rickdev-90632/authentication)
2. En el menú lateral, selecciona **Authentication**
3. Haz clic en **Get Started** si es la primera vez
4. En la pestaña **Sign-in method**, habilita **Email/Password**
5. Haz clic en **Email/Password** y activa la opción
6. Guarda los cambios

### Paso 2: Crear tu Cuenta de Administrador

Tienes dos opciones:

#### Opción A: Desde la Consola de Firebase (Recomendado)

1. Ve a **Authentication** → **Users**
2. Haz clic en **Add user**
3. Ingresa tu email y una contraseña segura
4. Haz clic en **Add user**

#### Opción B: Desde el Panel de Administración

1. Ve a `https://rickdev-90632.web.app/admin.html`
2. Si no tienes cuenta, puedes usar el botón "Registrarse" (si lo agregamos) o crear la cuenta desde la consola primero
3. Inicia sesión con tu email y contraseña

## 📍 Acceso al Panel

Una vez configurado, accede al panel en:

**URL:** `https://rickdev-90632.web.app/admin.html`

O desde tu sitio principal, puedes agregar un enlace discreto al panel.

## 🎨 Funcionalidades del Panel

### 1. Perfil
- Editar información personal (nombre, título, biografía)
- Actualizar datos de contacto (email, teléfono, ubicación)
- Modificar enlaces a redes sociales (LinkedIn, GitHub)

### 2. Experiencias Laborales
- **Agregar nueva experiencia**: Haz clic en "+ Agregar Experiencia"
- **Editar experiencia**: Haz clic en "Editar" en cualquier tarjeta de experiencia
- **Eliminar experiencia**: Haz clic en "Eliminar" (soft delete - se marca como inactiva)
- Campos disponibles:
  - Cargo
  - Empresa
  - Ubicación
  - Fechas de inicio y fin
  - Descripción
  - Responsabilidades (una por línea)
  - Tecnologías utilizadas
  - Orden de visualización
  - Estado (activa/inactiva)

### 3. Educación
- **Agregar nueva educación**: Haz clic en "+ Agregar Educación"
- **Editar educación**: Haz clic en "Editar" en cualquier tarjeta
- **Eliminar educación**: Haz clic en "Eliminar" (soft delete)
- Campos disponibles:
  - Título o Grado
  - Institución
  - Campo de Estudio
  - Ubicación
  - Fechas de inicio y fin
  - Descripción
  - Honores o Reconocimientos
  - Orden de visualización
  - Estado (activa/inactiva)
  - Completada (sí/no)

### 4. Habilidades
- Editar habilidades organizadas por categorías:
  - Lenguajes
  - Frameworks y UI
  - Arquitectura
  - Librerías y APIs
  - Herramientas
  - Testing
- Ingresa las habilidades separadas por comas
- Ejemplo: `Kotlin, Java, JavaScript`

## 🔒 Seguridad

- **Autenticación requerida**: Solo usuarios autenticados pueden modificar datos
- **Lectura pública**: Cualquiera puede ver el contenido del portafolio
- **Escritura protegida**: Solo tú puedes modificar el contenido
- **Reglas de Firestore**: Configuradas para permitir lectura pública y escritura solo autenticada

## 🚀 Flujo de Trabajo

1. **Inicia sesión** en el panel de administración
2. **Navega** entre las secciones usando los botones del menú superior
3. **Edita** cualquier campo que necesites modificar
4. **Guarda** los cambios haciendo clic en "Guardar Cambios"
5. **Verifica** los cambios en tu sitio principal (puede tardar unos segundos en actualizarse)

## 📝 Notas Importantes

- **Soft Delete**: Cuando eliminas una experiencia o educación, no se borra permanentemente, solo se marca como inactiva. Esto permite recuperarla si es necesario.
- **Orden**: El campo "Orden" determina el orden de visualización. Números mayores aparecen primero.
- **Fechas**: Si dejas vacía la fecha de fin en una experiencia, se mostrará como "Presente".
- **Actualización automática**: Los cambios se reflejan inmediatamente en Firestore y luego en tu sitio web.

## 🐛 Solución de Problemas

### No puedo iniciar sesión
- Verifica que Firebase Authentication esté habilitado
- Asegúrate de que el método Email/Password esté activado
- Verifica que tu cuenta exista en Authentication → Users

### Los cambios no se guardan
- Verifica que estés autenticado (deberías ver tu email en la esquina superior derecha)
- Revisa la consola del navegador (F12) para ver errores
- Verifica que las reglas de Firestore estén desplegadas correctamente

### Error de permisos
- Asegúrate de que las reglas de Firestore estén actualizadas:
  ```bash
  firebase deploy --only firestore:rules
  ```

## 🔄 Actualizar Reglas de Firestore

Si necesitas actualizar las reglas de seguridad:

```bash
firebase deploy --only firestore:rules
```

## 📞 Soporte

Si encuentras algún problema, revisa:
1. La consola del navegador (F12) para errores
2. La consola de Firebase para verificar la configuración
3. Las reglas de Firestore en la consola

---

**¡Listo!** Ya puedes gestionar tu portafolio desde el panel de administración. 🎉


