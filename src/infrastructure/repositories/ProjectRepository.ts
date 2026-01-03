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
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
import type { IProjectFirestoreData } from '../types/firestore.types';

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
      
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('isActive', '==', true),
        orderBy('order', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const projects: IProjectFirestoreData[] = [];

      querySnapshot.forEach((doc) => {
        projects.push({
          id: doc.id,
          ...doc.data()
        } as IProjectFirestoreData);
      });

      return projects;
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get projects: ${errorMessage}`);
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
      
      // Intentar obtener con orderBy, si falla obtener sin ordenar
      let querySnapshot;
      try {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          orderBy('order', 'desc')
        );
        querySnapshot = await getDocs(q);
      } catch (orderError) {
        // Si falla por falta de índice o campo order, obtener todas sin ordenar
        console.warn('No se pudo ordenar por order, obteniendo todas sin ordenar:', orderError);
        querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      }

      const projects: IProjectFirestoreData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projects.push({
          id: doc.id,
          order: data.order || 0,
          ...data
        } as IProjectFirestoreData);
      });

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
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as IProjectFirestoreData;
      }

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
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      const dataToSave: Partial<IProjectFirestoreData> = {
        ...projectData,
        updatedAt: Timestamp.now()
      };

      await setDoc(docRef, dataToSave, { merge: true });
      
      return {
        id,
        ...dataToSave
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
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error al eliminar permanentemente proyecto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to hard delete project: ${errorMessage}`);
    }
  }
}

