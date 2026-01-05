/**
 * @fileoverview Repositorio para la colección de Projects
 * @module infrastructure/repositories/ProjectRepository
 */

import { FirebaseService } from '../FirebaseService.js';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocsFromServer,
  doc, 
  getDocFromServer,
  setDoc, 
  updateDoc,
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
import type { IProjectFirestoreData } from '../types/firestore.types';
import { StorageService } from '../services/StorageService.js';

/**
 * Repositorio para manejar operaciones de Projects en Firestore
 * 
 * @class ProjectRepository
 */
export class ProjectRepository {
  /**
   * Nombre de la colección
   * 
   * @private
   * @static
   * @readonly
   */
  private static readonly COLLECTION_NAME = 'projects';

  /**
   * Obtiene todos los proyectos activos ordenados por orden descendente
   * 
   * @static
   * @returns {Promise<IProjectFirestoreData[]>} Array de proyectos
   * @throws {Error} Si falla la operación
   */
  static async getProjects(): Promise<IProjectFirestoreData[]> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      
      if (!db) {
        throw new Error('No se pudo obtener la instancia de Firestore');
      }
      
      // Usar getDocsFromServer para evitar caché y obtener datos frescos desde el servidor
      // Intentar obtener con where y orderBy, si falla obtener todas y filtrar manualmente
      let querySnapshot;
      try {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          where('isActive', '==', true),
          orderBy('order', 'desc')
        );
        querySnapshot = await getDocsFromServer(q);
      } catch (queryError) {
        // Si falla por falta de índice, obtener todas y filtrar manualmente
        console.warn('No se pudo usar query con where/orderBy, obteniendo todas y filtrando manualmente:', queryError);
        const allQuery = query(
          collection(db, this.COLLECTION_NAME),
          orderBy('order', 'desc')
        );
        try {
          querySnapshot = await getDocsFromServer(allQuery);
        } catch (orderError) {
          // Si también falla orderBy, obtener todas sin ordenar
          console.warn('No se pudo ordenar, obteniendo todas sin ordenar:', orderError);
          querySnapshot = await getDocsFromServer(collection(db, this.COLLECTION_NAME));
        }
      }

      const projects: IProjectFirestoreData[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        try {
          const docId = docSnapshot.id;
          const data = docSnapshot.data();
          
          if (!data || typeof data !== 'object') {
            console.warn(`Documento ${docId} no tiene datos válidos`);
            continue;
          }
          
          const project = {
            id: docId,
            order: data.order || 0,
            ...data
          } as IProjectFirestoreData;
          
          // Filtrar solo activos si no se pudo usar where
          // Un proyecto está activo si isActive es explícitamente true
          // Si isActive es false, undefined o null, no se incluye (solo mostrar explícitamente activos)
          // Esto asegura que los proyectos eliminados no aparezcan
          const isActive = project.isActive === true;
          if (isActive) {
            projects.push(project);
            console.log(`✓ Proyecto ${docId} incluido (isActive: ${project.isActive})`);
          } else {
            console.log(`✗ Proyecto ${docId} filtrado (isActive: ${project.isActive}, name: ${project.name})`);
          }
        } catch (error) {
          const docId = 'unknown';
          console.warn(`Error al procesar documento ${docId}:`, error);
        }
      }

      // Ordenar manualmente si no se pudo ordenar en la query
      projects.sort((a, b) => (b.order || 0) - (a.order || 0));

      console.log(`getProjects: Se obtuvieron ${projects.length} proyectos activos`);
      return projects;
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      // En lugar de lanzar error, retornar array vacío para que la app continúe
      console.warn('Retornando array vacío de proyectos debido a error');
      return [];
    }
  }

  /**
   * Obtiene todos los proyectos (incluyendo inactivos)
   * 
   * @static
   * @returns {Promise<IProjectFirestoreData[]>} Array de todos los proyectos
   * @throws {Error} Si falla la operación
   */
  static async getAllProjects(): Promise<IProjectFirestoreData[]> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      
      // Siempre usar getDocsFromServer para obtener datos frescos desde el servidor
      // Esto es especialmente importante para el panel de admin donde necesitamos ver todos los proyectos
      const getDocsFunction = getDocsFromServer;
      
      // Intentar obtener con orderBy, si falla obtener sin ordenar
      let querySnapshot;
      try {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          orderBy('order', 'desc')
        );
        querySnapshot = await getDocsFunction(q);
      } catch (orderError) {
        // Si falla por falta de índice o campo order, obtener todas sin ordenar
        console.warn('No se pudo ordenar por order, obteniendo todas sin ordenar:', orderError);
        querySnapshot = await getDocsFunction(collection(db, this.COLLECTION_NAME));
      }

      const projects: IProjectFirestoreData[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        try {
          const docId = docSnapshot.id;
          const data = docSnapshot.data();
          
          // Verificar que el documento tiene datos válidos
          if (data && typeof data === 'object') {
            projects.push({
              id: docId,
              order: data.order || 0,
              ...data
            } as IProjectFirestoreData);
          } else {
            console.warn(`Documento ${docId} no tiene datos válidos`);
          }
        } catch (error) {
          console.warn(`Error al procesar documento:`, error);
        }
      }

      // Ordenar manualmente si no se pudo ordenar en la query
      projects.sort((a, b) => (b.order || 0) - (a.order || 0));

      console.log(`getAllProjects: Se obtuvieron ${projects.length} proyectos`);
      return projects;
    } catch (error) {
      console.error('Error al obtener todos los proyectos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get all projects: ${errorMessage}`);
    }
  }

  /**
   * Obtiene un proyecto por ID
   * 
   * @static
   * @param {string} id - ID del proyecto
   * @returns {Promise<IProjectFirestoreData | null>} Proyecto o null si no existe
   * @throws {Error} Si falla la operación
   */
  static async getProjectById(id: string): Promise<IProjectFirestoreData | null> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      console.log(`getProjectById: Buscando proyecto con ID: ${id}`);
      
      // Primero intentar con getDocFromServer
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      try {
        const docSnap = await getDocFromServer(docRef);
        if (docSnap.exists()) {
          console.log(`✓ getProjectById: Proyecto encontrado con getDocFromServer`);
          return {
            id: docSnap.id,
            ...docSnap.data()
          } as IProjectFirestoreData;
        }
        console.log(`⚠️ getProjectById: getDocFromServer no encontró el documento ${id}`);
      } catch (error: any) {
        console.warn(`⚠️ getProjectById: Error con getDocFromServer:`, error);
      }
      
      // Si getDocFromServer falla, usar getAllProjects como fallback
      // Esto es necesario porque a veces getDocFromServer no encuentra documentos que sí existen
      console.log(`getProjectById: Usando getAllProjects como fallback para buscar ${id}`);
      const allProjects = await this.getAllProjects();
      console.log(`getProjectById: getAllProjects encontró ${allProjects.length} proyectos`);
      console.log(`getProjectById: IDs encontrados:`, allProjects.map(p => p.id));
      
      const project = allProjects.find(p => p.id === id);
      if (project) {
        console.log(`✓ getProjectById: Proyecto encontrado en getAllProjects`);
        return project;
      }
      
      console.log(`✗ getProjectById: Proyecto ${id} no encontrado en ningún método`);
      return null;
    } catch (error) {
      console.error('Error al obtener proyecto por ID:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get project: ${errorMessage}`);
    }
  }

  /**
   * Crea un nuevo proyecto
   * 
   * @static
   * @param {IProjectFirestoreData} projectData - Datos del proyecto
   * @returns {Promise<IProjectFirestoreData>} Proyecto creado
   * @throws {Error} Si falla la operación
   */
  static async createProject(projectData: IProjectFirestoreData): Promise<IProjectFirestoreData> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const id = projectData.id || `proj_${Date.now()}`;
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      const dataToSave: IProjectFirestoreData = {
        ...projectData,
        id,
        isActive: projectData.isActive !== undefined ? projectData.isActive : true,
        order: projectData.order || 0,
        images: projectData.images || [],
        technologies: projectData.technologies || [],
        features: projectData.features || [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(docRef, dataToSave);
      
      return {
        id,
        ...dataToSave
      } as IProjectFirestoreData;
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create project: ${errorMessage}`);
    }
  }

  /**
   * Actualiza un proyecto existente
   * 
   * @static
   * @param {string} id - ID del proyecto
   * @param {IProjectFirestoreData} projectData - Datos actualizados
   * @returns {Promise<IProjectFirestoreData>} Proyecto actualizado
   * @throws {Error} Si falla la operación
   */
  static async updateProject(
    id: string, 
    projectData: Partial<IProjectFirestoreData>
  ): Promise<IProjectFirestoreData> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      console.log(`updateProject: Actualizando proyecto ${id}`);
      console.log('Datos recibidos:', projectData);
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      // Asegurarse de que NO se incluya el ID en los datos a guardar
      // El ID es parte de la referencia del documento, no de los datos
      const { id: _, ...dataWithoutId } = projectData as any;
      
      const dataToSave: Partial<IProjectFirestoreData> = {
        ...dataWithoutId,
        updatedAt: Timestamp.now()
      };
      
      // NO incluir el ID en los datos
      delete (dataToSave as any).id;

      console.log('Datos a guardar (sin ID):', dataToSave);
      console.log('Referencia del documento:', docRef.path);
      
      // Usar updateDoc en lugar de setDoc para asegurar que solo se actualice, no se cree
      await updateDoc(docRef, dataToSave);
      
      console.log(`✓ Proyecto ${id} actualizado exitosamente`);
      
      // Obtener el proyecto actualizado para retornarlo
      const updatedDoc = await getDocFromServer(docRef);
      if (!updatedDoc.exists()) {
        throw new Error(`El proyecto ${id} no existe después de la actualización`);
      }
      
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as IProjectFirestoreData;
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update project: ${errorMessage}`);
    }
  }

  /**
   * Elimina un proyecto (soft delete)
   * 
   * @static
   * @param {string} id - ID del proyecto
   * @returns {Promise<void>}
   * @throws {Error} Si falla la operación
   */
  static async deleteProject(id: string): Promise<void> {
    try {
      await this.updateProject(id, { isActive: false });
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete project: ${errorMessage}`);
    }
  }

  /**
   * Elimina permanentemente un proyecto
   * 
   * @static
   * @param {string} id - ID del proyecto
   * @returns {Promise<void>}
   * @throws {Error} Si falla la operación
   */
  static async hardDeleteProject(id: string): Promise<void> {
    try {
      console.log('hardDeleteProject llamado con ID:', id);
      console.log('COLLECTION_NAME:', this.COLLECTION_NAME);
      
      if (!FirebaseService.isInitialized()) {
        console.log('Firebase no inicializado, inicializando...');
        FirebaseService.initialize();
      }
      
      // Verificar que el usuario esté autenticado
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('Debes estar autenticado para eliminar proyectos. Por favor, inicia sesión nuevamente.');
      }
      
      console.log('Usuario autenticado:', currentUser.email);
      console.log('UID del usuario:', currentUser.uid);
      
      const db = FirebaseService.getFirestore();
      if (!db) {
        throw new Error('No se pudo obtener la instancia de Firestore');
      }
      
      console.log('Creando referencia al documento:', `${this.COLLECTION_NAME}/${id}`);
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      // Obtener todos los proyectos primero para verificar qué IDs realmente existen
      console.log('Obteniendo todos los proyectos para verificar IDs existentes...');
      const allProjects = await this.getAllProjects();
      console.log(`IDs de proyectos encontrados en Firestore:`, allProjects.map(p => p.id));
      console.log(`ID que se intenta eliminar: "${id}"`);
      const projectExistsInList = allProjects.some(p => p.id === id);
      console.log(`¿El ID existe en la lista de proyectos?: ${projectExistsInList}`);
      
      let projectData: IProjectFirestoreData | null = null;
      let documentExists = false;
      
      // Si el proyecto existe en la lista, obtener sus datos
      if (projectExistsInList) {
        projectData = allProjects.find(p => p.id === id) || null;
        if (projectData) {
          documentExists = true;
          console.log('✓ Proyecto encontrado en getAllProjects, datos obtenidos:', { id: projectData.id, name: projectData.name });
        }
      } else {
        // Si no existe en la lista, intentar con getDocFromServer como último recurso
        console.log('⚠️ Proyecto no encontrado en getAllProjects, intentando con getDocFromServer...');
        try {
          const docSnap = await getDocFromServer(docRef);
          if (docSnap.exists()) {
            documentExists = true;
            projectData = docSnap.data() as IProjectFirestoreData;
            console.log('✓ Documento encontrado con getDocFromServer, datos obtenidos:', { id: docSnap.id, name: projectData.name });
          } else {
            console.log(`ℹ️ El documento ${id} no existe según getDocFromServer ni getAllProjects`);
          }
        } catch (error: any) {
          console.warn(`⚠️ Error al verificar documento con getDocFromServer:`, error);
          if (error?.code === 'permission-denied') {
            throw new Error('No tienes permisos para leer este documento. Verifica las reglas de Firestore.');
          }
        }
      }
      
      // Si el documento no existe en ningún lado, no hay nada que eliminar
      if (!documentExists && !projectExistsInList) {
        console.log(`ℹ️ El documento ${id} no existe en Firestore, no hay nada que eliminar`);
        return;
      }
      
      // Eliminar imágenes si tenemos los datos del proyecto
      // Si no tenemos los datos pero el documento existe, intentar obtenerlos antes de eliminar
      if (!projectData && documentExists) {
        try {
          const docSnap = await getDocFromServer(docRef);
          if (docSnap.exists()) {
            projectData = docSnap.data() as IProjectFirestoreData;
            console.log('✓ Datos del proyecto obtenidos en segundo intento');
          }
        } catch (error) {
          console.warn('No se pudieron obtener los datos del proyecto, continuando con eliminación...');
        }
      }
      
      if (projectData) {
        console.log('Datos del proyecto obtenidos, eliminando imágenes...');
        
        // Eliminar todas las imágenes del Storage
        const imageUrls: string[] = [];
        
        // Agregar imagen principal si existe
        if (projectData.mainImage && projectData.mainImage.trim() !== '') {
          imageUrls.push(projectData.mainImage);
        }
        
        // Agregar imágenes adicionales si existen
        if (projectData.images && Array.isArray(projectData.images)) {
          projectData.images.forEach(img => {
            if (img && img.trim() !== '') {
              imageUrls.push(img);
            }
          });
        }
        
        console.log(`Eliminando ${imageUrls.length} imagen(es) del Storage...`);
        
        // Eliminar todas las imágenes en paralelo (pero manejar errores individualmente)
        const deleteImagePromises = imageUrls.map(async (url) => {
          try {
            await StorageService.deleteFileByUrl(url);
            console.log(`✓ Imagen eliminada: ${url}`);
          } catch (error) {
            // No lanzar error si una imagen no se puede eliminar (puede que ya no exista)
            console.warn(`⚠️ No se pudo eliminar la imagen ${url}:`, error);
          }
        });
        
        await Promise.allSettled(deleteImagePromises);
        console.log('Proceso de eliminación de imágenes completado');
      } else {
        console.log('No se pudieron obtener los datos del proyecto, continuando con eliminación del documento...');
      }
      
      // Ahora eliminar el documento de Firestore (SIEMPRE intentar, incluso si getDocFromServer no lo encontró)
      // Esto es importante porque puede haber problemas de caché o sincronización
      console.log('🗑️ Eliminando documento de Firestore...');
      console.log('Referencia del documento:', docRef.path);
      console.log('ID completo del documento:', docRef.id);
      console.log('Colección:', docRef.parent.id);
      console.log('Documento existe según verificación inicial:', documentExists);
      
      // Si tenemos los datos del proyecto, proceder a eliminar
      // Si no tenemos los datos pero sabemos que existe, intentar eliminar de todos modos
      if (!documentExists && !projectExistsInList) {
        console.log('ℹ️ Documento no existe, no hay nada que eliminar');
        return;
      }
      
      try {
        // Intentar eliminar directamente - Firebase manejará si el documento no existe
        console.log('Ejecutando deleteDoc...');
        console.log('Referencia completa:', docRef.path);
        console.log('ID del documento:', docRef.id);
        console.log('Documento existe según verificación:', documentExists || projectExistsInList);
        console.log('Usuario autenticado:', currentUser.email);
        console.log('UID del usuario:', currentUser.uid);
        
        // Verificar una última vez que tenemos autenticación
        if (!currentUser) {
          throw new Error('Usuario no autenticado. No se puede eliminar el documento.');
        }
        
        await deleteDoc(docRef);
        console.log('✅ deleteDoc completado sin errores');
      } catch (deleteError: any) {
        console.error('❌ Error al eliminar documento:', deleteError);
        console.error('Código de error:', deleteError?.code);
        console.error('Mensaje de error:', deleteError?.message);
        console.error('Stack:', deleteError?.stack);
        
        // Si el error es que el documento no existe, verificar si realmente no existe
        if (deleteError?.code === 'not-found' || deleteError?.message?.includes('not found')) {
          console.warn('⚠️ Error "not found". Verificando si el documento realmente existe...');
          
          // Verificar si realmente no existe
          try {
            const checkSnap = await getDocFromServer(docRef);
            if (checkSnap.exists()) {
              // El documento existe pero deleteDoc falló - esto es un problema de permisos
              console.error('❌ El documento EXISTE pero no se pudo eliminar. Esto indica un problema de permisos.');
              throw new Error(`No tienes permisos para eliminar este documento. Verifica las reglas de Firestore. El documento existe pero deleteDoc falló con código: ${deleteError?.code}`);
            } else {
              console.log('✓ Confirmado: El documento no existe, eliminación completada');
              return;
            }
          } catch (checkError: any) {
            console.error('Error al verificar documento después de fallo:', checkError);
            if (checkError?.code === 'permission-denied') {
              throw new Error('No tienes permisos para leer/eliminar este documento. Verifica las reglas de Firestore.');
            }
            // Si no es un error de permisos, el documento probablemente no existe
            console.log('✓ El documento no existe, eliminación completada');
            return;
          }
        }
        
        // Si el error es de permisos
        if (deleteError?.code === 'permission-denied' || deleteError?.message?.includes('permission')) {
          console.error('❌ Error de permisos al eliminar documento');
          console.error('Código de error:', deleteError?.code);
          console.error('Mensaje completo:', deleteError?.message);
          console.error('Usuario autenticado:', currentUser?.email);
          console.error('UID:', currentUser?.uid);
          console.error('');
          console.error('SOLUCIÓN:');
          console.error('1. Ve a Firebase Console > Firestore Database > Rules');
          console.error('2. Asegúrate de que las reglas para /projects/{document} sean:');
          console.error('   match /projects/{document} {');
          console.error('     allow read: if true;');
          console.error('     allow create, update, delete: if request.auth != null;');
          console.error('   }');
          console.error('3. Haz clic en "Publicar" y espera 20-30 segundos');
          console.error('4. Recarga la página del admin y vuelve a intentar');
          throw new Error('No tienes permisos para eliminar este documento. Verifica las reglas de Firestore. Asegúrate de que las reglas permitan "delete" para usuarios autenticados. Ve a: https://console.firebase.google.com/project/rickdev-90632/firestore/rules');
        }
        
        // Si es otro error, lanzarlo
        throw deleteError;
      }
      
      // Verificar que realmente se eliminó usando getAllProjects (más confiable que getDocFromServer)
      // Esperar más tiempo para que Firestore propague la eliminación
      console.log('Esperando 5 segundos para propagación de Firestore...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Verificar múltiples veces usando getAllProjects para asegurar que se eliminó
      let verificationAttempts = 0;
      const maxVerificationAttempts = 5;
      let documentStillExists = true;
      
      while (verificationAttempts < maxVerificationAttempts && documentStillExists) {
        verificationAttempts++;
        console.log(`🔍 Verificación ${verificationAttempts}/${maxVerificationAttempts} usando getAllProjects...`);
        
        try {
          // Usar getAllProjects para verificar (más confiable que getDocFromServer con ID específico)
          const allProjects = await this.getAllProjects();
          const projectIds = allProjects.map(p => p.id);
          console.log(`IDs encontrados en getAllProjects:`, projectIds);
          
          if (projectIds.includes(id)) {
            console.error(`❌ Intento ${verificationAttempts}: El documento ${id} AÚN EXISTE en getAllProjects después de deleteDoc`);
            
            if (verificationAttempts < maxVerificationAttempts) {
              // Esperar más tiempo antes del siguiente intento
              const waitTime = verificationAttempts * 2000; // Esperar 2s, 4s, 6s, 8s
              console.log(`Esperando ${waitTime}ms antes del siguiente intento...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
              // Último intento falló, el documento aún existe
              console.error(`❌ ERROR CRÍTICO: El documento ${id} NO se eliminó después de ${maxVerificationAttempts} intentos de verificación`);
              console.error('Esto indica que deleteDoc NO está funcionando correctamente.');
              console.error('Posibles causas:');
              console.error('1. ❌ Las reglas de Firestore NO permiten delete (aunque parezca que sí)');
              console.error('2. ❌ Hay un problema con la referencia del documento');
              console.error('3. ❌ El documento está siendo recreado por otro proceso');
              console.error('4. ❌ Hay un problema de sincronización de Firestore');
              console.error('');
              console.error('ACCIÓN REQUERIDA:');
              console.error('1. Ve a Firebase Console > Firestore Database');
              console.error('2. Intenta eliminar el documento manualmente desde la consola');
              console.error('3. Si puedes eliminarlo manualmente, el problema es de permisos en el código');
              console.error('4. Si NO puedes eliminarlo manualmente, el problema es de reglas de Firestore');
              console.error('');
              console.error('Referencia del documento:', docRef.path);
              console.error('ID del documento:', docRef.id);
              
              // Lanzar un error crítico que no se puede ignorar
              throw new Error(`CRÍTICO: El documento ${id} NO se eliminó después de ${maxVerificationAttempts} verificaciones. deleteDoc se ejecutó sin errores pero el documento sigue existiendo en getAllProjects. Esto indica un problema de permisos o sincronización. Verifica las reglas de Firestore en: https://console.firebase.google.com/project/rickdev-90632/firestore/rules`);
            }
          } else {
            documentStillExists = false;
            console.log(`✅ ÉXITO en intento ${verificationAttempts}: El documento ${id} NO está en getAllProjects, fue eliminado correctamente`);
          }
        } catch (verifyError: any) {
          if (verifyError?.code === 'permission-denied') {
            console.error('❌ Error de permisos al verificar eliminación');
            throw new Error('No tienes permisos para verificar la eliminación del documento. Verifica las reglas de Firestore.');
          } else if (verifyError?.message?.includes('CRÍTICO')) {
            // Re-lanzar errores críticos
            throw verifyError;
          } else {
            // Si es otro error, esperar y reintentar
            console.warn(`⚠️ Error en verificación ${verificationAttempts}:`, verifyError);
            if (verificationAttempts < maxVerificationAttempts) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
              throw verifyError;
            }
          }
        }
      }
      
      if (documentStillExists) {
        throw new Error(`El documento ${id} aún existe después de ${maxVerificationAttempts} verificaciones.`);
      }
      
      console.log(`✅✅✅ CONFIRMADO: El documento ${id} fue eliminado exitosamente de Firestore`);
    } catch (error) {
      console.error('Error al eliminar permanentemente proyecto:', error);
      console.error('Detalles del error:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'No code',
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to hard delete project: ${errorMessage}`);
    }
  }
}

