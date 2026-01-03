# Sistema de Versionamiento

## Descripción

Este proyecto incluye un sistema automático de versionamiento que se actualiza en cada deploy para evitar problemas de caché del navegador.

## Versión Actual

La versión se almacena en `version.json` con el formato:
```json
{
  "version": "1.1.0",
  "build": 0
}
```

## Formato de Versión

- **Formato**: `MAJOR.MINOR.PATCH.BUILD`
- **Ejemplo**: `1.1.1.1`
  - `1.1.1` = Versión semántica (major.minor.patch)
  - `.1` = Número de build (se incrementa en cada deploy)

## Funcionamiento Automático

El sistema funciona automáticamente cuando ejecutas:

```bash
npm run deploy
```

Este comando:
1. Ejecuta `predeploy` que incrementa la versión
2. Actualiza todas las referencias en `index.html`
3. Realiza el deploy a Firebase

## Comandos Disponibles

### Deploy con versionamiento automático
```bash
npm run deploy
```
Incrementa la versión patch automáticamente y despliega.

### Incrementar versión manualmente
```bash
npm run version:patch
```
Incrementa solo la versión sin hacer deploy.

### Deploy solo hosting
```bash
npm run deploy:hosting
```
Equivalente a `npm run deploy`.

## Estructura de Archivos

```
├── version.json              # Archivo de versión
├── scripts/
│   ├── version-simple.js     # Lógica de versionamiento
│   └── pre-deploy-simple.js  # Script pre-deploy
└── public/
    └── index.html            # Actualizado automáticamente
```

## Cómo Funciona

1. **Incremento de Versión**: 
   - Incrementa el patch (1.1.0 → 1.1.1)
   - Incrementa el build (0 → 1)

2. **Actualización de HTML**:
   - Actualiza `styles.css?v=X.X.X.X`
   - Actualiza `js/app.js?v=X.X.X.X`
   - Actualiza `data-version` en el tag `<html>`

3. **Cache Busting**:
   - Los query strings `?v=X.X.X.X` fuerzan al navegador a descargar nuevas versiones
   - Cada deploy genera una versión única

## Ejemplo de Uso

```bash
# Versión inicial: 1.1.0.0
npm run deploy
# → Versión después: 1.1.1.1

npm run deploy
# → Versión después: 1.1.2.2

npm run deploy
# → Versión después: 1.1.3.3
```

## Verificación

Para verificar la versión actual:
```bash
cat version.json
```

Para verificar que el HTML tiene las versiones correctas:
```bash
grep "styles.css?v=" public/index.html
grep "app.js?v=" public/index.html
```

## Notas Importantes

- ✅ El versionamiento es **automático** en cada deploy
- ✅ No necesitas actualizar manualmente las versiones
- ✅ El build number se incrementa automáticamente
- ✅ Compatible con caché del navegador
- ✅ Funciona con Firebase Hosting

## Troubleshooting

Si el versionamiento no funciona:

1. Verifica que `version.json` existe
2. Verifica que los scripts están en `scripts/`
3. Verifica permisos de escritura
4. Revisa los logs del comando `npm run deploy`

