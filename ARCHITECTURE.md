# Arquitectura del Proyecto

## Visión General

Este proyecto implementa **Clean Architecture** adaptada para frontend, siguiendo principios SOLID y mejores prácticas de desarrollo moderno.

## Estructura de Carpetas

```
public/
├── js/
│   ├── domain/              # Capa de Dominio
│   │   └── entities/        # Entidades de negocio
│   ├── application/          # Capa de Aplicación
│   │   └── services/         # Servicios de lógica de negocio
│   ├── infrastructure/       # Capa de Infraestructura
│   │   └── FirebaseService.js
│   ├── ui/                   # Capa de Presentación
│   │   └── components/       # Componentes UI
│   ├── shared/               # Código compartido
│   │   ├── constants.js      # Constantes
│   │   ├── types.js          # Definiciones de tipos
│   │   ├── utils.js          # Utilidades
│   │   └── performance.js    # Optimizaciones
│   └── app.js                # Punto de entrada
├── index.html
├── styles.css
└── ...
```

## Capas de la Arquitectura

### 1. Domain Layer (Dominio)

**Responsabilidad**: Contiene las entidades de negocio y reglas del dominio.

**Archivos**:
- `domain/entities/Project.js` - Entidad de proyecto
- `domain/entities/Education.js` - Entidad de educación
- `domain/entities/Experience.js` - Entidad de experiencia laboral

**Características**:
- Entidades inmutables
- Validación de datos
- Sin dependencias externas
- Lógica de negocio pura

### 2. Application Layer (Aplicación)

**Responsabilidad**: Orquesta la lógica de negocio y coordina entre capas.

**Archivos**:
- `application/services/NavigationService.js` - Manejo de navegación
- `application/services/AnimationService.js` - Animaciones
- `application/services/HeaderService.js` - Comportamiento del header
- `application/services/ContactService.js` - Formulario de contacto

**Características**:
- Servicios desacoplados
- Single Responsibility Principle
- Fácilmente testeable
- Independiente de frameworks

### 3. Infrastructure Layer (Infraestructura)

**Responsabilidad**: Comunicación con servicios externos y APIs.

**Archivos**:
- `infrastructure/FirebaseService.js` - Inicialización de Firebase

**Características**:
- Aislamiento de dependencias externas
- Fácil de mockear en tests
- Implementación de interfaces

### 4. UI Layer (Presentación)

**Responsabilidad**: Renderizado y presentación visual.

**Archivos**:
- `ui/components/ProjectCard.js` - Componente de tarjeta de proyecto

**Características**:
- Componentes reutilizables
- Separación de lógica y presentación
- Accesibilidad integrada

### 5. Shared Layer (Compartido)

**Responsabilidad**: Utilidades y código compartido entre capas.

**Archivos**:
- `shared/constants.js` - Constantes de la aplicación
- `shared/types.js` - Definiciones de tipos JSDoc
- `shared/utils.js` - Funciones utilitarias
- `shared/performance.js` - Optimizaciones de performance

## Principios Aplicados

### SOLID

- **S**ingle Responsibility: Cada clase/servicio tiene una única responsabilidad
- **O**pen/Closed: Extensible sin modificar código existente
- **L**iskov Substitution: Interfaces consistentes
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependencias hacia abstracciones

### Clean Code

- Nombres descriptivos y significativos
- Funciones pequeñas y enfocadas
- Comentarios JSDoc completos
- Sin código duplicado
- Manejo de errores apropiado

## Tecnologías y Estándares

- **JavaScript ES2023+**: Módulos ES6, async/await, destructuring
- **HTML5 Semántico**: Elementos semánticos, ARIA labels
- **CSS Moderno**: Variables CSS, Flexbox, Grid
- **Accesibilidad**: WCAG 2.1 AA
- **Performance**: Lazy loading, code splitting, optimizaciones

## Flujo de Datos

```
UI Layer → Application Layer → Domain Layer
                ↓
        Infrastructure Layer
```

1. **UI** recibe interacción del usuario
2. **Application** procesa la lógica de negocio
3. **Domain** valida y procesa entidades
4. **Infrastructure** comunica con servicios externos
5. Flujo inverso para actualizar la UI

## Testing (Preparado para)

La arquitectura está diseñada para facilitar testing:

- **Unit Tests**: Entidades y servicios aislados
- **Integration Tests**: Servicios con dependencias mockeadas
- **E2E Tests**: Flujos completos de usuario

## Extensibilidad

Para agregar nuevas funcionalidades:

1. Crear entidad en `domain/entities/`
2. Crear servicio en `application/services/`
3. Crear componente en `ui/components/` si es necesario
4. Integrar en `app.js`

## Performance

- Lazy loading de módulos
- Code splitting preparado
- Optimización de scroll con requestAnimationFrame
- Throttle y debounce en eventos
- Preconnect y prefetch de recursos

## Mantenibilidad

- Código modular y desacoplado
- Documentación JSDoc completa
- Estructura clara y predecible
- Fácil de entender y modificar

