/**
 * @fileoverview Tipos específicos de Firebase
 * @module infrastructure/types/firebase.types
 */

import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';

/**
 * Configuración de Firebase
 */
export interface IFirebaseConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly appId: string;
}

/**
 * Servicios de Firebase inicializados
 */
export interface IFirebaseServices {
  readonly app: FirebaseApp;
  readonly firestore: Firestore;
  readonly auth: Auth;
  readonly storage?: FirebaseStorage;
}

/**
 * Opciones de inicialización de Firebase
 */
export interface IFirebaseInitOptions {
  config: IFirebaseConfig;
  enableAppCheck?: boolean;
}

/**
 * Error personalizado de Firebase
 */
export class FirebaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'FirebaseError';
    Object.setPrototypeOf(this, FirebaseError.prototype);
  }
}

