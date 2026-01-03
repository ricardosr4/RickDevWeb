/**
 * @fileoverview Componente UI para tarjetas de proyectos
 * @module ui/components/ProjectCard
 */

import { Project } from '@domain/entities/Project';

/**
 * Componente para renderizar una tarjeta de proyecto
 * 
 * @class ProjectCard
 */
export class ProjectCard {
  private readonly _project: Project;

  /**
   * Crea una instancia de ProjectCard
   * 
   * @param {Project} project - Entidad de proyecto
   * @throws {Error} Si project no es una instancia de Project
   */
  constructor(project: Project) {
    if (!(project instanceof Project)) {
      throw new Error('ProjectCard requires a Project entity');
    }
    this._project = project;
  }

  /**
   * Renderiza el componente
   * 
   * @returns {HTMLElement} Elemento HTML de la tarjeta
   */
  render(): HTMLElement {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('aria-label', `Proyecto: ${this._project.title}`);

    card.innerHTML = `
      <div class="project-image" role="img" aria-label="${this._project.title}">
        <div class="project-placeholder">${this._project.title}</div>
      </div>
      <div class="project-content">
        <h3>${this._escapeHtml(this._project.title)}</h3>
        <p>${this._escapeHtml(this._project.description)}</p>
        <div class="project-tags" role="list" aria-label="Tecnologías utilizadas">
          ${this._renderTags()}
        </div>
        ${this._renderLink()}
      </div>
    `;

    return card;
  }

  /**
   * Renderiza los tags del proyecto
   * 
   * @returns {string} HTML de los tags
   * @private
   */
  private _renderTags(): string {
    return this._project.tags
      .map(tag => `<span class="tag" role="listitem">${this._escapeHtml(tag)}</span>`)
      .join('');
  }

  /**
   * Renderiza el enlace del proyecto si existe
   * 
   * @returns {string} HTML del enlace
   * @private
   */
  private _renderLink(): string {
    if (this._project.link) {
      return `
        <a href="${this._escapeHtml(this._project.link)}" 
           class="project-link" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="Ver proyecto ${this._project.title}">
          Ver más →
        </a>
      `;
    }
    return '';
  }

  /**
   * Escapa HTML para prevenir XSS
   * 
   * @param {string} text - Texto a escapar
   * @returns {string} Texto escapado
   * @private
   */
  private _escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}



