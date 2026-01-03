/**
 * @fileoverview Script para poblar Firestore usando Firebase Web SDK
 * Este script se puede ejecutar en el navegador o con Node.js
 * @module scripts/populate-firestore-web
 */

// Este script usa el SDK web de Firebase para poblar Firestore
// Requiere autenticación, así que se ejecutará desde la consola del navegador

const firestoreData = {
  profile: {
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
      startDate: { seconds: 1661990400 }, // 2022-09-01
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
      startDate: { seconds: 1746057600 }, // 2025-05-01
      endDate: { seconds: 1759276800 }, // 2025-09-30
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
      startDate: { seconds: 1709251200 }, // 2024-03-01
      endDate: { seconds: 1730332800 }, // 2024-10-30
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
      startDate: { seconds: 1041379200 }, // 2003-01-01
      endDate: { seconds: 1199059200 }, // 2007-12-31
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

console.log('📝 Script de datos para poblar Firestore');
console.log('');
console.log('Para usar este script:');
console.log('1. Abre la consola de Firebase: https://console.firebase.google.com/project/rickdev-90632/firestore');
console.log('2. O usa el script populate-firestore-admin.js con Firebase Admin SDK');
console.log('');
console.log('Datos preparados:', firestoreData);

module.exports = { firestoreData };

