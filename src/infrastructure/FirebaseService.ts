/**
 * @fileoverview Servicio de infraestructura para Firebase
 * @module infrastructure/FirebaseService
 */

import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { APP_CONFIG } from '@shared/constants';
import type { IFirebaseServices } from './types/firebase.types';

/**
 * Servicio para manejar la inicialización y configuración de Firebase
 * 
 * @class FirebaseService
 */
export class FirebaseService {
  /**
   * Instancia de Firebase App
   * 
   * @private
   * @static
   */
  private static _app: FirebaseApp | null = null;

  /**
   * Instancia de Firestore
   * 
   * @private
   * @static
   */
  private static _db: Firestore | null = null;

  /**
   * Instancia de Firebase Auth
   * 
   * @private
   * @static
   */
  private static _auth: Auth | null = null;

  /**
   * Instancia de Firebase Storage
   * 
   * @private
   * @static
   */
  private static _storage: FirebaseStorage | null = null;

  /**
   * Inicializa Firebase con la configuración proporcionada
   * 
   * @static
   * @returns {FirebaseApp} Instancia de Firebase App
   * @throws {Error} Si la inicialización falla
   */
  static initialize(): FirebaseApp {
    if (this._app && this._db && this._auth && this._storage) {
      console.log('Firebase ya está inicializado');
      return this._app;
    }

    try {
      const firebaseConfig: FirebaseOptions = {
        apiKey: APP_CONFIG.FIREBASE.API_KEY,
        authDomain: APP_CONFIG.FIREBASE.AUTH_DOMAIN,
        projectId: APP_CONFIG.FIREBASE.PROJECT_ID,
        storageBucket: APP_CONFIG.FIREBASE.STORAGE_BUCKET,
        messagingSenderId: APP_CONFIG.FIREBASE.MESSAGING_SENDER_ID,
        appId: APP_CONFIG.FIREBASE.APP_ID
      };

      this._app = initializeApp(firebaseConfig);
      
      if (typeof getFirestore !== 'function') {
        throw new Error('getFirestore no está disponible. Verifica los imports de Firebase.');
      }
      
      this._db = getFirestore(this._app);
      
      if (!this._db) {
        throw new Error('No se pudo obtener la instancia de Firestore');
      }

      if (typeof getAuth !== 'function') {
        throw new Error('getAuth no está disponible. Verifica los imports de Firebase.');
      }

      this._auth = getAuth(this._app);
      
      if (!this._auth) {
        throw new Error('No se pudo obtener la instancia de Auth');
      }

      if (typeof getStorage !== 'function') {
        throw new Error('getStorage no está disponible. Verifica los imports de Firebase.');
      }

      this._storage = getStorage(this._app);
      
      if (!this._storage) {
        throw new Error('No se pudo obtener la instancia de Storage');
      }
      
      console.log('Firebase inicializado correctamente:', this._app.name);
      console.log('Firestore inicializado correctamente');
      console.log('Auth inicializado correctamente');
      console.log('Storage inicializado correctamente');
      
      return this._app;
    } catch (error) {
      console.error('Error al inicializar Firebase:', error);
      this._app = null;
      this._db = null;
      this._auth = null;
      this._storage = null;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Firebase initialization failed: ${errorMessage}`);
    }
  }

  /**
   * Obtiene la instancia de Firebase App
   * 
   * @static
   * @returns {FirebaseApp} Instancia de Firebase App
   * @throws {Error} Si Firebase no está inicializado
   */
  static getApp(): FirebaseApp {
    if (!this._app) {
      throw new Error('Firebase no está inicializado. Llama a initialize() primero.');
    }
    return this._app;
  }

  /**
   * Obtiene la instancia de Firestore
   * 
   * @static
   * @returns {Firestore} Instancia de Firestore
   * @throws {Error} Si Firebase no está inicializado
   */
  static getFirestore(): Firestore {
    if (!this._app || !this._db) {
      console.warn('Firestore no inicializado, intentando inicializar...');
      try {
        this.initialize();
      } catch (error) {
        console.error('Error al inicializar Firebase en getFirestore:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Firestore no está disponible: ${errorMessage}`);
      }
    }
    
    if (!this._db) {
      throw new Error('Firestore no está disponible. Verifica que Firebase esté inicializado correctamente.');
    }
    
    return this._db;
  }

  /**
   * Obtiene la instancia de Firebase Auth
   * 
   * @static
   * @returns {Auth} Instancia de Firebase Auth
   * @throws {Error} Si Firebase no está inicializado
   */
  static getAuth(): Auth {
    if (!this._app || !this._auth) {
      console.warn('Auth no inicializado, intentando inicializar...');
      try {
        this.initialize();
      } catch (error) {
        console.error('Error al inicializar Firebase en getAuth:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Auth no está disponible: ${errorMessage}`);
      }
    }
    
    if (!this._auth) {
      throw new Error('Auth no está disponible. Verifica que Firebase esté inicializado correctamente.');
    }
    
    return this._auth;
  }

  /**
   * Obtiene la instancia de Firebase Storage
   * 
   * @static
   * @returns {FirebaseStorage} Instancia de Firebase Storage
   * @throws {Error} Si Firebase no está inicializado
   */
  static getStorage(): FirebaseStorage {
    if (!this._app || !this._storage) {
      console.warn('Storage no inicializado, intentando inicializar...');
      try {
        this.initialize();
      } catch (error) {
        console.error('Error al inicializar Firebase en getStorage:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Storage no está disponible: ${errorMessage}`);
      }
    }
    
    if (!this._storage) {
      throw new Error('Storage no está disponible. Verifica que Firebase esté inicializado correctamente.');
    }
    
    return this._storage;
  }

  /**
   * Obtiene todos los servicios de Firebase
   * 
   * @static
   * @returns {IFirebaseServices} Objeto con todos los servicios
   * @throws {Error} Si Firebase no está inicializado
   */
  static getServices(): IFirebaseServices {
    return {
      app: this.getApp(),
      firestore: this.getFirestore(),
      auth: this.getAuth()
    };
  }

  /**
   * Verifica si Firebase está inicializado
   * 
   * @static
   * @returns {boolean} True si Firebase está inicializado
   */
  static isInitialized(): boolean {
    return this._app !== null && this._db !== null && this._auth !== null && this._storage !== null;
  }
}


