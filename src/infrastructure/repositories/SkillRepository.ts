/**
 * @fileoverview Repositorio para la colección de Skills
 * @module infrastructure/repositories/SkillRepository
 */

import { FirebaseService } from '../FirebaseService.js';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import type { ISkillsFirestoreData } from '../types/firestore.types';

/**
 * Repositorio para manejar operaciones de Skills en Firestore
 * 
 * @class SkillRepository
 */
export class SkillRepository {
  /**
   * Nombre de la colección
   * 
   * @private
   * @static
   * @readonly
   */
  private static readonly COLLECTION_NAME = 'skills';

  /**
   * ID del documento principal
   * 
   * @private
   * @static
   * @readonly
   */
  private static readonly DOCUMENT_ID = 'main';

  /**
   * Obtiene todas las habilidades organizadas por categorías
   * 
   * @static
   * @returns {Promise<ISkillsFirestoreData | null>} Objeto con habilidades por categoría o null
   * @throws {Error} Si falla la operación
   */
  static async getSkills(): Promise<ISkillsFirestoreData | null> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      
      if (!db) {
        throw new Error('No se pudo obtener la instancia de Firestore');
      }
      
      const docRef = doc(db, this.COLLECTION_NAME, this.DOCUMENT_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as ISkillsFirestoreData;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener habilidades:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get skills: ${errorMessage}`);
    }
  }

  /**
   * Actualiza o crea las habilidades
   * 
   * @static
   * @param {ISkillsFirestoreData} skillsData - Datos de las habilidades organizadas por categoría
   * @returns {Promise<ISkillsFirestoreData>} Habilidades actualizadas
   * @throws {Error} Si falla la operación
   */
  static async updateSkills(skillsData: ISkillsFirestoreData): Promise<ISkillsFirestoreData> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, this.DOCUMENT_ID);
      
      const dataToSave: ISkillsFirestoreData = {
        ...skillsData,
        updatedAt: Timestamp.now()
      };

      await setDoc(docRef, dataToSave, { merge: true });
      
      return dataToSave;
    } catch (error) {
      console.error('Error al actualizar habilidades:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update skills: ${errorMessage}`);
    }
  }
}





