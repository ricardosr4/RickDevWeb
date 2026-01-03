/**
 * @fileoverview Tipos para datos de Firestore
 * @module infrastructure/types/firestore.types
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Datos de perfil en Firestore
 */
export interface IProfileData {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  avatar?: string;
  bannerImage?: string;
  profileImage?: string;
  social?: {
    linkedin?: string;
    github?: string;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Datos de experiencia en Firestore
 */
export interface IExperienceFirestoreData {
  id?: string;
  position?: string;
  company?: string;
  location?: string;
  startDate?: Timestamp;
  endDate?: Timestamp | null;
  isCurrent?: boolean;
  period?: string;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  order?: number;
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Datos de educación en Firestore
 */
export interface IEducationFirestoreData {
  id?: string;
  degree?: string;
  institution?: string;
  field?: string;
  location?: string;
  startDate?: Timestamp;
  endDate?: Timestamp | null;
  period?: string;
  description?: string;
  honors?: string;
  order?: number;
  isActive?: boolean;
  isCompleted?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Datos de habilidades en Firestore
 */
export interface ISkillsFirestoreData {
  lenguajes?: string[];
  frameworksUI?: string[];
  arquitectura?: string[];
  libreriasAPIs?: string[];
  herramientas?: string[];
  testing?: string[];
  updatedAt?: Timestamp;
}


