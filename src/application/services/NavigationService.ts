/**
 * @fileoverview Servicio de aplicación para manejar la navegación
 * @module application/services/NavigationService
 */

import { SELECTORS, APP_CONFIG, EVENTS } from '@shared/constants';
import { getHashFromUrl, debounce } from '@shared/utils';

/**
 * Dependencias del NavigationService
 */
export interface INavigationServiceDependencies {
  menuToggle: HTMLElement | null;
  nav: HTMLElement | null;
  navLinks: NodeListOf<HTMLElement>;
}

/**
 * Servicio para manejar la navegación suave y el estado del menú
 * 
 * @class NavigationService
 */
export class NavigationService {
  private readonly _menuToggle: HTMLElement | null;
  private readonly _nav: HTMLElement | null;
  private readonly _navLinks: NodeListOf<HTMLElement>;
  private _activeSection: string | null = null;

  /**
   * Crea una instancia de NavigationService
   * 
   * @param {INavigationServiceDependencies} dependencies - Dependencias del servicio
   */
  constructor({ menuToggle, nav, navLinks }: INavigationServiceDependencies) {
    this._menuToggle = menuToggle;
    this._nav = nav;
    this._navLinks = navLinks;
    this._init();
  }

  /**
   * Inicializa el servicio
   * 
   * @private
   */
  private _init(): void {
    this._setupSmoothScroll();
    this._setupMenuToggle();
    this._setupActiveSectionTracking();
  }

  /**
   * Configura el scroll suave para los enlaces de navegación
   * 
   * @private
   */
  private _setupSmoothScroll(): void {
    this._navLinks.forEach(link => {
      link.addEventListener(EVENTS.CLICK, (e: Event) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          const targetId = getHashFromUrl(href);
          this.scrollToSection(targetId);
          this._closeMenu();
        }
      });
    });
  }

  /**
   * Configura el toggle del menú móvil
   * 
   * @private
   */
  private _setupMenuToggle(): void {
    if (this._menuToggle) {
      this._menuToggle.addEventListener(EVENTS.CLICK, () => {
        this._toggleMenu();
      });
    }
  }

  /**
   * Configura el seguimiento de la sección activa
   * 
   * @private
   */
  private _setupActiveSectionTracking(): void {
    const handleScroll = debounce(() => {
      this._updateActiveSection();
    }, 100);

    window.addEventListener(EVENTS.SCROLL, handleScroll, { passive: true });
    this._updateActiveSection(); // Inicializar al cargar
  }

  /**
   * Hace scroll suave a una sección
   * 
   * @param {string} sectionId - ID de la sección
   */
  scrollToSection(sectionId: string): void {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const offset = APP_CONFIG.SCROLL.OFFSET;
    const targetPosition = target.offsetTop - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: APP_CONFIG.SCROLL.BEHAVIOR
    });
  }

  /**
   * Toggle del menú móvil
   * 
   * @private
   */
  private _toggleMenu(): void {
    if (this._nav) {
      this._nav.classList.toggle('active');
      const isOpen = this._nav.classList.contains('active');
      this._menuToggle?.setAttribute('aria-expanded', String(isOpen));
      this._menuToggle?.classList.toggle('active', isOpen);
    }
  }

  /**
   * Cierra el menú móvil
   * 
   * @private
   */
  private _closeMenu(): void {
    if (this._nav) {
      this._nav.classList.remove('active');
      this._menuToggle?.setAttribute('aria-expanded', 'false');
      this._menuToggle?.classList.remove('active');
    }
  }

  /**
   * Actualiza la sección activa basándose en el scroll
   * 
   * @private
   */
  private _updateActiveSection(): void {
    const sections = document.querySelectorAll<HTMLElement>(SELECTORS.SECTIONS);
    const scrollPosition = window.pageYOffset + APP_CONFIG.SCROLL.OFFSET;

    let currentSection: string | null = null;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    if (currentSection && currentSection !== this._activeSection) {
      this._activeSection = currentSection;
      this._updateActiveNavLink(currentSection);
    }
  }

  /**
   * Actualiza el enlace activo en la navegación
   * 
   * @param {string} sectionId - ID de la sección activa
   * @private
   */
  private _updateActiveNavLink(sectionId: string): void {
    this._navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }
}


