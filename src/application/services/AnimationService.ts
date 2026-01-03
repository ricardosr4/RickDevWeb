/**
 * @fileoverview Servicio de aplicación para manejar animaciones
 * @module application/services/AnimationService
 */

import { SELECTORS, APP_CONFIG } from '@shared/constants';

/**
 * Servicio para manejar animaciones de entrada de elementos
 * 
 * @class AnimationService
 */
export class AnimationService {
  /**
   * Observer para detectar elementos visibles
   * 
   * @private
   */
  private _observer: IntersectionObserver | null = null;

  /**
   * Crea una instancia de AnimationService
   */
  constructor() {
    this._init();
  }

  /**
   * Inicializa el servicio de animaciones
   * 
   * @private
   */
  private _init(): void {
    this._createObserver();
    this._observeElements();
  }

  /**
   * Crea el IntersectionObserver para detectar elementos visibles
   * 
   * @private
   */
  private _createObserver(): void {
    const options: IntersectionObserverInit = {
      threshold: APP_CONFIG.ANIMATION.THRESHOLD,
      rootMargin: APP_CONFIG.ANIMATION.ROOT_MARGIN
    };

    this._observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._animateElement(entry.target as HTMLElement);
          this._observer?.unobserve(entry.target);
        }
      });
    }, options);
  }

  /**
   * Observa los elementos animables
   * 
   * @private
   */
  private _observeElements(): void {
    const elements = document.querySelectorAll<HTMLElement>(SELECTORS.ANIMATABLE);
    elements.forEach(element => {
      this._prepareElement(element);
      this._observer?.observe(element);
    });
  }

  /**
   * Prepara un elemento para la animación
   * 
   * @param {HTMLElement} element - Elemento a preparar
   * @private
   */
  private _prepareElement(element: HTMLElement): void {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity ${APP_CONFIG.ANIMATION.DURATION}ms ease, transform ${APP_CONFIG.ANIMATION.DURATION}ms ease`;
  }

  /**
   * Anima un elemento cuando entra en el viewport
   * 
   * @param {HTMLElement} element - Elemento a animar
   * @private
   */
  private _animateElement(element: HTMLElement): void {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  /**
   * Observa un nuevo elemento
   * 
   * @param {HTMLElement} element - Elemento a observar
   */
  observeElement(element: HTMLElement): void {
    if (this._observer && element) {
      this._prepareElement(element);
      this._observer.observe(element);
    }
  }

  /**
   * Limpia el observer
   */
  destroy(): void {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}



