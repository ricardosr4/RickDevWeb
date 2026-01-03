/**
 * @fileoverview Entidad de dominio: Experience
 * @module domain/entities/Experience
 */

import type { BaseEntity, IExperienceData } from '@shared/types';

/**
 * Clase que representa una experiencia laboral en el dominio
 * 
 * @class Experience
 * @implements {BaseEntity}
 */
export class Experience implements BaseEntity {
  private readonly _id: string;
  private readonly _period: string;
  private readonly _position: string;
  private readonly _company: string;
  private readonly _responsibilities: readonly string[];

  /**
   * Crea una instancia de Experience
   * 
   * @param {IExperienceData} data - Datos de la experiencia
   * @throws {Error} Si los datos no son válidos
   */
  constructor(data: IExperienceData) {
    this._id = data.id;
    this._period = data.period;
    this._position = data.position;
    this._company = data.company;
    this._responsibilities = Object.freeze([...data.responsibilities]); // Inmutabilidad
    this._validate();
  }

  /**
   * Valida los datos de la experiencia
   * 
   * @private
   * @throws {Error} Si los datos no son válidos
   */
  private _validate(): void {
    if (!this._id || typeof this._id !== 'string' || this._id.trim().length === 0) {
      throw new Error('Experience ID is required and must be a non-empty string');
    }
    if (!this._period || typeof this._period !== 'string' || this._period.trim().length === 0) {
      throw new Error('Experience period is required and must be a non-empty string');
    }
    if (!this._position || typeof this._position !== 'string' || this._position.trim().length === 0) {
      throw new Error('Experience position is required and must be a non-empty string');
    }
    if (!this._company || typeof this._company !== 'string' || this._company.trim().length === 0) {
      throw new Error('Experience company is required and must be a non-empty string');
    }
    if (!Array.isArray(this._responsibilities) || this._responsibilities.length === 0) {
      throw new Error('Experience responsibilities must be a non-empty array');
    }
  }

  get id(): string {
    return this._id;
  }

  get period(): string {
    return this._period;
  }

  get position(): string {
    return this._position;
  }

  get company(): string {
    return this._company;
  }

  /**
   * Obtiene las responsabilidades (copia inmutable)
   * 
   * @returns {readonly string[]} Array inmutable de responsabilidades
   */
  get responsibilities(): readonly string[] {
    return this._responsibilities;
  }

  /**
   * Convierte la entidad a objeto plano
   * 
   * @returns {IExperienceData} Objeto con los datos de la experiencia
   */
  toJSON(): IExperienceData {
    return {
      id: this._id,
      period: this._period,
      position: this._position,
      company: this._company,
      responsibilities: [...this._responsibilities]
    };
  }

  /**
   * Crea una instancia de Experience desde un objeto plano
   * 
   * @static
   * @param {unknown} data - Datos a validar y convertir
   * @returns {Experience} Instancia de Experience
   * @throws {Error} Si los datos no son válidos
   */
  static fromJSON(data: unknown): Experience {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid experience data: must be an object');
    }

    const obj = data as Record<string, unknown>;
    
    return new Experience({
      id: String(obj.id ?? ''),
      period: String(obj.period ?? ''),
      position: String(obj.position ?? ''),
      company: String(obj.company ?? ''),
      responsibilities: Array.isArray(obj.responsibilities) 
        ? obj.responsibilities.map(String) 
        : []
    });
  }
}



