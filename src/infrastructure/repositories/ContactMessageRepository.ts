/**
 * @fileoverview Repositorio para manejar mensajes de contacto en Firestore
 * @module infrastructure/repositories/ContactMessageRepository
 */

import { FirebaseService } from '../FirebaseService';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  doc,
  deleteDoc,
  Timestamp,
  type QuerySnapshot,
  type DocumentData
} from 'firebase/firestore';

/**
 * Interfaz para datos de mensaje de contacto
 */
export interface IContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  read?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Repositorio para manejar mensajes de contacto
 * 
 * @class ContactMessageRepository
 */
export class ContactMessageRepository {
  private static readonly COLLECTION_NAME = 'contactMessages';

  /**
   * Guarda un nuevo mensaje de contacto
   * 
   * @static
   * @param {Omit<IContactMessage, 'id' | 'createdAt' | 'updatedAt'>} messageData - Datos del mensaje
   * @returns {Promise<string>} ID del mensaje creado
   * @throws {Error} Si falla la operación
   */
  static async createMessage(
    messageData: Omit<IContactMessage, 'id' | 'createdAt' | 'updatedAt' | 'read'>
  ): Promise<string> {
    try {
      const db = FirebaseService.getFirestore();
      
      const dataToSave: Omit<IContactMessage, 'id'> = {
        ...messageData,
        read: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), dataToSave);
      console.log('Mensaje de contacto guardado con ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar mensaje de contacto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error al guardar mensaje: ${errorMessage}`);
    }
  }

  /**
   * Obtiene todos los mensajes de contacto
   * 
   * @static
   * @param {number} maxResults - Número máximo de resultados (default: 100)
   * @returns {Promise<IContactMessage[]>} Lista de mensajes
   * @throws {Error} Si falla la operación
   */
  static async getAllMessages(maxResults: number = 100): Promise<IContactMessage[]> {
    try {
      const db = FirebaseService.getFirestore();
      
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
      );

      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      
      const messages: IContactMessage[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as IContactMessage);
      });

      return messages;
    } catch (error) {
      console.error('Error al obtener mensajes de contacto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error al obtener mensajes: ${errorMessage}`);
    }
  }

  /**
   * Marca un mensaje como leído
   * 
   * @static
   * @param {string} messageId - ID del mensaje
   * @returns {Promise<void>}
   * @throws {Error} Si falla la operación
   */
  static async markAsRead(messageId: string): Promise<void> {
    try {
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, messageId);
      
      // Usar setDoc con merge para actualizar solo el campo read
      const { setDoc } = await import('firebase/firestore');
      await setDoc(docRef, { 
        read: true, 
        updatedAt: Timestamp.now() 
      }, { merge: true });
      
      console.log('Mensaje marcado como leído:', messageId);
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error al marcar mensaje como leído: ${errorMessage}`);
    }
  }

  /**
   * Elimina un mensaje
   * 
   * @static
   * @param {string} messageId - ID del mensaje
   * @returns {Promise<void>}
   * @throws {Error} Si falla la operación
   */
  static async deleteMessage(messageId: string): Promise<void> {
    try {
      const db = FirebaseService.getFirestore();
      const docRef = doc(db, this.COLLECTION_NAME, messageId);
      
      await deleteDoc(docRef);
      console.log('Mensaje eliminado:', messageId);
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error al eliminar mensaje: ${errorMessage}`);
    }
  }

  /**
   * Obtiene el número de mensajes no leídos
   * 
   * @static
   * @returns {Promise<number>} Número de mensajes no leídos
   * @throws {Error} Si falla la operación
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const messages = await this.getAllMessages(1000);
      return messages.filter(msg => !msg.read).length;
    } catch (error) {
      console.error('Error al obtener conteo de mensajes no leídos:', error);
      return 0;
    }
  }
}

