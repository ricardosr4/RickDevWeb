# 🔀 Flujo de Trabajo con Git

Este documento describe el flujo de trabajo profesional con Git para este proyecto.

## 📋 Estructura de Ramas

El proyecto utiliza un modelo de ramas basado en **Git Flow**:

- **`main`**: Código en producción. Solo se actualiza mediante merge desde `develop` o `hotfix/*`.
- **`develop`**: Rama de desarrollo principal. Todas las nuevas funcionalidades se integran aquí.
- **`feature/*`**: Ramas para nuevas funcionalidades (ej: `feature/nueva-seccion-proyectos`).
- **`fix/*`**: Ramas para correcciones de bugs (ej: `fix/error-login`).
- **`hotfix/*`**: Ramas para correcciones urgentes en producción (ej: `hotfix/error-critico`).

## 🚀 Comandos Básicos

### Verificar estado
```bash
git status
git branch -a  # Ver todas las ramas
```

### Trabajar en una nueva funcionalidad
```bash
# 1. Asegúrate de estar en develop y actualizada
git checkout develop
git pull origin develop

# 2. Crea una nueva rama para tu tarea
git checkout -b feature/nombre-de-tu-tarea

# 3. Trabaja en tu tarea y haz commits frecuentes
git add .
git commit -m "Descripción clara de lo que hiciste"

# 4. Cuando termines, vuelve a develop y haz merge
git checkout develop
git merge feature/nombre-de-tu-tarea

# 5. Sube los cambios
git push origin develop

# 6. Elimina la rama local (opcional)
git branch -d feature/nombre-de-tu-tarea
```

### Trabajar en una corrección de bug
```bash
# Similar a feature, pero con fix/
git checkout develop
git pull origin develop
git checkout -b fix/descripcion-del-bug

# ... trabaja en la corrección ...
git add .
git commit -m "Fix: Descripción del bug corregido"

git checkout develop
git merge fix/descripcion-del-bug
git push origin develop
```

### Desplegar a producción (desde develop)
```bash
# 1. Asegúrate de que develop esté actualizada
git checkout develop
git pull origin develop

# 2. Haz merge a main
git checkout main
git merge develop

# 3. Sube main
git push origin main

# 4. Vuelve a develop para seguir trabajando
git checkout develop
```

### Corrección urgente en producción (hotfix)
```bash
# 1. Crea hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/descripcion-urgencia

# ... corrige el problema ...
git add .
git commit -m "Hotfix: Descripción de la corrección urgente"

# 2. Merge a main y develop
git checkout main
git merge hotfix/descripcion-urgencia
git push origin main

git checkout develop
git merge hotfix/descripcion-urgencia
git push origin develop

# 3. Elimina la rama
git branch -d hotfix/descripcion-urgencia
```

## 📝 Convenciones de Commits

Usa mensajes de commit claros y descriptivos:

```bash
# Formato recomendado:
git commit -m "Tipo: Descripción breve

Descripción detallada (opcional)
- Cambio 1
- Cambio 2"

# Ejemplos:
git commit -m "Feature: Agregar sección de proyectos con filtros"
git commit -m "Fix: Corregir error de validación en formulario de contacto"
git commit -m "Refactor: Mejorar estructura de servicios"
git commit -m "Style: Actualizar diseño del header"
git commit -m "Docs: Actualizar README con instrucciones de deploy"
```

### Tipos de commits:
- **Feature**: Nueva funcionalidad
- **Fix**: Corrección de bug
- **Refactor**: Refactorización de código
- **Style**: Cambios de formato/estilo
- **Docs**: Documentación
- **Test**: Pruebas
- **Chore**: Tareas de mantenimiento

## 🔄 Sincronizar con GitHub

### Obtener cambios del remoto
```bash
git fetch origin
git pull origin develop  # O la rama en la que estés trabajando
```

### Subir cambios locales
```bash
git push origin develop  # O la rama en la que estés trabajando
```

## ⚠️ Buenas Prácticas

1. **Nunca trabajes directamente en `main`** - Siempre usa `develop` o ramas de feature/fix.
2. **Haz commits frecuentes** - No esperes a terminar todo para hacer un commit.
3. **Mensajes de commit claros** - Describe qué y por qué, no solo qué.
4. **Sincroniza regularmente** - Haz `git pull` antes de empezar a trabajar.
5. **Revisa antes de hacer push** - Usa `git status` y `git diff` para verificar cambios.
6. **Mantén las ramas actualizadas** - Haz merge de `develop` a tus ramas de feature regularmente.

## 🆘 Solución de Problemas

### Deshacer cambios no commiteados
```bash
git restore .  # Descartar todos los cambios
git restore archivo.ts  # Descartar cambios en un archivo específico
```

### Deshacer último commit (manteniendo cambios)
```bash
git reset --soft HEAD~1
```

### Ver historial de commits
```bash
git log --oneline --graph --all
```

### Ver diferencias
```bash
git diff  # Cambios no staged
git diff --staged  # Cambios staged
git diff main..develop  # Diferencias entre ramas
```

## 📚 Recursos Adicionales

- [Documentación oficial de Git](https://git-scm.com/doc)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)




