# 🚀 Poblar Firestore AHORA - Guía Rápida

## Opción 1: Usar la Página Web (MÁS FÁCIL) ⭐

1. **Abre esta URL en tu navegador:**
   ```
   https://rickdev-90632.web.app/populate-firestore.html
   ```

2. **Haz clic en el botón "Poblar Firestore"**

3. **Espera a que termine** (verás los logs en tiempo real)

4. **¡Listo!** Recarga tu sitio principal para ver los cambios

---

## Opción 2: Desde la Consola del Navegador

1. **Ve a tu sitio:** https://rickdev-90632.web.app

2. **Abre la consola del navegador** (F12 o clic derecho → Inspeccionar → Console)

3. **Copia y pega este código completo:**

```javascript
(async function() {
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
    const { getFirestore, doc, setDoc, Timestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    const firebaseConfig = {
      apiKey: "AIzaSyCOf2Kp2IU8EH6onnlzAnzBfjOkAa1qsFY",
      authDomain: "rickdev-90632.firebaseapp.com",
      projectId: "rickdev-90632",
      storageBucket: "rickdev-90632.firebasestorage.app",
      messagingSenderId: "333903910924",
      appId: "1:333903910924:web:2f45d011d23c6b966f7629"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('🚀 Iniciando población...');

    // Profile
    await setDoc(doc(db, 'profile', 'main'), {
      firstName: 'Ricardo',
      lastName: 'Soto',
      fullName: 'Ricardo Soto Ramirez',
      title: 'Desarrollador Android',
      bio: 'Desarrollador Android con 3 años de experiencia en Kotlin, especializado en XML, Jetpack Compose y arquitecturas limpias (Clean Architecture, MVVM). Enfocado en la creación de aplicaciones robustas y escalables. Busco aportar soluciones innovadoras y liderar proyectos que lleven las aplicaciones móviles al siguiente nivel.',
      email: 'ricardosr4@gmail.com',
      phone: '+569-5646-8732',
      location: 'Santiago, Chile',
      website: 'https://rickdev-90632.web.app',
      avatar: '',
      social: {
        linkedin: 'https://www.linkedin.com/in/ricardosotoramirez/',
        github: 'https://github.com/ricardosr4',
        twitter: '',
        portfolio: 'https://rickdev-90632.web.app'
      },
      version: 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('✅ Profile creado');

    // Experience 1
    await setDoc(doc(db, 'experiences', 'exp_parking_sa_2022'), {
      id: 'exp_parking_sa_2022',
      position: 'Desarrollador Android',
      company: 'Parking S.A.',
      location: 'Remoto',
      startDate: Timestamp.fromDate(new Date('2022-09-01')),
      endDate: null,
      isCurrent: true,
      period: 'Septiembre 2022 - Presente',
      description: 'Colaboro como desarrollador Android de manera freelance en el equipo encargado de brindar soporte, mantenimiento y mejoras continuas a la aplicación móvil.',
      responsibilities: [
        'Brindar soporte y mantenimiento continuo a la aplicación móvil',
        'Implementar nuevas funcionalidades bajo supervisión del desarrollador principal',
        'Optimizar el rendimiento de la aplicación',
        'Participar en la creación de nuevas características',
        'Mejorar la experiencia del usuario y la funcionalidad general',
        'Resolver problemas técnicos',
        'Optimizar el código existente'
      ],
      technologies: ['Kotlin', 'Android', 'XML', 'Jetpack Compose'],
      tools: ['Git', 'GitHub', 'Firebase'],
      order: 2,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('✅ Experiencia 1 creada');

    // Experience 2
    await setDoc(doc(db, 'experiences', 'exp_ticketera_2025'), {
      id: 'exp_ticketera_2025',
      position: 'Desarrollador Android',
      company: 'Ticketera Digital Spa.',
      location: 'Remoto',
      startDate: Timestamp.fromDate(new Date('2025-05-01')),
      endDate: Timestamp.fromDate(new Date('2025-09-30')),
      isCurrent: false,
      period: 'Mayo 2025 - Septiembre 2025',
      description: 'Me especialicé en Jetpack Compose. Creé desde cero una aplicación de validación de tickets usando códigos QR.',
      responsibilities: [
        'Especialización en Jetpack Compose',
        'Creación desde cero de aplicación de validación de tickets con códigos QR',
        'Desarrollo de aplicación para venta de entradas y productos de alimentación',
        'Desarrollo de aplicaciones para tótems de autoatención',
        'Mantenimiento de aplicaciones para centros de entretención'
      ],
      technologies: ['Kotlin', 'Android', 'Jetpack Compose', 'QR Code'],
      tools: ['Git', 'GitHub', 'Figma'],
      order: 1,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('✅ Experiencia 2 creada');

    // Education 1
    await setDoc(doc(db, 'education', 'edu_bootcamp_refactory_2024'), {
      id: 'edu_bootcamp_refactory_2024',
      degree: 'Bootcamp Refactory Life',
      institution: 'Refactory Life Academy',
      field: 'Desarrollo Android',
      location: 'Chile',
      startDate: Timestamp.fromDate(new Date('2024-03-01')),
      endDate: Timestamp.fromDate(new Date('2024-10-30')),
      period: 'Marzo 2024 - Octubre 2024',
      isCompleted: true,
      description: 'Bootcamp especializado en desarrollo Android con enfoque en Kotlin, Jetpack Compose y arquitecturas limpias.',
      specialization: 'Desarrollo Android - Kotlin, Jetpack Compose, Clean Architecture',
      honors: 'Egresado',
      order: 1,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('✅ Educación 1 creada');

    // Education 2
    await setDoc(doc(db, 'education', 'edu_media_sanpedro_2007'), {
      id: 'edu_media_sanpedro_2007',
      degree: 'Enseñanza Media Completa',
      institution: 'Escuela San Pedro',
      field: 'Educación Media',
      location: 'Chile',
      startDate: Timestamp.fromDate(new Date('2003-01-01')),
      endDate: Timestamp.fromDate(new Date('2007-12-31')),
      period: '2003 - 2007',
      isCompleted: true,
      description: 'Enseñanza media completa',
      honors: 'Egresado',
      order: 2,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('✅ Educación 2 creada');

    // Skills
    await setDoc(doc(db, 'skills', 'main'), {
      lenguajes: ['Kotlin'],
      frameworksUI: ['Jetpack Compose', 'XML', 'Design Responsive'],
      arquitectura: ['Clean Architecture', 'Modularización', 'Clean Code', 'MVVM', 'MVI', 'SOLID'],
      libreriasAPIs: ['Retrofit', 'Room', 'Shared Preferences', 'Hilt'],
      herramientas: ['Git', 'GitHub', 'Figma', 'Canva', 'Firebase', 'Gemini', 'Chat GPT', 'Cursor'],
      testing: ['Test Unit', 'Test UI'],
      updatedAt: Timestamp.now()
    });
    console.log('✅ Skills creados');

    console.log('🎉 ¡Firestore poblado exitosamente!');
    alert('¡Firestore poblado exitosamente! Recarga la página para ver los cambios.');

  } catch (error) {
    console.error('❌ Error:', error);
    alert('Error: ' + error.message);
  }
})();
```

4. **Presiona Enter** y espera a que termine

5. **Recarga la página** para ver los cambios

---

## Verificar que Funcionó

1. **Ve a la consola de Firestore:**
   https://console.firebase.google.com/project/rickdev-90632/firestore

2. **Deberías ver 4 colecciones:**
   - `profile` (1 documento)
   - `experiences` (2 documentos)
   - `education` (2 documentos)
   - `skills` (1 documento)

3. **Recarga tu sitio:** https://rickdev-90632.web.app
   - Abre la consola (F12)
   - Deberías ver: "Datos cargados desde Firestore correctamente"

---

## ⚠️ Si hay Errores

**Error: "Permission denied"**
- Las reglas de Firestore ya están configuradas para permitir escritura
- Si persiste, verifica en: https://console.firebase.google.com/project/rickdev-90632/firestore/rules

**Error: "Firestore not enabled"**
- Ve a: https://console.firebase.google.com/project/rickdev-90632/firestore
- Haz clic en "Crear base de datos"
- Selecciona "Modo de prueba"
- Elige ubicación y haz clic en "Habilitar"

---

## ✅ Listo!

Una vez poblado, tu sitio cargará los datos automáticamente desde Firestore.

