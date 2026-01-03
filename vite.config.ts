import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Leer package.json para obtener la versión
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

/**
 * Configuración de Vite optimizada para Clean Architecture
 * y deployment en Firebase Hosting
 */
export default defineConfig({
  // Directorio raíz del proyecto
  root: '.',
  
  // Directorio público (assets estáticos)
  publicDir: 'public-assets',
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    open: true,
    cors: true,
    host: true
  },
  
  // Configuración de preview (producción local)
  preview: {
    port: 4173,
    open: true
  },
  
  // Configuración de build
  build: {
    // Directorio de salida (compatible con Firebase Hosting)
    outDir: 'dist',
    
    // Generar source maps para producción (opcional, desactivar para mejor performance)
    sourcemap: false,
    
    // Minificar en producción
    minify: 'esbuild',
    
    // Tamaño de chunk warning (500kb)
    chunkSizeWarningLimit: 500,
    
    // Configuración de rollup
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        admin: resolve(__dirname, 'public/admin.html')
      },
      output: {
        // Nombres de archivos con hash para cache busting
        entryFileNames: `js/[name]-[hash].js`,
        chunkFileNames: `js/chunks/[name]-[hash].js`,
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        // Manual chunks para optimización
        manualChunks: {
          // Separar Firebase en su propio chunk
          'firebase-core': ['firebase/app'],
          'firebase-firestore': ['firebase/firestore'],
          'firebase-auth': ['firebase/auth']
        }
      }
    },
    
    // Optimizaciones
    cssCodeSplit: true,
    reportCompressedSize: true,
    
    // Target de navegadores
    target: 'es2022',
    
    // Assets inline limit (4kb)
    assetsInlineLimit: 4096
  },
  
  // Resolución de módulos (Path aliases para Clean Architecture)
  resolve: {
    alias: {
      '@domain': resolve(__dirname, './src/domain'),
      '@application': resolve(__dirname, './src/application'),
      '@infrastructure': resolve(__dirname, './src/infrastructure'),
      '@ui': resolve(__dirname, './src/ui'),
      '@shared': resolve(__dirname, './src/shared')
    }
  },
  
  // Variables de entorno
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
    exclude: []
  },
  
  // Configuración de CSS
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  }
});

