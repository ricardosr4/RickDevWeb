/**
 * @fileoverview Script para poblar Firestore con datos del CV
 * @module scripts/populate-firestore
 * 
 * Uso: node scripts/populate-firestore.js
 * 
 * Requiere: Firebase Admin SDK configurado
 */

// Nota: Este script requiere Firebase Admin SDK
// Para usarlo, necesitas:
// 1. npm install firebase-admin
// 2. Configurar las credenciales de servicio de Firebase
// 3. O usar variables de entorno

console.log('📝 Script para poblar Firestore');
console.log('');
console.log('Este script poblará Firestore con los datos de tu CV.');
console.log('');
console.log('⚠️  IMPORTANTE: Este script requiere Firebase Admin SDK.');
console.log('Para usarlo, necesitas:');
console.log('1. Habilitar Firestore en Firebase Console');
console.log('2. Obtener las credenciales de servicio');
console.log('3. Configurar las credenciales');
console.log('');
console.log('Alternativamente, puedes poblar Firestore manualmente desde la consola:');
console.log('https://console.firebase.google.com/project/rickdev-90632/firestore');
console.log('');
console.log('Ver el archivo FIRESTORE_SETUP.md para instrucciones detalladas.');
console.log('');

// Datos estructurados para Firestore
const firestoreData = {
  profile: {
    id: 'main',
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
    version: 1
  },
  experiences: [
    {
      id: 'exp_parking_sa_2022',
      position: 'Desarrollador Android',
      company: 'Parking S.A.',
      companyUrl: '',
      companyLogo: '',
      location: 'Remoto',
      startDate: new Date('2022-09-01'),
      endDate: null,
      isCurrent: true,
      period: 'Septiembre 2022 - Presente',
      description: 'Colaboro como desarrollador Android de manera freelance en el equipo encargado de brindar soporte, mantenimiento y mejoras continuas a la aplicación móvil. Trabajo bajo la supervisión del desarrollador principal para implementar nuevas funcionalidades y optimizar el rendimiento de la aplicación.',
      responsibilities: [
        'Brindar soporte y mantenimiento continuo a la aplicación móvil',
        'Implementar nuevas funcionalidades bajo supervisión del desarrollador principal',
        'Optimizar el rendimiento de la aplicación',
        'Participar en la creación de nuevas características',
        'Mejorar la experiencia del usuario y la funcionalidad general',
        'Resolver problemas técnicos',
        'Optimizar el código existente'
      ],
      achievements: [
        'Mejoras continuas en la experiencia del usuario',
        'Optimización del rendimiento de la aplicación'
      ],
      technologies: ['Kotlin', 'Android', 'XML', 'Jetpack Compose'],
      tools: ['Git', 'GitHub', 'Firebase'],
      order: 2,
      isActive: true
    },
    {
      id: 'exp_ticketera_2025',
      position: 'Desarrollador Android',
      company: 'Ticketera Digital Spa.',
      companyUrl: '',
      companyLogo: '',
      location: 'Remoto',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-09-30'),
      isCurrent: false,
      period: 'Mayo 2025 - Septiembre 2025',
      description: 'Me especialicé en Jetpack Compose. Creé desde cero una aplicación de validación de tickets usando códigos QR y otra para la venta de entradas y productos de alimentación para tótems de autoatención. Mi trabajo se centró en el desarrollo y mantenimiento de estas apps para centros de entretención.',
      responsibilities: [
        'Especialización en Jetpack Compose',
        'Creación desde cero de aplicación de validación de tickets con códigos QR',
        'Desarrollo de aplicación para venta de entradas y productos de alimentación',
        'Desarrollo de aplicaciones para tótems de autoatención',
        'Mantenimiento de aplicaciones para centros de entretención'
      ],
      achievements: [
        'Creación exitosa de aplicación de validación de tickets QR',
        'Desarrollo de sistema de venta para tótems de autoatención'
      ],
      technologies: ['Kotlin', 'Android', 'Jetpack Compose', 'QR Code'],
      tools: ['Git', 'GitHub', 'Figma'],
      order: 1,
      isActive: true
    }
  ],
  educations: [
    {
      id: 'edu_bootcamp_refactory_2024',
      degree: 'Bootcamp Refactory Life',
      institution: 'Refactory Life Academy',
      institutionUrl: '',
      institutionLogo: '',
      field: 'Desarrollo Android',
      location: 'Chile',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-10-30'),
      period: 'Marzo 2024 - Octubre 2024',
      isCompleted: true,
      description: 'Bootcamp especializado en desarrollo Android con enfoque en Kotlin, Jetpack Compose y arquitecturas limpias.',
      specialization: 'Desarrollo Android - Kotlin, Jetpack Compose, Clean Architecture',
      gpa: null,
      honors: 'Egresado',
      order: 1,
      isActive: true
    },
    {
      id: 'edu_media_sanpedro_2007',
      degree: 'Enseñanza Media Completa',
      institution: 'Escuela San Pedro',
      institutionUrl: '',
      institutionLogo: '',
      field: 'Educación Media',
      location: 'Chile',
      startDate: new Date('2003-01-01'),
      endDate: new Date('2007-12-31'),
      period: '2003 - 2007',
      isCompleted: true,
      description: 'Enseñanza media completa',
      specialization: '',
      gpa: null,
      honors: 'Egresado',
      order: 2,
      isActive: true
    }
  ],
  skills: {
    lenguajes: ['Kotlin'],
    frameworksUI: ['Jetpack Compose', 'XML', 'Design Responsive'],
    arquitectura: [
      'Clean Architecture',
      'Modularización',
      'Clean Code',
      'MVVM',
      'MVI',
      'SOLID'
    ],
    libreriasAPIs: ['Retrofit', 'Room', 'Shared Preferences', 'Hilt'],
    herramientas: [
      'Git',
      'GitHub',
      'Figma',
      'Canva',
      'Firebase',
      'Gemini',
      'Chat GPT',
      'Cursor'
    ],
    testing: ['Test Unit', 'Test UI']
  }
};

// Función para convertir fechas a Firestore Timestamps
function convertToFirestoreTimestamp(date) {
  if (!date) return null;
  // Si ya es un objeto Date, retornarlo
  if (date instanceof Date) return date;
  // Si es string, convertirlo
  return new Date(date);
}

// Función para poblar Firestore (requiere Firebase Admin)
async function populateFirestore() {
  try {
    // Intentar importar Firebase Admin
    const admin = require('firebase-admin');
    
    // Inicializar Firebase Admin si no está inicializado
    if (!admin.apps.length) {
      // Intentar usar credenciales de servicio
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : null;
      
      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        // Usar Application Default Credentials
        admin.initializeApp();
      }
    }

    const db = admin.firestore();
    const batch = db.batch();

    console.log('🚀 Iniciando población de Firestore...\n');

    // 1. Poblar Profile
    console.log('📝 Poblando collection: profile');
    const profileRef = db.collection('profile').doc('main');
    const profileData = {
      ...firestoreData.profile,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    batch.set(profileRef, profileData);
    console.log('   ✓ Profile creado');

    // 2. Poblar Experiences
    console.log('📝 Poblando collection: experiences');
    firestoreData.experiences.forEach(exp => {
      const expRef = db.collection('experiences').doc(exp.id);
      const expData = {
        ...exp,
        startDate: admin.firestore.Timestamp.fromDate(convertToFirestoreTimestamp(exp.startDate)),
        endDate: exp.endDate ? admin.firestore.Timestamp.fromDate(convertToFirestoreTimestamp(exp.endDate)) : null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      batch.set(expRef, expData);
      console.log(`   ✓ Experiencia "${exp.company}" creada`);
    });

    // 3. Poblar Education
    console.log('📝 Poblando collection: education');
    firestoreData.educations.forEach(edu => {
      const eduRef = db.collection('education').doc(edu.id);
      const eduData = {
        ...edu,
        startDate: admin.firestore.Timestamp.fromDate(convertToFirestoreTimestamp(edu.startDate)),
        endDate: admin.firestore.Timestamp.fromDate(convertToFirestoreTimestamp(edu.endDate)),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      batch.set(eduRef, eduData);
      console.log(`   ✓ Educación "${edu.institution}" creada`);
    });

    // 4. Poblar Skills
    console.log('📝 Poblando collection: skills');
    const skillsRef = db.collection('skills').doc('main');
    const skillsData = {
      ...firestoreData.skills,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    batch.set(skillsRef, skillsData);
    console.log('   ✓ Skills creados');

    // Ejecutar batch
    await batch.commit();
    console.log('\n✅ ¡Firestore poblado exitosamente!');
    console.log('\n🌐 Verifica en: https://console.firebase.google.com/project/rickdev-90632/firestore');
    console.log('🌐 Tu sitio: https://rickdev-90632.web.app');

  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\n❌ Error: Firebase Admin SDK no está instalado.');
      console.log('\nPara instalar:');
      console.log('  npm install firebase-admin');
      console.log('\nO pobla Firestore manualmente desde la consola.');
    } else {
      console.error('\n❌ Error al poblar Firestore:', error.message);
      console.error('\nDetalles:', error);
    }
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  populateFirestore().catch(console.error);
}

module.exports = { populateFirestore, firestoreData };

