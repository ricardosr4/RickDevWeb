# 📝 Guía Completa: Cómo Modificar y Agregar Datos en Firestore

Esta guía te explica cómo modificar tus datos y agregar nueva información a tu sitio web.

---

## 🔍 ¿Qué Información se Está Mostrando Actualmente?

### Información que SÍ se muestra desde Firestore:

1. **Header**: Nombre (primeros 2 nombres de `fullName`)
2. **Hero**: Título (`title`) y Bio (`bio`)
3. **Experiencias**: Todas las experiencias con `isActive: true`
4. **Educación**: Todas las educaciones con `isActive: true`
5. **Habilidades**: Todas las habilidades por categoría
6. **Contacto**: Email, teléfono, ubicación, LinkedIn, GitHub

### Información que NO se muestra (pero está en Firestore):

- `achievements` de las experiencias
- `technologies` y `tools` de las experiencias (solo se muestran `responsibilities`)
- `companyUrl` y `companyLogo` de las experiencias
- `institutionUrl` y `institutionLogo` de la educación
- `avatar` del perfil
- `gpa` y otros detalles de educación

---

## 📝 Cómo Modificar Datos Existentes

### Opción 1: Desde la Consola de Firebase (Recomendado)

1. **Ve a Firestore Console:**
   ```
   https://console.firebase.google.com/project/rickdev-90632/firestore
   ```

2. **Navega a la colección que quieres modificar:**
   - `profile` → documento `main`
   - `experiences` → documento específico (ej: `exp_parking_sa_2022`)
   - `education` → documento específico
   - `skills` → documento `main`

3. **Haz clic en el documento** que quieres modificar

4. **Modifica los campos:**
   - Haz clic en un campo para editarlo
   - Cambia el valor
   - Haz clic fuera para guardar

5. **Recarga tu sitio** para ver los cambios

### Opción 2: Usar la Página de Administración (Próximamente)

Estamos creando una interfaz de administración para que puedas modificar datos fácilmente.

---

## ➕ Cómo Agregar Nueva Experiencia Laboral

### Paso 1: Crear el Documento en Firestore

1. Ve a: https://console.firebase.google.com/project/rickdev-90632/firestore
2. Haz clic en la colección `experiences`
3. Haz clic en **"Agregar documento"**
4. **ID del documento**: Usa un ID único, ej: `exp_nueva_empresa_2024`

### Paso 2: Agregar los Campos

Copia y pega esta estructura, ajustando los valores:

```javascript
{
  id: "exp_nueva_empresa_2024",
  position: "Tu Posición",
  company: "Nombre de la Empresa",
  companyUrl: "", // Opcional: URL de la empresa
  companyLogo: "", // Opcional: URL del logo
  location: "Remoto" o "Ciudad, País",
  
  // Fechas (usa el tipo "timestamp")
  startDate: (timestamp) - Fecha de inicio
  endDate: null, // null si es actual, o (timestamp) si terminó
  isCurrent: true, // true si es tu trabajo actual
  period: "Enero 2024 - Presente", // Formato legible
  
  description: "Descripción breve de tu trabajo",
  
  // Array de responsabilidades
  responsibilities: [
    "Responsabilidad 1",
    "Responsabilidad 2",
    "Responsabilidad 3"
  ],
  
  // Array de logros (opcional)
  achievements: [
    "Logro 1",
    "Logro 2"
  ],
  
  // Array de tecnologías
  technologies: ["Kotlin", "Android", "etc"],
  
  // Array de herramientas
  tools: ["Git", "GitHub", "etc"],
  
  // Orden (número mayor = más reciente)
  order: 3, // Incrementa este número para nuevas experiencias
  
  isActive: true, // true para mostrar en el sitio
  
  createdAt: (timestamp) - Fecha actual
  updatedAt: (timestamp) - Fecha actual
}
```

### Paso 3: Verificar

1. Recarga tu sitio
2. La nueva experiencia debería aparecer automáticamente

---

## ➕ Cómo Agregar Nueva Educación

### Paso 1: Crear el Documento

1. Ve a la colección `education`
2. Haz clic en **"Agregar documento"**
3. **ID**: ej: `edu_nueva_educacion_2024`

### Paso 2: Agregar Campos

```javascript
{
  id: "edu_nueva_educacion_2024",
  degree: "Título o Grado",
  institution: "Nombre de la Institución",
  institutionUrl: "", // Opcional
  institutionLogo: "", // Opcional
  field: "Campo de Estudio",
  location: "Ciudad, País",
  
  startDate: (timestamp),
  endDate: (timestamp),
  period: "2024 - 2025", // Formato legible
  isCompleted: true, // false si está en progreso
  
  description: "Descripción del programa",
  specialization: "Especialización o enfoque", // Opcional
  gpa: 4.5, // Opcional (número)
  honors: "Magna Cum Laude", // Opcional
  
  order: 3, // Incrementa para nuevas educaciones
  isActive: true,
  
  createdAt: (timestamp),
  updatedAt: (timestamp)
}
```

---

## ➕ Cómo Agregar Nuevas Habilidades

### Opción 1: Agregar a Categoría Existente

1. Ve a: `skills` → documento `main`
2. Encuentra la categoría (ej: `herramientas`)
3. Haz clic en el array
4. Haz clic en **"Agregar elemento"**
5. Escribe el nombre de la habilidad
6. Guarda

### Opción 2: Crear Nueva Categoría

1. Ve a: `skills` → documento `main`
2. Haz clic en **"Agregar campo"**
3. **Nombre del campo**: ej: `nuevaCategoria`
4. **Tipo**: `array`
5. Agrega elementos al array
6. Guarda

**Nota**: Si creas una nueva categoría, el código la mostrará automáticamente con el nombre formateado.

---

## 🔧 Cómo Agregar Nuevos Campos al Perfil

### Ejemplo: Agregar Campo "Resumen Profesional"

1. Ve a: `profile` → documento `main`
2. Haz clic en **"Agregar campo"**
3. **Nombre**: `professionalSummary`
4. **Tipo**: `string`
5. **Valor**: Tu resumen profesional
6. Guarda

### Para Mostrar el Nuevo Campo en el Sitio

Necesitarás actualizar el código de renderizado. Contacta al desarrollador o modifica `ContentRenderer.js`.

---

## 📋 Estructura Completa de Campos

### Profile (`profile/main`)

| Campo | Tipo | Requerido | Se Muestra |
|-------|------|-----------|------------|
| `firstName` | string | ✅ | No (solo en fullName) |
| `lastName` | string | ✅ | No (solo en fullName) |
| `fullName` | string | ✅ | ✅ Header |
| `title` | string | ✅ | ✅ Hero |
| `bio` | string | ✅ | ✅ Hero |
| `email` | string | ✅ | ✅ Contacto |
| `phone` | string | ⚠️ | ✅ Contacto |
| `location` | string | ⚠️ | ✅ Contacto |
| `website` | string | ⚠️ | No |
| `avatar` | string | ⚠️ | ❌ No se muestra aún |
| `social.linkedin` | string | ⚠️ | ✅ Contacto |
| `social.github` | string | ⚠️ | ✅ Contacto |
| `social.twitter` | string | ⚠️ | ❌ No se muestra aún |
| `social.portfolio` | string | ⚠️ | ❌ No se muestra aún |

### Experience (`experiences/{id}`)

| Campo | Tipo | Requerido | Se Muestra |
|-------|------|-----------|------------|
| `id` | string | ✅ | No |
| `position` | string | ✅ | ✅ Timeline |
| `company` | string | ✅ | ✅ Timeline |
| `location` | string | ⚠️ | ✅ Timeline |
| `startDate` | timestamp | ✅ | No (solo period) |
| `endDate` | timestamp/null | ⚠️ | No (solo period) |
| `isCurrent` | boolean | ✅ | No |
| `period` | string | ✅ | ✅ Timeline |
| `description` | string | ⚠️ | ❌ No se muestra aún |
| `responsibilities` | array | ✅ | ✅ Timeline |
| `achievements` | array | ⚠️ | ❌ No se muestra aún |
| `technologies` | array | ⚠️ | ❌ No se muestra aún |
| `tools` | array | ⚠️ | ❌ No se muestra aún |
| `order` | number | ✅ | No (para ordenar) |
| `isActive` | boolean | ✅ | No (filtro) |

### Education (`education/{id}`)

| Campo | Tipo | Requerido | Se Muestra |
|-------|------|-----------|------------|
| `degree` | string | ✅ | ✅ Curriculum |
| `institution` | string | ✅ | ✅ Curriculum |
| `period` | string | ✅ | ✅ Curriculum |
| `description` | string | ⚠️ | ✅ Curriculum |
| `specialization` | string | ⚠️ | ✅ Curriculum (si no hay description) |
| `gpa` | number | ⚠️ | ❌ No se muestra aún |
| `honors` | string | ⚠️ | ❌ No se muestra aún |
| `order` | number | ✅ | No (para ordenar) |
| `isActive` | boolean | ✅ | No (filtro) |

---

## 🎨 Mejorar el Renderizado (Mostrar Más Información)

Si quieres que se muestren campos adicionales (como `achievements`, `technologies`, etc.), necesitas actualizar el código de renderizado.

**Archivo a modificar**: `public/js/ui/services/ContentRenderer.js`

### Ejemplo: Mostrar Achievements en Experiencias

En el método `renderExperiences()`, puedes agregar:

```javascript
// Después de responsibilitiesList
const achievements = exp.achievements || [];
const achievementsList = achievements.length > 0 
  ? `<div class="achievements"><strong>Logros:</strong><ul>${achievements.map(a => `<li>${this._escapeHtml(a)}</li>`).join('')}</ul></div>`
  : '';

// Y agregarlo al HTML
${achievementsList}
```

---

## 🚀 Próximos Pasos

1. **Pobla Firestore** con tus datos actuales
2. **Modifica los datos** según necesites
3. **Agrega nuevas experiencias/educaciones** cuando las tengas
4. **Actualiza habilidades** regularmente

---

## 📞 ¿Necesitas Ayuda?

Si necesitas agregar campos que no se muestran actualmente, o modificar cómo se renderiza la información, puedo ayudarte a actualizar el código de renderizado.

