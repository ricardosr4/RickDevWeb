/**
 * @fileoverview Servicio para manejar la subida de archivos a Firebase Storage
 * @module infrastructure/services/StorageService
 */

import { FirebaseService } from '../FirebaseService';
import { ref, uploadBytes, getDownloadURL, deleteObject, type UploadResult } from 'firebase/storage';

/**
 * Servicio para manejar operaciones de Storage
 * 
 * @class StorageService
 */
export class StorageService {
  /**
   * Sube un archivo a Firebase Storage
   * 
   * @static
   * @param {File} file - Archivo a subir
   * @param {string} path - Ruta donde se guardará el archivo (ej: 'profile/banner.jpg')
   * @returns {Promise<string>} URL de descarga del archivo
   * @throws {Error} Si falla la subida
   */
  static async uploadFile(file: File, path: string): Promise<string> {
    try {
      console.log('StorageService.uploadFile iniciado', { path, fileName: file.name, fileSize: file.size, fileType: file.type });
      
      if (!FirebaseService.isInitialized()) {
        console.log('Firebase no inicializado, inicializando...');
        FirebaseService.initialize();
      }

      // Verificar que el usuario esté autenticado
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('Debes estar autenticado para subir archivos. Por favor, inicia sesión nuevamente.');
      }
      
      console.log('Usuario autenticado:', currentUser.email);
      console.log('UID del usuario:', currentUser.uid);

      const storage = FirebaseService.getStorage();
      console.log('Storage obtenido:', storage);
      console.log('Storage bucket:', storage.app.options.storageBucket);
      
      // Validar tipo de archivo
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        throw new Error(`Tipo de archivo no válido: ${file.type}. Solo se permiten imágenes (JPEG, PNG, WebP, GIF)`);
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error(`El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). El tamaño máximo es 5MB`);
      }

      // Crear referencia al archivo
      console.log('Creando referencia a:', path);
      const storageRef = ref(storage, path);
      
      // Subir archivo con timeout de 60 segundos
      console.log('Iniciando uploadBytes...');
      const uploadPromise = uploadBytes(storageRef, file);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('La subida tardó demasiado. Por favor, verifica tu conexión a internet y las reglas de Firebase Storage.')), 60000);
      });
      
      const snapshot: UploadResult = await Promise.race([uploadPromise, timeoutPromise]);
      console.log('Upload completado, obteniendo URL...', snapshot);
      
      // Obtener URL de descarga con timeout
      const urlPromise = getDownloadURL(snapshot.ref);
      const urlTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Error al obtener la URL de descarga.')), 10000);
      });
      
      const downloadURL = await Promise.race([urlPromise, urlTimeoutPromise]);
      console.log('URL obtenida:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error detallado al subir archivo:', error);
      
      // Extraer información más detallada del error
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Errores específicos de Firebase Storage
        if (error.message.includes('storage/unauthorized') || error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMessage = '❌ Error 403: Las reglas de Storage no permiten escritura. Ve a: https://console.firebase.google.com/project/rickdev-90632/storage/rules - BORRA todo y pega: rules_version = \'2\'; service firebase.storage { match /b/{bucket}/o { match /profile/{allPaths=**} { allow read: if true; allow write: if request.auth != null; } } } - Luego haz clic en "Publicar" y espera 20 segundos. Ver archivo CONFIGURAR_REGLAS_STORAGE.md';
        } else if (error.message.includes('CORS') || error.message.includes('preflight') || error.message.includes('ERR_FAILED')) {
          errorMessage = '❌ Error CORS o Storage no configurado. Verifica: 1) Storage está habilitado en Firebase Console (debes ver archivos, NO el mensaje de actualizar), 2) Las reglas de Storage permiten escritura para usuarios autenticados, 3) Espera 2-3 minutos después de habilitar Storage. Ver archivo VERIFICAR_STORAGE.md';
        } else if (error.message.includes('storage/quota-exceeded')) {
          errorMessage = 'Se ha excedido la cuota de almacenamiento de Firebase.';
        } else if (error.message.includes('storage/unauthenticated') || error.message.includes('Debes estar autenticado')) {
          errorMessage = '❌ No estás autenticado. Por favor, cierra sesión e inicia sesión nuevamente en el admin.';
        } else if (error.message.includes('storage/canceled')) {
          errorMessage = 'La subida fue cancelada.';
        } else if (error.message.includes('storage/unknown')) {
          errorMessage = '❌ Error desconocido de Firebase Storage. Verifica: 1) Storage está habilitado, 2) Las reglas están correctas, 3) Estás autenticado, 4) Tu conexión a internet. Ver archivo VERIFICAR_STORAGE.md';
        } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMessage = '❌ Acceso denegado (403). Las reglas de Storage no permiten escritura. Ve a Firebase Console > Storage > Rules y asegúrate de tener: allow write: if request.auth != null;';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = '❌ No autorizado (401). Tu token de autenticación puede haber expirado. Por favor, cierra sesión e inicia sesión nuevamente.';
        }
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Elimina un archivo de Firebase Storage
   * 
   * @static
   * @param {string} path - Ruta del archivo a eliminar
   * @returns {Promise<void>}
   * @throws {Error} Si falla la eliminación
   */
  static async deleteFile(path: string): Promise<void> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }

      const storage = FirebaseService.getStorage();
      const storageRef = ref(storage, path);
      
      await deleteObject(storageRef);
      console.log('Archivo eliminado correctamente:', path);
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error al eliminar archivo: ${errorMessage}`);
    }
  }

  /**
   * Sube una imagen de banner
   * 
   * @static
   * @param {File} file - Archivo de imagen
   * @returns {Promise<string>} URL de descarga
   */
  static async uploadBannerImage(file: File): Promise<string> {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `profile/banner_${timestamp}.${extension}`;
    return this.uploadFile(file, path);
  }

  /**
   * Sube una imagen de perfil
   * 
   * @static
   * @param {File} file - Archivo de imagen
   * @returns {Promise<string>} URL de descarga
   */
  static async uploadProfileImage(file: File): Promise<string> {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `profile/profile_${timestamp}.${extension}`;
    return this.uploadFile(file, path);
  }
}

