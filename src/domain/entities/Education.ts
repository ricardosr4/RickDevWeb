/**
 * @fileoverview Entidad de dominio: Education
 * @module domain/entities/Education
 */

import type { BaseEntity, IEducationData } from '@shared/types';

/**
 * Clase que representa una educación en el dominio
 * 
 * @class Education
 * @implements {BaseEntity}
 */
export class Education implements BaseEntity {
  private readonly _id: string;
  private readonly _period: string;
  private readonly _degree: string;
  private readonly _institution: string;
  private readonly _description: string;

  /**
   * Crea una instancia de Education
   * 
   * @param {IEducationData} data - Datos de la educación
   * @throws {Error} Si los datos no son válidos
   */
  constructor(data: IEducationData) {
    this._id = data.id;
    this._period = data.period;
    this._degree = data.degree;
    this._institution = data.institution;
    this._description = data.description ?? '';
    this._validate();
  }

  /**
   * Valida los datos de la educación
   * 
   * @private
   * @throws {Error} Si los datos no son válidos
   */
  private _validate(): void {
    if (!this._id || typeof this._id !== 'string' || this._id.trim().length === 0) {
      throw new Error('Education ID is required and must be a non-empty string');
    }
    if (!this._period || typeof this._period !== 'string' || this._period.trim().length === 0) {
      throw new Error('Education period is required and must be a non-empty string');
    }
    if (!this._degree || typeof this._degree !== 'string' || this._degree.trim().length === 0) {
      throw new Error('Education degree is required and must be a non-empty string');
    }
    if (!this._institution || typeof this._institution !== 'string' || this._institution.trim().length === 0) {
      throw new Error('Education institution is required and must be a non-empty string');
    }
  }

  get id(): string {
    return this._id;
  }

  get period(): string {
    return this._period;
  }

  get degree(): string {
    return this._degree;
  }

  get institution(): string {
    return this._institution;
  }

  get description(): string {
    return this._description;
  }

  /**
   * Convierte la entidad a objeto plano
   * 
   * @returns {IEducationData} Objeto con los datos de la educación
   */
  toJSON(): IEducationData {
    return {
      id: this._id,
      period: this._period,
      degree: this._degree,
      institution: this._institution,
      description: this._description || undefined
    };
  }

  /**
   * Crea una instancia de Education desde un objeto plano
   * 
   * @static
   * @param {unknown} data - Datos a validar y convertir
   * @returns {Education} Instancia de Education
   * @throws {Error} Si los datos no son válidos
   */
  static fromJSON(data: unknown): Education {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid education data: must be an object');
    }

    const obj = data as Record<string, unknown>;
    
    return new Education({
      id: String(obj.id ?? ''),
      period: String(obj.period ?? ''),
      degree: String(obj.degree ?? ''),
      institution: String(obj.institution ?? ''),
      description: obj.description ? String(obj.description) : undefined
    });
  }
}


