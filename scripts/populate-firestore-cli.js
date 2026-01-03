/**
 * @fileoverview Script para poblar Firestore usando Firebase CLI
 * Este script crea los datos directamente
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando población de Firestore...\n');

// Datos estructurados
const data = {
  profile: {
    'main': {
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
      createdAt: { _seconds: Math.floor(Date.now() / 1000) },
      updatedAt: { _seconds: Math.floor(Date.now() / 1000) }
    }
  },
  experiences: {
    'exp_parking_sa_2022': {
      id: 'exp_parking_sa_2022',
      position: 'Desarrollador Android',
      company: 'Parking S.A.',
      location: 'Remoto',
      startDate: { _seconds: 1661990400 },
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
      createdAt: { _seconds: Math.floor(Date.now() / 1000) },
      updatedAt: { _seconds: Math.floor(Date.now() / 1000) }
    },
    'exp_ticketera_2025': {
      id: 'exp_ticketera_2025',
      position: 'Desarrollador Android',
      company: 'Ticketera Digital Spa.',
      location: 'Remoto',
      startDate: { _seconds: 1746057600 },
      endDate: { _seconds: 1759276800 },
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
      createdAt: { _seconds: Math.floor(Date.now() / 1000) },
      updatedAt: { _seconds: Math.floor(Date.now() / 1000) }
    }
  },
  education: {
    'edu_bootcamp_refactory_2024': {
      id: 'edu_bootcamp_refactory_2024',
      degree: 'Bootcamp Refactory Life',
      institution: 'Refactory Life Academy',
      field: 'Desarrollo Android',
      location: 'Chile',
      startDate: { _seconds: 1709251200 },
      endDate: { _seconds: 1730332800 },
      period: 'Marzo 2024 - Octubre 2024',
      isCompleted: true,
      description: 'Bootcamp especializado en desarrollo Android con enfoque en Kotlin, Jetpack Compose y arquitecturas limpias.',
      specialization: 'Desarrollo Android - Kotlin, Jetpack Compose, Clean Architecture',
      honors: 'Egresado',
      order: 1,
      isActive: true,
      createdAt: { _seconds: Math.floor(Date.now() / 1000) },
      updatedAt: { _seconds: Math.floor(Date.now() / 1000) }
    },
    'edu_media_sanpedro_2007': {
      id: 'edu_media_sanpedro_2007',
      degree: 'Enseñanza Media Completa',
      institution: 'Escuela San Pedro',
      field: 'Educación Media',
      location: 'Chile',
      startDate: { _seconds: 1041379200 },
      endDate: { _seconds: 1199059200 },
      period: '2003 - 2007',
      isCompleted: true,
      description: 'Enseñanza media completa',
      honors: 'Egresado',
      order: 2,
      isActive: true,
      createdAt: { _seconds: Math.floor(Date.now() / 1000) },
      updatedAt: { _seconds: Math.floor(Date.now() / 1000) }
    }
  },
  skills: {
    'main': {
      lenguajes: ['Kotlin'],
      frameworksUI: ['Jetpack Compose', 'XML', 'Design Responsive'],
      arquitectura: ['Clean Architecture', 'Modularización', 'Clean Code', 'MVVM', 'MVI', 'SOLID'],
      libreriasAPIs: ['Retrofit', 'Room', 'Shared Preferences', 'Hilt'],
      herramientas: ['Git', 'GitHub', 'Figma', 'Canva', 'Firebase', 'Gemini', 'Chat GPT', 'Cursor'],
      testing: ['Test Unit', 'Test UI'],
      updatedAt: { _seconds: Math.floor(Date.now() / 1000) }
    }
  }
};

// Guardar datos en archivos JSON para importar
const dataDir = path.join(__dirname, '..', 'firestore-data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Crear archivos de datos
Object.keys(data).forEach(collection => {
  const collectionDir = path.join(dataDir, collection);
  if (!fs.existsSync(collectionDir)) {
    fs.mkdirSync(collectionDir, { recursive: true });
  }
  
  Object.keys(data[collection]).forEach(docId => {
    const filePath = path.join(collectionDir, `${docId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data[collection][docId], null, 2));
    console.log(`✓ Creado: ${collection}/${docId}.json`);
  });
});

console.log('\n✅ Archivos de datos creados en: firestore-data/');
console.log('\n📝 Para poblar Firestore, ejecuta el script populate-firestore-browser.js');
console.log('   o usa la página: https://rickdev-90632.web.app/populate-firestore.html');

