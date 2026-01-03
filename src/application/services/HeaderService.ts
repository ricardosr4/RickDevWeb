/**
 * @fileoverview Servicio de aplicación para manejar el header
 * @module application/services/HeaderService
 */

import { EVENTS } from '@shared/constants';
import { throttle } from '@shared/utils';
import { optimizeScroll } from '@shared/performance';

/**
 * Servicio para manejar el comportamiento del header
 * 
 * @class HeaderService
 */
export class HeaderService {
  private readonly _header: HTMLElement;

  /**
   * Crea una instancia de HeaderService
   * 
   * @param {HTMLElement} header - Elemento del header
   */
  constructor(header: HTMLElement) {
    this._header = header;
    this._init();
  }

  /**
   * Inicializa el servicio
   * 
   * @private
   */
  private _init(): void {
    this._setupScrollEffect();
  }

  /**
   * Configura el efecto de scroll en el header
   * 
   * @private
   */
  private _setupScrollEffect(): void {
    const handleScroll = optimizeScroll(
      throttle(() => {
        const currentScrollY = window.pageYOffset;
        
        if (currentScrollY > 100) {
          this._header.classList.add('scrolled');
        } else {
          this._header.classList.remove('scrolled');
        }
      }, 100)
    );

    window.addEventListener(EVENTS.SCROLL, handleScroll, { passive: true });
  }
}

