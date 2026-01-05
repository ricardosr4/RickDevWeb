/**
 * @fileoverview Servicio de aplicación para cargar datos desde Firestore
 * @module application/services/DataService
 */

import { ProfileRepository } from '@infrastructure/repositories/ProfileRepository';
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import type { 
  IProfileData, 
  IExperienceFirestoreData, 
  IEducationFirestoreData, 
  ISkillsFirestoreData,
  IProjectFirestoreData 
} from '@infrastructure/types/firestore.types';

/**
 * Datos completos de la aplicación
 */
export interface IAppData {
  profile: IProfileData | null;
  experiences: IExperienceFirestoreData[];
  educations: IEducationFirestoreData[];
  skills: ISkillsFirestoreData | null;
  projects: IProjectFirestoreData[];
}

/**
 * Servicio para cargar y gestionar datos desde Firestore
 * 
 * @class DataService
 */
export class DataService {
  /**
   * Caché del perfil
   * 
   * @private
   * @static
   */
  private static _profile: IProfileData | null = null;

  /**
   * Caché de experiencias
   * 
   * @private
   * @static
   */
  private static _experiences: IExperienceFirestoreData[] | null = null;

  /**
   * Caché de educaciones
   * 
   * @private
   * @static
   */
  private static _educations: IEducationFirestoreData[] | null = null;

  /**
   * Caché de habilidades
   * 
   * @private
   * @static
   */
  private static _skills: ISkillsFirestoreData | null = null;

  /**
   * Caché de proyectos
   * 
   * @private
   * @static
   */
  private static _projects: IProjectFirestoreData[] | null = null;

  /**
   * Carga todos los datos desde Firestore
   * 
   * @static
   * @returns {Promise<IAppData>} Objeto con todos los datos cargados
   * @throws {Error} Si falla la carga
   */
  static async loadAllData(): Promise<IAppData> {
    try {
      // Limpiar caché de proyectos antes de cargar para obtener datos frescos
      // Esto asegura que los proyectos eliminados no aparezcan en la web
      this._projects = null;
      
      const [profile, experiences, educations, skills, projects] = await Promise.all([
        this.getProfile(true), // forceRefresh = true para obtener datos frescos
        this.getExperiences(true),
        this.getEducations(true),
        this.getSkills(true),
        this.getProjects(true) // forceRefresh = true - siempre obtener proyectos frescos desde el servidor
      ]);

      return {
        profile,
        experiences,
        educations,
        skills,
        projects
      };
    } catch (error) {
      console.error('Error al cargar datos:', error);
      throw error;
    }
  }

  /**
   * Obtiene el perfil
   * 
   * @static
   * @param {boolean} forceRefresh - Si es true, fuerza la recarga
   * @returns {Promise<IProfileData | null>} Datos del perfil
   */
  static async getProfile(forceRefresh: boolean = false): Promise<IProfileData | null> {
    if (this._profile && !forceRefresh) {
      return this._profile;
    }

    try {
      this._profile = await ProfileRepository.getProfile();
      return this._profile;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return null;
    }
  }

  /**
   * Obtiene las experiencias
   * 
   * @static
   * @param {boolean} forceRefresh - Si es true, fuerza la recarga
   * @returns {Promise<IExperienceFirestoreData[]>} Array de experiencias
   */
  static async getExperiences(forceRefresh: boolean = false): Promise<IExperienceFirestoreData[]> {
    if (this._experiences && !forceRefresh) {
      return this._experiences;
    }

    try {
      this._experiences = await ExperienceRepository.getExperiences();
      return this._experiences;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('index')) {
        console.warn('Los índices de Firestore se están construyendo. Esto puede tardar unos minutos. La aplicación usará datos estáticos mientras tanto.');
      } else {
        console.error('Error al obtener experiencias:', error);
      }
      return [];
    }
  }

  /**
   * Obtiene las educaciones
   * 
   * @static
   * @param {boolean} forceRefresh - Si es true, fuerza la recarga
   * @returns {Promise<IEducationFirestoreData[]>} Array de educaciones
   */
  static async getEducations(forceRefresh: boolean = false): Promise<IEducationFirestoreData[]> {
    if (this._educations && !forceRefresh) {
      return this._educations;
    }

    try {
      this._educations = await EducationRepository.getEducations();
      return this._educations;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('index')) {
        console.warn('Los índices de Firestore se están construyendo. Esto puede tardar unos minutos. La aplicación usará datos estáticos mientras tanto.');
      } else {
        console.error('Error al obtener educaciones:', error);
      }
      return [];
    }
  }

  /**
   * Obtiene las habilidades
   * 
   * @static
   * @param {boolean} forceRefresh - Si es true, fuerza la recarga
   * @returns {Promise<ISkillsFirestoreData | null>} Habilidades organizadas por categoría
   */
  static async getSkills(forceRefresh: boolean = false): Promise<ISkillsFirestoreData | null> {
    if (this._skills && !forceRefresh) {
      return this._skills;
    }

    try {
      this._skills = await SkillRepository.getSkills();
      return this._skills;
    } catch (error) {
      console.error('Error al obtener habilidades:', error);
      return null;
    }
  }

  /**
   * Obtiene los proyectos
   * 
   * @static
   * @param {boolean} forceRefresh - Si es true, fuerza la recarga
   * @returns {Promise<IProjectFirestoreData[]>} Array de proyectos
   */
  static async getProjects(_forceRefresh: boolean = false): Promise<IProjectFirestoreData[]> {
    // Para proyectos, siempre obtener datos frescos desde el servidor
    // No usar caché para evitar mostrar proyectos eliminados
    // getProjects ya usa getDocsFromServer, así que siempre obtiene datos frescos
    // El parámetro _forceRefresh se mantiene por compatibilidad pero no se usa
    
    try {
      // Siempre obtener datos frescos desde el servidor (ignorar caché)
      this._projects = await ProjectRepository.getProjects();
      return this._projects;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('index')) {
        console.warn('Los índices de Firestore se están construyendo. Esto puede tardar unos minutos. La aplicación usará datos estáticos mientras tanto.');
      } else {
        console.error('Error al obtener proyectos:', error);
      }
      return [];
    }
  }

  /**
   * Limpia el caché de datos
   * 
   * @static
   */
  static clearCache(): void {
    this._profile = null;
    this._experiences = null;
    this._educations = null;
    this._skills = null;
    this._projects = null;
  }
}



