/**
 * @fileoverview Tipos globales y interfaces compartidas
 * @module shared/types
 */

// Firebase Types
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { User } from 'firebase/auth';

export type { FirebaseApp, Firestore, Auth, User };

/**
 * Interfaz base para todas las entidades del dominio
 */
export interface BaseEntity {
  readonly id: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

/**
 * Interfaz para datos de un proyecto
 */
export interface IProjectData {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly imageUrl?: string;
  readonly link?: string;
}

/**
 * Interfaz para datos de educación
 */
export interface IEducationData {
  readonly id: string;
  readonly period: string;
  readonly degree: string;
  readonly institution: string;
  readonly description?: string;
}

/**
 * Interfaz para datos de experiencia laboral
 */
export interface IExperienceData {
  readonly id: string;
  readonly period: string;
  readonly position: string;
  readonly company: string;
  readonly responsibilities: readonly string[];
}

/**
 * Interfaz para datos de habilidades
 */
export interface ISkillData {
  readonly category: string;
  readonly items: readonly string[];
}

/**
 * Interfaz para datos del formulario de contacto
 */
export interface IContactFormData {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

/**
 * Configuración de servicios de aplicación
 */
export interface ServiceConfig {
  [key: string]: unknown;
}

/**
 * Opciones para renderizado de componentes UI
 */
export interface RenderOptions {
  container: HTMLElement;
  data: unknown;
}

/**
 * Resultado de operaciones asíncronas
 */
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * Configuración de paginación
 */
export interface PaginationConfig {
  page: number;
  limit: number;
  total?: number;
}

/**
 * Selectores CSS tipados
 */
export interface Selectors {
  [key: string]: string;
}

/**
 * Eventos del DOM tipados
 */
export interface DOMEvents {
  [key: string]: string;
}

/**
 * Configuración de animaciones
 */
export interface AnimationConfig {
  duration: number;
  threshold: number;
  rootMargin: string;
}

/**
 * Configuración de scroll
 */
export interface ScrollConfig {
  offset: number;
  behavior: 'smooth' | 'auto';
}

