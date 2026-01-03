# Guía Rápida: Poblar Firestore Manualmente

Esta es una guía rápida para poblar Firestore desde la consola de Firebase.

## Paso 1: Acceder a Firestore

1. Ve a: https://console.firebase.google.com/project/rickdev-90632/firestore
2. Si Firestore no está habilitado, haz clic en **Crear base de datos**
3. Selecciona **Modo de prueba** (para desarrollo) o **Modo de producción**
4. Elige ubicación: `us-central` o la más cercana

## Paso 2: Crear Colecciones y Documentos

### Collection: `profile` → Document: `main`

Haz clic en **Iniciar colección**:
- ID de colección: `profile`
- ID del documento: `main`

**Campos a agregar:**

| Campo | Tipo | Valor |
|-------|------|-------|
| firstName | string | `Ricardo` |
| lastName | string | `Soto` |
| fullName | string | `Ricardo Soto Ramirez` |
| title | string | `Desarrollador Android` |
| bio | string | `Desarrollador Android con 3 años de experiencia en Kotlin, especializado en XML, Jetpack Compose y arquitecturas limpias (Clean Architecture, MVVM). Enfocado en la creación de aplicaciones robustas y escalables. Busco aportar soluciones innovadoras y liderar proyectos que lleven las aplicaciones móviles al siguiente nivel.` |
| email | string | `ricardosr4@gmail.com` |
| phone | string | `+569-5646-8732` |
| location | string | `Santiago, Chile` |
| website | string | `https://rickdev-90632.web.app` |
| avatar | string | (dejar vacío) |
| social | map | Ver abajo |
| version | number | `1` |
| createdAt | timestamp | (usar "Set timestamp" con fecha actual) |
| updatedAt | timestamp | (usar "Set timestamp" con fecha actual) |

**Para el campo `social` (map):**
- Haz clic en "Agregar campo" → Tipo: `map`
- Dentro del map, agrega:
  - `linkedin` (string): `https://www.linkedin.com/in/ricardosotoramirez/`
  - `github` (string): `https://github.com/ricardosr4`
  - `twitter` (string): (dejar vacío)
  - `portfolio` (string): `https://rickdev-90632.web.app`

---

### Collection: `experiences`

#### Documento 1: `exp_parking_sa_2022`

**Campos:**

| Campo | Tipo | Valor |
|-------|------|-------|
| id | string | `exp_parking_sa_2022` |
| position | string | `Desarrollador Android` |
| company | string | `Parking S.A.` |
| location | string | `Remoto` |
| startDate | timestamp | `2022-09-01` (Septiembre 1, 2022) |
| endDate | null | (seleccionar "null") |
| isCurrent | boolean | `true` |
| period | string | `Septiembre 2022 - Presente` |
| description | string | `Colaboro como desarrollador Android de manera freelance en el equipo encargado de brindar soporte, mantenimiento y mejoras continuas a la aplicación móvil. Trabajo bajo la supervisión del desarrollador principal para implementar nuevas funcionalidades y optimizar el rendimiento de la aplicación.` |
| responsibilities | array | Ver abajo |
| achievements | array | Ver abajo |
| technologies | array | `["Kotlin", "Android", "XML", "Jetpack Compose"]` |
| tools | array | `["Git", "GitHub", "Firebase"]` |
| order | number | `2` |
| isActive | boolean | `true` |
| createdAt | timestamp | (fecha actual) |
| updatedAt | timestamp | (fecha actual) |

**Array `responsibilities`:**
1. `Brindar soporte y mantenimiento continuo a la aplicación móvil`
2. `Implementar nuevas funcionalidades bajo supervisión del desarrollador principal`
3. `Optimizar el rendimiento de la aplicación`
4. `Participar en la creación de nuevas características`
5. `Mejorar la experiencia del usuario y la funcionalidad general`
6. `Resolver problemas técnicos`
7. `Optimizar el código existente`

**Array `achievements`:**
1. `Mejoras continuas en la experiencia del usuario`
2. `Optimización del rendimiento de la aplicación`

#### Documento 2: `exp_ticketera_2025`

**Campos similares, pero con estos valores específicos:**

| Campo | Valor |
|-------|-------|
| id | `exp_ticketera_2025` |
| company | `Ticketera Digital Spa.` |
| startDate | `2025-05-01` |
| endDate | `2025-09-30` |
| isCurrent | `false` |
| period | `Mayo 2025 - Septiembre 2025` |
| description | `Me especialicé en Jetpack Compose. Creé desde cero una aplicación de validación de tickets usando códigos QR y otra para la venta de entradas y productos de alimentación para tótems de autoatención. Mi trabajo se centró en el desarrollo y mantenimiento de estas apps para centros de entretención.` |
| responsibilities | Ver abajo |
| technologies | `["Kotlin", "Android", "Jetpack Compose", "QR Code"]` |
| tools | `["Git", "GitHub", "Figma"]` |
| order | `1` |

**Array `responsibilities` (Ticketera):**
1. `Especialización en Jetpack Compose`
2. `Creación desde cero de aplicación de validación de tickets con códigos QR`
3. `Desarrollo de aplicación para venta de entradas y productos de alimentación`
4. `Desarrollo de aplicaciones para tótems de autoatención`
5. `Mantenimiento de aplicaciones para centros de entretención`

---

### Collection: `education`

#### Documento 1: `edu_bootcamp_refactory_2024`

| Campo | Tipo | Valor |
|-------|------|-------|
| id | string | `edu_bootcamp_refactory_2024` |
| degree | string | `Bootcamp Refactory Life` |
| institution | string | `Refactory Life Academy` |
| field | string | `Desarrollo Android` |
| location | string | `Chile` |
| startDate | timestamp | `2024-03-01` |
| endDate | timestamp | `2024-10-30` |
| period | string | `Marzo 2024 - Octubre 2024` |
| isCompleted | boolean | `true` |
| description | string | `Bootcamp especializado en desarrollo Android con enfoque en Kotlin, Jetpack Compose y arquitecturas limpias.` |
| specialization | string | `Desarrollo Android - Kotlin, Jetpack Compose, Clean Architecture` |
| honors | string | `Egresado` |
| order | number | `1` |
| isActive | boolean | `true` |

#### Documento 2: `edu_media_sanpedro_2007`

| Campo | Valor |
|-------|-------|
| id | `edu_media_sanpedro_2007` |
| degree | `Enseñanza Media Completa` |
| institution | `Escuela San Pedro` |
| field | `Educación Media` |
| startDate | `2003-01-01` |
| endDate | `2007-12-31` |
| period | `2003 - 2007` |
| description | `Enseñanza media completa` |
| order | `2` |

---

### Collection: `skills` → Document: `main`

**Campos (todos arrays):**

| Campo | Tipo | Valores (array) |
|-------|------|-----------------|
| lenguajes | array | `["Kotlin"]` |
| frameworksUI | array | `["Jetpack Compose", "XML", "Design Responsive"]` |
| arquitectura | array | `["Clean Architecture", "Modularización", "Clean Code", "MVVM", "MVI", "SOLID"]` |
| libreriasAPIs | array | `["Retrofit", "Room", "Shared Preferences", "Hilt"]` |
| herramientas | array | `["Git", "GitHub", "Figma", "Canva", "Firebase", "Gemini", "Chat GPT", "Cursor"]` |
| testing | array | `["Test Unit", "Test UI"]` |
| updatedAt | timestamp | (fecha actual) |

## Paso 3: Verificar

1. Ve a tu sitio: https://rickdev-90632.web.app
2. Abre la consola del navegador (F12)
3. Deberías ver: "Datos cargados desde Firestore correctamente"
4. El contenido debería actualizarse dinámicamente

## Notas Importantes

- ⚠️ Los **timestamps** deben ser del tipo `timestamp` (no string)
- ⚠️ Los **arrays** deben ser del tipo `array` (agregar elementos uno por uno)
- ⚠️ Los **maps** deben ser del tipo `map` (agregar campos dentro del map)
- ⚠️ Los **booleanos** deben ser `true` o `false` (no strings)
- ⚠️ Los **números** deben ser del tipo `number`

## Solución Rápida de Problemas

**Si no ves los datos:**
1. Verifica que las colecciones estén creadas
2. Verifica que los nombres de campos coincidan exactamente
3. Revisa la consola del navegador para errores
4. Verifica las reglas de seguridad de Firestore

