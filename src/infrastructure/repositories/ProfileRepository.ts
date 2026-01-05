/**
 * @fileoverview Repositorio para la colección de Profile
 * @module infrastructure/repositories/ProfileRepository
 */

import { FirebaseService } from '../FirebaseService.js';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import type { IProfileData } from '../types/firestore.types';

/**
 * Repositorio para manejar operaciones de Profile en Firestore
 * 
 * @class ProfileRepository
 */
export class ProfileRepository {
  /**
   * Nombre de la colección
   * 
   * @private
   * @static
   * @readonly
   */
  private static readonly COLLECTION_NAME = 'profile';

  /**
   * ID del documento principal
   * 
   * @private
   * @static
   * @readonly
   */
  private static readonly DOCUMENT_ID = 'main';

  /**
   * Obtiene el perfil principal
   * 
   * @static
   * @returns {Promise<IProfileData | null>} Datos del perfil o null si no existe
   * @throws {Error} Si falla la operación
   */
  static async getProfile(): Promise<IProfileData | null> {
    try {
      // Verificar que FirebaseService esté disponible
      if (!FirebaseService || typeof FirebaseService.getFirestore !== 'function') {
        console.error('FirebaseService.getFirestore no está disponible');
        throw new Error('FirebaseService no está correctamente importado o inicializado');
      }
      
      // Asegurar que Firebase esté inicializado
      if (!FirebaseService.isInitialized()) {
        console.log('Firebase no inicializado, inicializando...');
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      
      if (!db) {
        throw new Error('No se pudo obtener la instancia de Firestore');
      }
      
      const docRef = doc(db, this.COLLECTION_NAME, this.DOCUMENT_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as IProfileData;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get profile: ${errorMessage}`);
    }
  }

  /**
   * Actualiza o crea el perfil principal
   * 
   * @static
   * @param {IProfileData} profileData - Datos del perfil
   * @returns {Promise<IProfileData>} Perfil actualizado
   * @throws {Error} Si falla la operación
   */
  static async updateProfile(profileData: IProfileData): Promise<IProfileData> {
    try {
      if (!FirebaseService.isInitialized()) {
        FirebaseService.initialize();
      }
      
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, this.DOCUMENT_ID);
      
      const dataToSave: IProfileData = {
        ...profileData,
        updatedAt: Timestamp.now()
      };

      if (!profileData.createdAt) {
        dataToSave.createdAt = Timestamp.now();
      }

      await setDoc(docRef, dataToSave, { merge: true });
      
      return {
        id: this.DOCUMENT_ID,
        ...dataToSave
      } as IProfileData;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update profile: ${errorMessage}`);
    }
  }
}





