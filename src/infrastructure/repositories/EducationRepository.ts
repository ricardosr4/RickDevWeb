/**
 * @fileoverview Repositorio para la colección de Education
 * @module infrastructure/repositories/EducationRepository
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
import type { IEducationFirestoreData } from '../types/firestore.types';

/**
 * Repositorio para manejar operaciones de Education en Firestore
 * 
 * @class EducationRepository
 */
export class EducationRepository {
  /**
   * Nombre de la colección
   * 
   * @private
   * @static
   * @readonly
   */
  private static readonly COLLECTION_NAME = 'education';

  /**
   * Obtiene todas las educaciones activas ordenadas por orden descendente
   * 
   * @static
   * @returns {Promise<IEducationFirestoreData[]>} Array de educaciones
   * @throws {Error} Si falla la operación
   */
  static async getEducations(): Promise<IEducationFirestoreData[]> {
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
      const educations: IEducationFirestoreData[] = [];

      querySnapshot.forEach((doc) => {
        educations.push({
          id: doc.id,
          ...doc.data()
        } as IEducationFirestoreData);
      });

      return educations;
    } catch (error) {
      console.error('Error al obtener educaciones:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get educations: ${errorMessage}`);
    }
  }

  /**
   * Obtiene todas las educaciones (incluyendo inactivas)
   * 
   * @static
   * @returns {Promise<IEducationFirestoreData[]>} Array de todas las educaciones
   * @throws {Error} Si falla la operación
   */
  static async getAllEducations(): Promise<IEducationFirestoreData[]> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('order', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const educations: IEducationFirestoreData[] = [];

      querySnapshot.forEach((doc) => {
        educations.push({
          id: doc.id,
          ...doc.data()
        } as IEducationFirestoreData);
      });

      return educations;
    } catch (error) {
      console.error('Error al obtener todas las educaciones:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get all educations: ${errorMessage}`);
    }
  }

  /**
   * Obtiene una educación por ID
   * 
   * @static
   * @param {string} id - ID de la educación
   * @returns {Promise<IEducationFirestoreData | null>} Educación o null si no existe
   * @throws {Error} Si falla la operación
   */
  static async getEducationById(id: string): Promise<IEducationFirestoreData | null> {
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
        } as IEducationFirestoreData;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener educación por ID:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get education: ${errorMessage}`);
    }
  }

  /**
   * Crea una nueva educación
   * 
   * @static
   * @param {IEducationFirestoreData} educationData - Datos de la educación
   * @returns {Promise<IEducationFirestoreData>} Educación creada
   * @throws {Error} Si falla la operación
   */
  static async createEducation(educationData: IEducationFirestoreData): Promise<IEducationFirestoreData> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const id = educationData.id || `edu_${Date.now()}`;
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      const dataToSave: IEducationFirestoreData = {
        ...educationData,
        id,
        isActive: educationData.isActive !== undefined ? educationData.isActive : true,
        order: educationData.order || 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(docRef, dataToSave);
      
      return {
        id,
        ...dataToSave
      } as IEducationFirestoreData;
    } catch (error) {
      console.error('Error al crear educación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create education: ${errorMessage}`);
    }
  }

  /**
   * Actualiza una educación existente
   * 
   * @static
   * @param {string} id - ID de la educación
   * @param {Partial<IEducationFirestoreData>} educationData - Datos actualizados
   * @returns {Promise<IEducationFirestoreData>} Educación actualizada
   * @throws {Error} Si falla la operación
   */
  static async updateEducation(
    id: string, 
    educationData: Partial<IEducationFirestoreData>
  ): Promise<IEducationFirestoreData> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      const dataToSave: Partial<IEducationFirestoreData> = {
        ...educationData,
        updatedAt: Timestamp.now()
      };

      await setDoc(docRef, dataToSave, { merge: true });
      
      return {
        id,
        ...dataToSave
      } as IEducationFirestoreData;
    } catch (error) {
      console.error('Error al actualizar educación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update education: ${errorMessage}`);
    }
  }

  /**
   * Elimina una educación (soft delete)
   * 
   * @static
   * @param {string} id - ID de la educación
   * @returns {Promise<void>}
   * @throws {Error} Si falla la operación
   */
  static async deleteEducation(id: string): Promise<void> {
    try {
      await this.updateEducation(id, { isActive: false });
    } catch (error) {
      console.error('Error al eliminar educación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete education: ${errorMessage}`);
    }
  }

  /**
   * Elimina permanentemente una educación
   * 
   * @static
   * @param {string} id - ID de la educación
   * @returns {Promise<void>}
   * @throws {Error} Si falla la operación
   */
  static async hardDeleteEducation(id: string): Promise<void> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error al eliminar permanentemente educación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to hard delete education: ${errorMessage}`);
    }
  }
}



