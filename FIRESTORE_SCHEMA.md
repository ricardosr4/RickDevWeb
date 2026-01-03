# Esquema de Base de Datos Firestore

## Estructura General

```
firestore/
├── profile/              # Información personal y profesional
├── experiences/         # Experiencias laborales
├── education/           # Formación académica
├── projects/            # Proyectos realizados
├── skills/              # Habilidades técnicas
├── certifications/       # Certificaciones
└── languages/           # Idiomas
```

---

## 1. Collection: `profile`

**Documento único con ID: `main`**

```javascript
{
  // Información Personal
  firstName: string,           // "Ricardo"
  lastName: string,            // "Soto"
  fullName: string,           // "Ricardo Soto"
  title: string,              // "Desarrollador Full Stack"
  bio: string,                // Descripción profesional breve
  email: string,              // Email de contacto
  phone: string,             // Teléfono (opcional)
  location: string,          // Ubicación (ciudad, país)
  website: string,           // URL del sitio web
  avatar: string,            // URL de la foto de perfil
  
  // Redes Sociales
  social: {
    linkedin: string,        // URL de LinkedIn
    github: string,          // URL de GitHub
    twitter: string,         // URL de Twitter (opcional)
    portfolio: string        // URL del portafolio
  },
  
  // Metadatos
  createdAt: timestamp,      // Fecha de creación
  updatedAt: timestamp,      // Última actualización
  version: number            // Versión del perfil
}
```

**Ejemplo:**
```javascript
{
  firstName: "Ricardo",
  lastName: "Soto",
  fullName: "Ricardo Soto",
  title: "Desarrollador Full Stack Senior",
  bio: "Desarrollador con más de 10 años de experiencia creando aplicaciones web profesionales...",
  email: "ricardo@ejemplo.com",
  phone: "+1234567890",
  location: "Ciudad, País",
  website: "https://rickdev-90632.web.app",
  avatar: "https://...",
  social: {
    linkedin: "https://linkedin.com/in/ricardo",
    github: "https://github.com/ricardo",
    twitter: "",
    portfolio: "https://rickdev-90632.web.app"
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  version: 1
}
```

---

## 2. Collection: `experiences`

**Subcolección o colección principal (cada documento es una experiencia)**

**Document ID:** Auto-generado o custom (ej: `exp_2023_present`)

```javascript
{
  // Información básica
  id: string,                 // ID único
  position: string,           // "Desarrollador Full Stack Senior"
  company: string,           // "Tech Solutions Inc."
  companyUrl: string,        // URL de la empresa (opcional)
  companyLogo: string,       // URL del logo (opcional)
  location: string,          // Ubicación del trabajo
  
  // Fechas
  startDate: timestamp,      // Fecha de inicio
  endDate: timestamp | null, // Fecha de fin (null si es actual)
  isCurrent: boolean,        // true si es el trabajo actual
  period: string,            // "2023 - Presente" (formato legible)
  
  // Descripción
  description: string,      // Descripción general del puesto
  responsibilities: array,   // Array de responsabilidades
  achievements: array,      // Logros destacados (opcional)
  
  // Tecnologías y herramientas
  technologies: array,      // ["React", "Node.js", "MongoDB"]
  tools: array,             // ["Git", "Docker", "AWS"]
  
  // Metadatos
  order: number,            // Orden de visualización (mayor = más reciente)
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean        // true para mostrar en el sitio
}
```

**Ejemplo:**
```javascript
{
  id: "exp_2023_present",
  position: "Desarrollador Full Stack Senior",
  company: "Tech Solutions Inc.",
  companyUrl: "https://techsolutions.com",
  companyLogo: "https://...",
  location: "Remoto",
  startDate: Timestamp(2023, 1, 1),
  endDate: null,
  isCurrent: true,
  period: "2023 - Presente",
  description: "Lideré el desarrollo de aplicaciones web escalables...",
  responsibilities: [
    "Lideré el desarrollo de aplicaciones web escalables utilizando React y Node.js",
    "Implementé mejoras que aumentaron el rendimiento en un 40%",
    "Mentoreé a un equipo de 3 desarrolladores junior",
    "Colaboré en el diseño de arquitecturas de software robustas"
  ],
  achievements: [
    "Aumenté el rendimiento en un 40%",
    "Reduje los bugs en producción en un 25%"
  ],
  technologies: ["React", "Node.js", "TypeScript", "MongoDB"],
  tools: ["Git", "Docker", "AWS", "Jest"],
  order: 3,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isActive: true
}
```

---

## 3. Collection: `education`

**Document ID:** Auto-generado o custom (ej: `edu_2020_2024`)

```javascript
{
  // Información básica
  id: string,                // ID único
  degree: string,            // "Ingeniería en Sistemas"
  institution: string,       // "Universidad Nacional"
  institutionUrl: string,    // URL de la institución (opcional)
  institutionLogo: string,   // URL del logo (opcional)
  field: string,            // Campo de estudio
  location: string,         // Ubicación de la institución
  
  // Fechas
  startDate: timestamp,     // Fecha de inicio
  endDate: timestamp,      // Fecha de graduación
  period: string,           // "2020 - 2024" (formato legible)
  isCompleted: boolean,     // true si está completado
  
  // Descripción
  description: string,      // Descripción del programa
  specialization: string,   // Especialización (opcional)
  gpa: number,             // Promedio (opcional)
  honors: string,          // Honores o distinciones (opcional)
  
  // Metadatos
  order: number,           // Orden de visualización
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean
}
```

**Ejemplo:**
```javascript
{
  id: "edu_2020_2024",
  degree: "Ingeniería en Sistemas",
  institution: "Universidad Nacional",
  institutionUrl: "https://universidad.edu",
  institutionLogo: "https://...",
  field: "Ingeniería de Software",
  location: "Ciudad, País",
  startDate: Timestamp(2020, 1, 1),
  endDate: Timestamp(2024, 12, 31),
  period: "2020 - 2024",
  isCompleted: true,
  description: "Especialización en desarrollo web y aplicaciones móviles",
  specialization: "Desarrollo Web y Aplicaciones Móviles",
  gpa: 4.5,
  honors: "Magna Cum Laude",
  order: 2,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isActive: true
}
```

---

## 4. Collection: `projects`

**Document ID:** Auto-generado o custom (ej: `proj_web_moderno`)

```javascript
{
  // Información básica
  id: string,               // ID único
  title: string,           // "Proyecto Web Moderno"
  description: string,     // Descripción del proyecto
  longDescription: string, // Descripción detallada (opcional)
  
  // URLs
  liveUrl: string,         // URL del proyecto en vivo
  githubUrl: string,       // URL del repositorio
  demoUrl: string,         // URL del demo (opcional)
  
  // Imágenes
  imageUrl: string,        // URL de la imagen principal
  images: array,           // Array de URLs de imágenes adicionales
  thumbnail: string,       // URL del thumbnail
  
  // Tecnologías
  technologies: array,     // ["HTML", "CSS", "JavaScript"]
  tags: array,            // Tags para categorización
  
  // Fechas
  startDate: timestamp,    // Fecha de inicio
  endDate: timestamp,      // Fecha de finalización
  year: number,           // Año del proyecto
  
  // Estado
  status: string,         // "completed", "in-progress", "on-hold"
  featured: boolean,      // true si es proyecto destacado
  order: number,          // Orden de visualización
  
  // Metadatos
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean
}
```

**Ejemplo:**
```javascript
{
  id: "proj_web_moderno",
  title: "Proyecto Web Moderno",
  description: "Desarrollo de una aplicación web moderna con tecnologías de vanguardia...",
  longDescription: "Aplicación web completa desarrollada con React y Node.js...",
  liveUrl: "https://proyecto.com",
  githubUrl: "https://github.com/ricardo/proyecto",
  demoUrl: "https://demo.proyecto.com",
  imageUrl: "https://...",
  images: ["https://...", "https://..."],
  thumbnail: "https://...",
  technologies: ["HTML", "CSS", "JavaScript", "React"],
  tags: ["web", "frontend", "react"],
  startDate: Timestamp(2023, 6, 1),
  endDate: Timestamp(2023, 12, 31),
  year: 2023,
  status: "completed",
  featured: true,
  order: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isActive: true
}
```

---

## 5. Collection: `skills`

**Document ID:** Auto-generado o custom (ej: `skill_frontend`)

```javascript
{
  // Información básica
  id: string,              // ID único
  name: string,           // "React"
  category: string,       // "Frontend", "Backend", "Tools", "Languages"
  icon: string,          // URL del icono (opcional)
  
  // Nivel
  level: string,         // "Beginner", "Intermediate", "Advanced", "Expert"
  levelNumber: number,   // 1-5 (1=Beginner, 5=Expert)
  yearsOfExperience: number, // Años de experiencia
  
  // Metadatos
  order: number,         // Orden dentro de la categoría
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean
}
```

**Ejemplo:**
```javascript
{
  id: "skill_react",
  name: "React",
  category: "Frontend",
  icon: "https://...",
  level: "Expert",
  levelNumber: 5,
  yearsOfExperience: 5,
  order: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isActive: true
}
```

**Alternativa: Estructura por categorías**

```javascript
// Document ID: "main"
{
  frontend: [
    { name: "HTML5", level: "Expert", years: 8 },
    { name: "CSS3", level: "Expert", years: 8 },
    { name: "JavaScript", level: "Expert", years: 7 },
    { name: "React", level: "Expert", years: 5 },
    { name: "Vue.js", level: "Advanced", years: 3 }
  ],
  backend: [
    { name: "Node.js", level: "Expert", years: 5 },
    { name: "Python", level: "Advanced", years: 4 },
    { name: "Express", level: "Expert", years: 5 },
    { name: "MongoDB", level: "Advanced", years: 4 },
    { name: "Firebase", level: "Advanced", years: 3 }
  ],
  tools: [
    { name: "Git", level: "Expert", years: 8 },
    { name: "Docker", level: "Intermediate", years: 2 },
    { name: "Figma", level: "Advanced", years: 3 },
    { name: "VS Code", level: "Expert", years: 7 }
  ],
  updatedAt: timestamp
}
```

---

## 6. Collection: `certifications` (Opcional)

**Document ID:** Auto-generado

```javascript
{
  id: string,              // ID único
  name: string,           // "AWS Certified Developer"
  issuer: string,         // "Amazon Web Services"
  issuerUrl: string,      // URL del emisor
  credentialId: string,   // ID de la credencial
  credentialUrl: string,  // URL de verificación
  issueDate: timestamp,   // Fecha de emisión
  expiryDate: timestamp,  // Fecha de expiración (null si no expira)
  imageUrl: string,         // URL del badge/certificado
  
  // Metadatos
  order: number,
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean
}
```

---

## 7. Collection: `languages` (Opcional)

**Document ID:** Auto-generado

```javascript
{
  id: string,              // ID único
  name: string,           // "Español", "English"
  level: string,          // "Native", "Fluent", "Intermediate", "Basic"
  levelNumber: number,    // 1-5
  reading: string,        // Nivel de lectura
  writing: string,        // Nivel de escritura
  speaking: string,       // Nivel de habla
  
  // Metadatos
  order: number,
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean
}
```

---

## Índices Recomendados para Firestore

```javascript
// experiences collection
- order (descending) - Para ordenar por más reciente
- isActive (ascending) + order (descending) - Para filtrar activos
- startDate (descending) - Para ordenar por fecha

// education collection
- order (descending) - Para ordenar por más reciente
- endDate (descending) - Para ordenar por fecha de graduación

// projects collection
- featured (descending) + order (ascending) - Para proyectos destacados
- year (descending) - Para ordenar por año
- status (ascending) + order (descending) - Para filtrar por estado

// skills collection
- category (ascending) + order (ascending) - Para agrupar por categoría
```

---

## Reglas de Seguridad Sugeridas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Profile: Solo lectura pública
    match /profile/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Experiences: Solo lectura pública
    match /experiences/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Education: Solo lectura pública
    match /education/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Projects: Solo lectura pública
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Skills: Solo lectura pública
    match /skills/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Notas de Implementación

1. **Timestamps**: Usar `Timestamp` de Firestore para todas las fechas
2. **IDs**: Pueden ser auto-generados o custom (recomendado custom para mejor control)
3. **Orden**: Usar campo `order` para controlar el orden de visualización
4. **Soft Delete**: Usar campo `isActive` en lugar de borrar documentos
5. **Versionado**: Considerar agregar campo `version` para control de cambios
6. **Índices**: Crear índices compuestos para consultas complejas

---

## Ejemplo de Consultas Comunes

```javascript
// Obtener todas las experiencias activas ordenadas
db.collection('experiences')
  .where('isActive', '==', true)
  .orderBy('order', 'desc')
  .get()

// Obtener educación completada
db.collection('education')
  .where('isCompleted', '==', true)
  .where('isActive', '==', true)
  .orderBy('order', 'desc')
  .get()

// Obtener proyectos destacados
db.collection('projects')
  .where('featured', '==', true)
  .where('isActive', '==', true)
  .orderBy('order', 'asc')
  .get()

// Obtener habilidades por categoría
db.collection('skills')
  .where('category', '==', 'Frontend')
  .where('isActive', '==', true)
  .orderBy('order', 'asc')
  .get()
```

