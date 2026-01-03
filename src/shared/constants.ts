/**
 * @fileoverview Constantes compartidas de la aplicación
 * @module shared/constants
 */

/**
 * Configuración de Firebase
 */
export interface IFirebaseConfig {
  readonly API_KEY: string;
  readonly AUTH_DOMAIN: string;
  readonly PROJECT_ID: string;
  readonly STORAGE_BUCKET: string;
  readonly MESSAGING_SENDER_ID: string;
  readonly APP_ID: string;
}

/**
 * Configuración de animaciones
 */
export interface IAnimationConfig {
  readonly DURATION: number;
  readonly THRESHOLD: number;
  readonly ROOT_MARGIN: string;
}

/**
 * Configuración de scroll
 */
export interface IScrollConfig {
  readonly OFFSET: number;
  readonly BEHAVIOR: 'smooth' | 'auto';
}

/**
 * Configuración principal de la aplicación
 */
export const APP_CONFIG = {
  FIREBASE: {
    API_KEY: "AIzaSyCOf2Kp2IU8EH6onnlzAnzBfjOkAa1qsFY",
    AUTH_DOMAIN: "rickdev-90632.firebaseapp.com",
    PROJECT_ID: "rickdev-90632",
    STORAGE_BUCKET: "rickdev-90632.firebasestorage.app",
    MESSAGING_SENDER_ID: "333903910924",
    APP_ID: "1:333903910924:web:2f45d011d23c6b966f7629"
  } satisfies IFirebaseConfig,
  ANIMATION: {
    DURATION: 600,
    THRESHOLD: 0.1,
    ROOT_MARGIN: '0px 0px -50px 0px'
  } satisfies IAnimationConfig,
  SCROLL: {
    OFFSET: 200,
    BEHAVIOR: 'smooth' as const
  } satisfies IScrollConfig
} as const;

/**
 * Selectores CSS de la aplicación
 */
export const SELECTORS = {
  NAV_LINKS: 'a[href^="#"]',
  MENU_TOGGLE: '.menu-toggle',
  NAV: '.nav',
  CONTACT_FORM: '.contact-form',
  HEADER: '.header',
  SECTIONS: 'section[id]',
  ANIMATABLE: '.project-card, .education-item, .timeline-item, .contact-item'
} as const;

/**
 * Eventos del DOM
 */
export const EVENTS = {
  CLICK: 'click',
  SCROLL: 'scroll',
  SUBMIT: 'submit',
  DOM_CONTENT_LOADED: 'DOMContentLoaded'
} as const;

/**
 * Etiquetas ARIA para accesibilidad
 */
export const ARIA_LABELS = {
  MENU_TOGGLE: 'Toggle navigation menu',
  CLOSE_MENU: 'Close navigation menu'
} as const;

