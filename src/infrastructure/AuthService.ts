/**
 * @fileoverview Servicio de autenticación con Firebase Auth
 * @module infrastructure/AuthService
 */

import { FirebaseService } from './FirebaseService.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  type User,
  type UserCredential,
  type Unsubscribe
} from 'firebase/auth';

/**
 * Resultado de una operación de autenticación
 */
export interface IAuthResult {
  user: User;
  success: boolean;
}

/**
 * Resultado de logout
 */
export interface ILogoutResult {
  success: boolean;
}

/**
 * Servicio para manejar la autenticación
 * 
 * @class AuthService
 */
export class AuthService {

  /**
   * Inicia sesión con email y password
   * 
   * @static
   * @param {string} email - Email del usuario
   * @param {string} password - Password del usuario
   * @returns {Promise<IAuthResult>} Usuario autenticado
   * @throws {Error} Si la autenticación falla
   */
  static async login(email: string, password: string): Promise<IAuthResult> {
    try {
      const auth = FirebaseService.getAuth();
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        user: userCredential.user,
        success: true
      };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      const errorCode = (error as { code?: string })?.code || 'unknown';
      throw new Error(this._getErrorMessage(errorCode));
    }
  }

  /**
   * Crea un nuevo usuario
   * 
   * @static
   * @param {string} email - Email del usuario
   * @param {string} password - Password del usuario
   * @returns {Promise<IAuthResult>} Usuario creado
   * @throws {Error} Si el registro falla
   */
  static async register(email: string, password: string): Promise<IAuthResult> {
    try {
      const auth = FirebaseService.getAuth();
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        user: userCredential.user,
        success: true
      };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      const errorCode = (error as { code?: string })?.code || 'unknown';
      throw new Error(this._getErrorMessage(errorCode));
    }
  }

  /**
   * Cierra sesión
   * 
   * @static
   * @returns {Promise<ILogoutResult>} Resultado del logout
   * @throws {Error} Si el logout falla
   */
  static async logout(): Promise<ILogoutResult> {
    try {
      const auth = FirebaseService.getAuth();
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  /**
   * Obtiene el usuario actual
   * 
   * @static
   * @returns {User | null} Usuario actual o null si no hay sesión
   */
  static getCurrentUser(): User | null {
    try {
      const auth = FirebaseService.getAuth();
      return auth.currentUser;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  /**
   * Verifica si hay un usuario autenticado
   * 
   * @static
   * @returns {boolean} True si hay usuario autenticado
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Observa cambios en el estado de autenticación
   * 
   * @static
   * @param {(user: User | null) => void} callback - Callback que se ejecuta cuando cambia el estado
   * @returns {Unsubscribe} Función para desuscribirse
   */
  static onAuthStateChange(callback: (user: User | null) => void): Unsubscribe {
    try {
      const auth = FirebaseService.getAuth();
      return onAuthStateChanged(auth, callback);
    } catch (error) {
      console.error('Error al observar cambios de autenticación:', error);
      return () => {}; // Retorna función vacía si falla
    }
  }

  /**
   * Convierte códigos de error de Firebase a mensajes legibles
   * 
   * @private
   * @static
   * @param {string} errorCode - Código de error de Firebase
   * @returns {string} Mensaje de error legible
   */
  private static _getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Email o contraseña incorrectos',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/email-already-in-use': 'El email ya está en uso',
      'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres)',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/operation-not-allowed': 'Este método de autenticación no está habilitado. Ve a Firebase Console > Authentication > Sign-in method y habilita Email/Password'
    };

    return errorMessages[errorCode] || `Error al autenticar: ${errorCode || 'Error desconocido'}`;
  }
}

