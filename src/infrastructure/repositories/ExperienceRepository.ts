/**
 * @fileoverview Repositorio para la colección de Experiences
 * @module infrastructure/repositories/ExperienceRepository
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
import type { IExperienceFirestoreData } from '../types/firestore.types';

/**
 * Repositorio para manejar operaciones de Experiences en Firestore
 * 
 * @class ExperienceRepository
 */
export class ExperienceRepository {
  /**
   * Nombre de la colección
   * 
   * @private
   * @static
   * @readonly
   */
  private static readonly COLLECTION_NAME = 'experiences';

  /**
   * Obtiene todas las experiencias activas ordenadas por orden descendente
   * 
   * @static
   * @returns {Promise<IExperienceFirestoreData[]>} Array de experiencias
   * @throws {Error} Si falla la operación
   */
  static async getExperiences(): Promise<IExperienceFirestoreData[]> {
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
      const experiences: IExperienceFirestoreData[] = [];

      querySnapshot.forEach((doc) => {
        experiences.push({
          id: doc.id,
          ...doc.data()
        } as IExperienceFirestoreData);
      });

      return experiences;
    } catch (error) {
      console.error('Error al obtener experiencias:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get experiences: ${errorMessage}`);
    }
  }

  /**
   * Obtiene todas las experiencias (incluyendo inactivas)
   * 
   * @static
   * @returns {Promise<IExperienceFirestoreData[]>} Array de todas las experiencias
   * @throws {Error} Si falla la operación
   */
  static async getAllExperiences(): Promise<IExperienceFirestoreData[]> {
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

      const experiences: IExperienceFirestoreData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        experiences.push({
          id: doc.id,
          order: data.order || 0,
          ...data
        } as IExperienceFirestoreData);
      });

      // Ordenar manualmente si no se pudo ordenar en la query
      experiences.sort((a, b) => (b.order || 0) - (a.order || 0));

      console.log(`getAllExperiences: Se obtuvieron ${experiences.length} experiencias`);
      return experiences;
    } catch (error) {
      console.error('Error al obtener todas las experiencias:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get all experiences: ${errorMessage}`);
    }
  }

  /**
   * Obtiene una experiencia por ID
   * 
   * @static
   * @param {string} id - ID de la experiencia
   * @returns {Promise<IExperienceFirestoreData | null>} Experiencia o null si no existe
   * @throws {Error} Si falla la operación
   */
  static async getExperienceById(id: string): Promise<IExperienceFirestoreData | null> {
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
        } as IExperienceFirestoreData;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener experiencia por ID:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get experience: ${errorMessage}`);
    }
  }

  /**
   * Crea una nueva experiencia
   * 
   * @static
   * @param {IExperienceFirestoreData} experienceData - Datos de la experiencia
   * @returns {Promise<IExperienceFirestoreData>} Experiencia creada
   * @throws {Error} Si falla la operación
   */
  static async createExperience(experienceData: IExperienceFirestoreData): Promise<IExperienceFirestoreData> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const id = experienceData.id || `exp_${Date.now()}`;
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      const dataToSave: IExperienceFirestoreData = {
        ...experienceData,
        id,
        isActive: experienceData.isActive !== undefined ? experienceData.isActive : true,
        order: experienceData.order || 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(docRef, dataToSave);
      
      return {
        id,
        ...dataToSave
      } as IExperienceFirestoreData;
    } catch (error) {
      console.error('Error al crear experiencia:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create experience: ${errorMessage}`);
    }
  }

  /**
   * Actualiza una experiencia existente
   * 
   * @static
   * @param {string} id - ID de la experiencia
   * @param {IExperienceFirestoreData} experienceData - Datos actualizados
   * @returns {Promise<IExperienceFirestoreData>} Experiencia actualizada
   * @throws {Error} Si falla la operación
   */
  static async updateExperience(
    id: string, 
    experienceData: Partial<IExperienceFirestoreData>
  ): Promise<IExperienceFirestoreData> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      const dataToSave: Partial<IExperienceFirestoreData> = {
        ...experienceData,
        updatedAt: Timestamp.now()
      };

      await setDoc(docRef, dataToSave, { merge: true });
      
      return {
        id,
        ...dataToSave
      } as IExperienceFirestoreData;
    } catch (error) {
      console.error('Error al actualizar experiencia:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update experience: ${errorMessage}`);
    }
  }

  /**
   * Elimina una experiencia (soft delete)
   * 
   * @static
   * @param {string} id - ID de la experiencia
   * @returns {Promise<void>}
   * @throws {Error} Si falla la operación
   */
  static async deleteExperience(id: string): Promise<void> {
    try {
      await this.updateExperience(id, { isActive: false });
    } catch (error) {
      console.error('Error al eliminar experiencia:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete experience: ${errorMessage}`);
    }
  }

  /**
   * Elimina permanentemente una experiencia
   * 
   * @static
   * @param {string} id - ID de la experiencia
   * @returns {Promise<void>}
   * @throws {Error} Si falla la operación
   */
  static async hardDeleteExperience(id: string): Promise<void> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error al eliminar permanentemente experiencia:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to hard delete experience: ${errorMessage}`);
    }
  }
}


