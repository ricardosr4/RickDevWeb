/**
 * @fileoverview Entidad de dominio: Project
 * @module domain/entities/Project
 */

import type { BaseEntity, IProjectData } from '@shared/types';

/**
 * Clase que representa un proyecto en el dominio
 * 
 * @class Project
 * @implements {BaseEntity}
 */
export class Project implements BaseEntity {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _tags: readonly string[];
  private readonly _imageUrl: string;
  private readonly _link: string;

  /**
   * Crea una instancia de Project
   * 
   * @param {IProjectData} data - Datos del proyecto
   * @throws {Error} Si los datos no son válidos
   */
  constructor(data: IProjectData) {
    this._id = data.id;
    this._title = data.title;
    this._description = data.description;
    this._tags = Object.freeze([...data.tags]); // Inmutabilidad
    this._imageUrl = data.imageUrl ?? '';
    this._link = data.link ?? '';
    this._validate();
  }

  /**
   * Valida los datos del proyecto
   * 
   * @private
   * @throws {Error} Si los datos no son válidos
   */
  private _validate(): void {
    if (!this._id || typeof this._id !== 'string' || this._id.trim().length === 0) {
      throw new Error('Project ID is required and must be a non-empty string');
    }
    if (!this._title || typeof this._title !== 'string' || this._title.trim().length === 0) {
      throw new Error('Project title is required and must be a non-empty string');
    }
    if (!this._description || typeof this._description !== 'string' || this._description.trim().length === 0) {
      throw new Error('Project description is required and must be a non-empty string');
    }
    if (!Array.isArray(this._tags)) {
      throw new Error('Project tags must be an array');
    }
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  /**
   * Obtiene las etiquetas del proyecto (copia inmutable)
   * 
   * @returns {readonly string[]} Array inmutable de etiquetas
   */
  get tags(): readonly string[] {
    return this._tags;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get link(): string {
    return this._link;
  }

  /**
   * Convierte la entidad a objeto plano
   * 
   * @returns {IProjectData} Objeto con los datos del proyecto
   */
  toJSON(): IProjectData {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      tags: [...this._tags],
      imageUrl: this._imageUrl || undefined,
      link: this._link || undefined
    };
  }

  /**
   * Crea una instancia de Project desde un objeto plano
   * 
   * @static
   * @param {unknown} data - Datos a validar y convertir
   * @returns {Project} Instancia de Project
   * @throws {Error} Si los datos no son válidos
   */
  static fromJSON(data: unknown): Project {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid project data: must be an object');
    }

    const obj = data as Record<string, unknown>;
    
    return new Project({
      id: String(obj.id ?? ''),
      title: String(obj.title ?? ''),
      description: String(obj.description ?? ''),
      tags: Array.isArray(obj.tags) ? obj.tags.map(String) : [],
      imageUrl: obj.imageUrl ? String(obj.imageUrl) : undefined,
      link: obj.link ? String(obj.link) : undefined
    });
  }
}



