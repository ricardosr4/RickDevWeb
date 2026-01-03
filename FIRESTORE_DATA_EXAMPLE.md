# Datos de Ejemplo para Firestore - Ricardo Soto Ramirez

Este archivo contiene los datos exactos basados en el CV de Ricardo Soto Ramirez para poblar Firestore.

---

## 1. Collection: `profile`

**Document ID:** `main`

```javascript
{
  firstName: "Ricardo",
  lastName: "Soto",
  fullName: "Ricardo Soto Ramirez",
  title: "Desarrollador Android",
  bio: "Desarrollador Android con 3 años de experiencia en Kotlin, especializado en XML, Jetpack Compose y arquitecturas limpias (Clean Architecture, MVVM). Enfocado en la creación de aplicaciones robustas y escalables. Busco aportar soluciones innovadoras y liderar proyectos que lleven las aplicaciones móviles al siguiente nivel.",
  email: "ricardosr4@gmail.com",
  phone: "+569-5646-8732",
  location: "Santiago, Chile",
  website: "https://rickdev-90632.web.app",
  avatar: "", // Agregar URL cuando tengas foto
  
  social: {
    linkedin: "https://www.linkedin.com/in/ricardosotoramirez/",
    github: "https://github.com/ricardosr4",
    twitter: "",
    portfolio: "https://rickdev-90632.web.app"
  },
  
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  version: 1
}
```

---

## 2. Collection: `experiences`

### Experiencia 1: Parking S.A.

**Document ID:** `exp_parking_sa_2022`

```javascript
{
  id: "exp_parking_sa_2022",
  position: "Desarrollador Android",
  company: "Parking S.A.",
  companyUrl: "",
  companyLogo: "",
  location: "Remoto",
  
  startDate: Timestamp(2022, 8, 1), // Septiembre 2022
  endDate: null,
  isCurrent: true,
  period: "Septiembre 2022 - Presente",
  
  description: "Colaboro como desarrollador Android de manera freelance en el equipo encargado de brindar soporte, mantenimiento y mejoras continuas a la aplicación móvil. Trabajo bajo la supervisión del desarrollador principal para implementar nuevas funcionalidades y optimizar el rendimiento de la aplicación.",
  
  responsibilities: [
    "Brindar soporte y mantenimiento continuo a la aplicación móvil",
    "Implementar nuevas funcionalidades bajo supervisión del desarrollador principal",
    "Optimizar el rendimiento de la aplicación",
    "Participar en la creación de nuevas características",
    "Mejorar la experiencia del usuario y la funcionalidad general",
    "Resolver problemas técnicos",
    "Optimizar el código existente"
  ],
  
  achievements: [
    "Mejoras continuas en la experiencia del usuario",
    "Optimización del rendimiento de la aplicación"
  ],
  
  technologies: ["Kotlin", "Android", "XML", "Jetpack Compose"],
  tools: ["Git", "GitHub", "Firebase"],
  
  order: 2,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true
}
```

### Experiencia 2: Ticketera Digital Spa.

**Document ID:** `exp_ticketera_2025`

```javascript
{
  id: "exp_ticketera_2025",
  position: "Desarrollador Android",
  company: "Ticketera Digital Spa.",
  companyUrl: "",
  companyLogo: "",
  location: "Remoto",
  
  startDate: Timestamp(2025, 4, 1), // Mayo 2025
  endDate: Timestamp(2025, 8, 30), // Septiembre 2025
  isCurrent: false,
  period: "Mayo 2025 - Septiembre 2025",
  
  description: "Me especialicé en Jetpack Compose. Creé desde cero una aplicación de validación de tickets usando códigos QR y otra para la venta de entradas y productos de alimentación para tótems de autoatención. Mi trabajo se centró en el desarrollo y mantenimiento de estas apps para centros de entretención.",
  
  responsibilities: [
    "Especialización en Jetpack Compose",
    "Creación desde cero de aplicación de validación de tickets con códigos QR",
    "Desarrollo de aplicación para venta de entradas y productos de alimentación",
    "Desarrollo de aplicaciones para tótems de autoatención",
    "Mantenimiento de aplicaciones para centros de entretención"
  ],
  
  achievements: [
    "Creación exitosa de aplicación de validación de tickets QR",
    "Desarrollo de sistema de venta para tótems de autoatención"
  ],
  
  technologies: ["Kotlin", "Android", "Jetpack Compose", "QR Code"],
  tools: ["Git", "GitHub", "Figma"],
  
  order: 1,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true
}
```

---

## 3. Collection: `education`

### Educación 1: Bootcamp Refactory Life

**Document ID:** `edu_bootcamp_refactory_2024`

```javascript
{
  id: "edu_bootcamp_refactory_2024",
  degree: "Bootcamp Refactory Life",
  institution: "Refactory Life Academy",
  institutionUrl: "",
  institutionLogo: "",
  field: "Desarrollo Android",
  location: "Chile",
  
  startDate: Timestamp(2024, 2, 1), // Marzo 2024
  endDate: Timestamp(2024, 9, 30), // Octubre 2024
  period: "Marzo 2024 - Octubre 2024",
  isCompleted: true,
  
  description: "Bootcamp especializado en desarrollo Android con enfoque en Kotlin, Jetpack Compose y arquitecturas limpias.",
  specialization: "Desarrollo Android - Kotlin, Jetpack Compose, Clean Architecture",
  gpa: null,
  honors: "Egresado",
  
  order: 1,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true
}
```

### Educación 2: Enseñanza Media

**Document ID:** `edu_media_sanpedro_2007`

```javascript
{
  id: "edu_media_sanpedro_2007",
  degree: "Enseñanza Media Completa",
  institution: "Escuela San Pedro",
  institutionUrl: "",
  institutionLogo: "",
  field: "Educación Media",
  location: "Chile",
  
  startDate: Timestamp(2003, 0, 1), // 2003
  endDate: Timestamp(2007, 11, 31), // 2007
  period: "2003 - 2007",
  isCompleted: true,
  
  description: "Enseñanza media completa",
  specialization: "",
  gpa: null,
  honors: "Egresado",
  
  order: 2,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true
}
```

---

## 4. Collection: `skills`

**Estructura por categorías (Document ID: `main`)**

```javascript
{
  frontend: [
    {
      name: "Kotlin",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Lenguajes"
    }
  ],
  
  mobile: [
    {
      name: "Android",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Plataformas"
    },
    {
      name: "Jetpack Compose",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 2,
      category: "Frameworks UI"
    },
    {
      name: "XML",
      level: "Expert",
      levelNumber: 5,
      yearsOfExperience: 3,
      category: "Frameworks UI"
    },
    {
      name: "Design Responsive",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Frameworks UI"
    }
  ],
  
  architecture: [
    {
      name: "Clean Architecture",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Arquitectura"
    },
    {
      name: "Modularización",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 2,
      category: "Arquitectura"
    },
    {
      name: "Clean Code",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Arquitectura"
    },
    {
      name: "MVVM",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Arquitectura"
    },
    {
      name: "MVI",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 1,
      category: "Arquitectura"
    },
    {
      name: "SOLID",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Arquitectura"
    }
  ],
  
  libraries: [
    {
      name: "Retrofit",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Librerías y APIs"
    },
    {
      name: "Room",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Librerías y APIs"
    },
    {
      name: "Shared Preferences",
      level: "Expert",
      levelNumber: 5,
      yearsOfExperience: 3,
      category: "Librerías y APIs"
    },
    {
      name: "Hilt",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 2,
      category: "Librerías y APIs"
    }
  ],
  
  tools: [
    {
      name: "Git",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Herramientas"
    },
    {
      name: "GitHub",
      level: "Advanced",
      levelNumber: 4,
      yearsOfExperience: 3,
      category: "Herramientas"
    },
    {
      name: "Figma",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 2,
      category: "Herramientas"
    },
    {
      name: "Canva",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 2,
      category: "Herramientas"
    },
    {
      name: "Firebase",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 2,
      category: "Herramientas"
    },
    {
      name: "Gemini",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 1,
      category: "Herramientas"
    },
    {
      name: "Chat GPT",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 1,
      category: "Herramientas"
    },
    {
      name: "Cursor",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 1,
      category: "Herramientas"
    }
  ],
  
  testing: [
    {
      name: "Test Unit",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 2,
      category: "Testing"
    },
    {
      name: "Test UI",
      level: "Intermediate",
      levelNumber: 3,
      yearsOfExperience: 2,
      category: "Testing"
    }
  ],
  
  updatedAt: Timestamp.now()
}
```

**Alternativa: Estructura simplificada por categorías**

```javascript
{
  lenguajes: ["Kotlin"],
  
  frameworksUI: ["Jetpack Compose", "XML", "Design Responsive"],
  
  arquitectura: [
    "Clean Architecture",
    "Modularización",
    "Clean Code",
    "MVVM",
    "MVI",
    "SOLID"
  ],
  
  libreriasAPIs: [
    "Retrofit",
    "Room",
    "Shared Preferences",
    "Hilt"
  ],
  
  herramientas: [
    "Git",
    "GitHub",
    "Figma",
    "Canva",
    "Firebase",
    "Gemini",
    "Chat GPT",
    "Cursor"
  ],
  
  testing: ["Test Unit", "Test UI"],
  
  updatedAt: Timestamp.now()
}
```

---

## 5. Collection: `languages`

### Idioma 1: Español

**Document ID:** `lang_spanish`

```javascript
{
  id: "lang_spanish",
  name: "Español",
  level: "Native",
  levelNumber: 5,
  reading: "Native",
  writing: "Native",
  speaking: "Native",
  order: 1,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true
}
```

### Idioma 2: Inglés

**Document ID:** `lang_english`

```javascript
{
  id: "lang_english",
  name: "Inglés",
  level: "A-2",
  levelNumber: 2,
  reading: "A-2",
  writing: "A-2",
  speaking: "A-2",
  note: "En Progreso",
  order: 2,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true
}
```

---

## 6. Collection: `references` (Nueva - Opcional)

**Document ID:** `ref_kevin_maggio`

```javascript
{
  id: "ref_kevin_maggio",
  name: "Kevin Andrés Maggio",
  position: "",
  company: "MercadoLibre",
  email: "kevin.maggio@mercadolibre.com",
  phone: "+54 9 11 6239-9695",
  relationship: "Referencia profesional",
  order: 1,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true
}
```

---

## Notas Importantes

1. **Fechas**: Ajustar los Timestamps según la fecha real de creación
2. **URLs**: Agregar URLs de empresas cuando estén disponibles
3. **Logos**: Agregar URLs de logos cuando estén disponibles
4. **Avatar**: Agregar URL de foto de perfil cuando esté disponible
5. **Proyectos**: Esta colección puede poblarse después con proyectos específicos

---

## Orden de Visualización

- **Experiencias**: Orden descendente por `order` (más reciente primero)
  - Parking S.A. (order: 2) - Actual
  - Ticketera Digital (order: 1) - Pasado

- **Educación**: Orden descendente por `order` (más reciente primero)
  - Bootcamp Refactory (order: 1)
  - Enseñanza Media (order: 2)

