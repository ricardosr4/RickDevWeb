# Guía para Poblar Firestore

Esta guía te ayudará a poblar Firestore con tus datos del CV.

## Prerequisitos

1. Tener Firebase configurado en tu proyecto
2. Tener acceso a la consola de Firebase: https://console.firebase.google.com/project/rickdev-90632
3. Habilitar Firestore Database en tu proyecto

## Paso 1: Habilitar Firestore

1. Ve a la consola de Firebase: https://console.firebase.google.com/project/rickdev-90632
2. En el menú lateral, selecciona **Firestore Database**
3. Si no está habilitado, haz clic en **Crear base de datos**
4. Selecciona modo de producción o modo de prueba (para desarrollo)
5. Elige una ubicación (ej: `us-central`)

## Paso 2: Configurar Reglas de Seguridad

Ve a **Reglas** en Firestore y configura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública, escritura solo autenticada
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Paso 3: Crear las Colecciones

### 3.1. Collection: `profile`

1. Haz clic en **Iniciar colección**
2. ID de colección: `profile`
3. ID del documento: `main`
4. Agrega los siguientes campos:

```javascript
firstName: "Ricardo" (string)
lastName: "Soto" (string)
fullName: "Ricardo Soto Ramirez" (string)
title: "Desarrollador Android" (string)
bio: "Desarrollador Android con 3 años de experiencia en Kotlin..." (string)
email: "ricardosr4@gmail.com" (string)
phone: "+569-5646-8732" (string)
location: "Santiago, Chile" (string)
website: "https://rickdev-90632.web.app" (string)
avatar: "" (string - opcional)
social: (map)
  linkedin: "https://www.linkedin.com/in/ricardosotoramirez/" (string)
  github: "https://github.com/ricardosr4" (string)
  twitter: "" (string)
  portfolio: "https://rickdev-90632.web.app" (string)
createdAt: (timestamp) - Usar "Set timestamp" con fecha actual
updatedAt: (timestamp) - Usar "Set timestamp" con fecha actual
version: 1 (number)
```

### 3.2. Collection: `experiences`

1. Haz clic en **Iniciar colección**
2. ID de colección: `experiences`
3. Crea el primer documento con ID: `exp_parking_sa_2022`

**Experiencia 1: Parking S.A.**

```javascript
id: "exp_parking_sa_2022" (string)
position: "Desarrollador Android" (string)
company: "Parking S.A." (string)
companyUrl: "" (string - opcional)
companyLogo: "" (string - opcional)
location: "Remoto" (string)
startDate: (timestamp) - Septiembre 1, 2022
endDate: null (null)
isCurrent: true (boolean)
period: "Septiembre 2022 - Presente" (string)
description: "Colaboro como desarrollador Android..." (string)
responsibilities: (array)
  - "Brindar soporte y mantenimiento continuo a la aplicación móvil"
  - "Implementar nuevas funcionalidades bajo supervisión del desarrollador principal"
  - "Optimizar el rendimiento de la aplicación"
  - "Participar en la creación de nuevas características"
  - "Mejorar la experiencia del usuario y la funcionalidad general"
  - "Resolver problemas técnicos"
  - "Optimizar el código existente"
achievements: (array)
  - "Mejoras continuas en la experiencia del usuario"
  - "Optimización del rendimiento de la aplicación"
technologies: (array)
  - "Kotlin"
  - "Android"
  - "XML"
  - "Jetpack Compose"
tools: (array)
  - "Git"
  - "GitHub"
  - "Firebase"
order: 2 (number)
createdAt: (timestamp)
updatedAt: (timestamp)
isActive: true (boolean)
```

4. Crea el segundo documento con ID: `exp_ticketera_2025`

**Experiencia 2: Ticketera Digital Spa.**

```javascript
id: "exp_ticketera_2025" (string)
position: "Desarrollador Android" (string)
company: "Ticketera Digital Spa." (string)
location: "Remoto" (string)
startDate: (timestamp) - Mayo 1, 2025
endDate: (timestamp) - Septiembre 30, 2025
isCurrent: false (boolean)
period: "Mayo 2025 - Septiembre 2025" (string)
description: "Me especialicé en Jetpack Compose..." (string)
responsibilities: (array)
  - "Especialización en Jetpack Compose"
  - "Creación desde cero de aplicación de validación de tickets con códigos QR"
  - "Desarrollo de aplicación para venta de entradas y productos de alimentación"
  - "Desarrollo de aplicaciones para tótems de autoatención"
  - "Mantenimiento de aplicaciones para centros de entretención"
achievements: (array)
  - "Creación exitosa de aplicación de validación de tickets QR"
  - "Desarrollo de sistema de venta para tótems de autoatención"
technologies: (array)
  - "Kotlin"
  - "Android"
  - "Jetpack Compose"
  - "QR Code"
tools: (array)
  - "Git"
  - "GitHub"
  - "Figma"
order: 1 (number)
createdAt: (timestamp)
updatedAt: (timestamp)
isActive: true (boolean)
```

### 3.3. Collection: `education`

1. Haz clic en **Iniciar colección**
2. ID de colección: `education`
3. Crea el primer documento con ID: `edu_bootcamp_refactory_2024`

**Educación 1: Bootcamp Refactory Life**

```javascript
id: "edu_bootcamp_refactory_2024" (string)
degree: "Bootcamp Refactory Life" (string)
institution: "Refactory Life Academy" (string)
institutionUrl: "" (string - opcional)
institutionLogo: "" (string - opcional)
field: "Desarrollo Android" (string)
location: "Chile" (string)
startDate: (timestamp) - Marzo 1, 2024
endDate: (timestamp) - Octubre 30, 2024
period: "Marzo 2024 - Octubre 2024" (string)
isCompleted: true (boolean)
description: "Bootcamp especializado en desarrollo Android..." (string)
specialization: "Desarrollo Android - Kotlin, Jetpack Compose, Clean Architecture" (string)
gpa: null (null)
honors: "Egresado" (string)
order: 1 (number)
createdAt: (timestamp)
updatedAt: (timestamp)
isActive: true (boolean)
```

4. Crea el segundo documento con ID: `edu_media_sanpedro_2007`

**Educación 2: Enseñanza Media**

```javascript
id: "edu_media_sanpedro_2007" (string)
degree: "Enseñanza Media Completa" (string)
institution: "Escuela San Pedro" (string)
field: "Educación Media" (string)
location: "Chile" (string)
startDate: (timestamp) - Enero 1, 2003
endDate: (timestamp) - Diciembre 31, 2007
period: "2003 - 2007" (string)
isCompleted: true (boolean)
description: "Enseñanza media completa" (string)
specialization: "" (string)
gpa: null (null)
honors: "Egresado" (string)
order: 2 (number)
createdAt: (timestamp)
updatedAt: (timestamp)
isActive: true (boolean)
```

### 3.4. Collection: `skills`

1. Haz clic en **Iniciar colección**
2. ID de colección: `skills`
3. ID del documento: `main`
4. Agrega los siguientes campos como arrays:

```javascript
lenguajes: (array)
  - "Kotlin"

frameworksUI: (array)
  - "Jetpack Compose"
  - "XML"
  - "Design Responsive"

arquitectura: (array)
  - "Clean Architecture"
  - "Modularización"
  - "Clean Code"
  - "MVVM"
  - "MVI"
  - "SOLID"

libreriasAPIs: (array)
  - "Retrofit"
  - "Room"
  - "Shared Preferences"
  - "Hilt"

herramientas: (array)
  - "Git"
  - "GitHub"
  - "Figma"
  - "Canva"
  - "Firebase"
  - "Gemini"
  - "Chat GPT"
  - "Cursor"

testing: (array)
  - "Test Unit"
  - "Test UI"

updatedAt: (timestamp)
```

## Paso 4: Crear Índices

Firestore puede requerir índices compuestos. Si ves un error al consultar, Firebase te dará un enlace para crear el índice automáticamente.

Índices recomendados:
- `experiences`: `isActive` (ascending) + `order` (descending)
- `education`: `isActive` (ascending) + `order` (descending)

## Paso 5: Verificar

1. Ve a tu sitio: https://rickdev-90632.web.app
2. Abre la consola del navegador (F12)
3. Deberías ver: "Datos cargados desde Firestore correctamente"
4. Si hay errores, verifica:
   - Que las colecciones estén creadas correctamente
   - Que los nombres de campos coincidan exactamente
   - Que las reglas de seguridad permitan lectura pública

## Notas Importantes

- Los timestamps deben ser del tipo `timestamp` en Firestore
- Los arrays deben ser del tipo `array` en Firestore
- Los maps (objetos) deben ser del tipo `map` en Firestore
- Los booleanos deben ser `true` o `false` (no strings)
- Los números deben ser del tipo `number`

## Solución de Problemas

**Error: "Permission denied"**
- Verifica las reglas de seguridad de Firestore
- Asegúrate de que `allow read: if true;` esté configurado

**Error: "Index required"**
- Haz clic en el enlace que Firebase proporciona para crear el índice automáticamente

**Los datos no se cargan**
- Abre la consola del navegador y revisa los errores
- Verifica que los nombres de las colecciones y campos coincidan exactamente
- Asegúrate de que Firestore esté habilitado en tu proyecto

## Referencia Rápida

Ver el archivo `FIRESTORE_DATA_EXAMPLE.md` para ver los datos exactos en formato JavaScript que puedes copiar y adaptar.

