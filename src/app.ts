/**
 * @fileoverview Punto de entrada principal de la aplicación
 * @module app
 */

import './styles/main.css';
import { FirebaseService } from '@infrastructure/FirebaseService';
import { NavigationService } from '@application/services/NavigationService';
import { AnimationService } from '@application/services/AnimationService';
import { HeaderService } from '@application/services/HeaderService';
import { ContactService } from '@application/services/ContactService';
import { DataService } from '@application/services/DataService';
import { ContentRenderer } from '@ui/services/ContentRenderer';
import { SELECTORS, EVENTS } from '@shared/constants';

/**
 * Servicios de la aplicación
 */
interface IServices {
  navigation?: NavigationService;
  animation?: AnimationService;
  header?: HeaderService;
  contact?: ContactService;
}

/**
 * Clase principal de la aplicación
 * 
 * @class App
 */
class App {
  private _services: IServices = {};
  private _isInitialized: boolean = false;

  /**
   * Crea una instancia de App
   */
  constructor() {
    this._services = {};
    this._isInitialized = false;
  }

  /**
   * Inicializa la aplicación
   * 
   * @returns {Promise<void>}
   * @throws {Error} Si la inicialización falla
   */
  async initialize(): Promise<void> {
    if (this._isInitialized) {
      console.warn('App ya está inicializada');
      return;
    }

    try {
      // Inicializar Firebase primero
      FirebaseService.initialize();
      
      // Verificar que Firestore esté disponible
      if (!FirebaseService.isInitialized()) {
        throw new Error('Firebase no se inicializó correctamente');
      }

      // Inicializar servicios
      this._initializeServices();

      // Cargar datos desde Firestore
      await this._loadDataFromFirestore();

      // Configurar eventos globales
      this._setupGlobalEvents();

      this._isInitialized = true;
      console.log('Aplicación inicializada correctamente');
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
      throw error;
    }
  }

  /**
   * Inicializa todos los servicios
   * 
   * @private
   */
  private _initializeServices(): void {
    // Navigation Service
    const menuToggle = document.querySelector<HTMLElement>(SELECTORS.MENU_TOGGLE);
    const nav = document.querySelector<HTMLElement>(SELECTORS.NAV);
    const navLinks = document.querySelectorAll<HTMLElement>(SELECTORS.NAV_LINKS);

    if (nav && navLinks.length > 0) {
      this._services.navigation = new NavigationService({
        menuToggle,
        nav,
        navLinks
      });
    }

    // Animation Service
    this._services.animation = new AnimationService();

    // Header Service
    const header = document.querySelector<HTMLElement>(SELECTORS.HEADER);
    if (header) {
      this._services.header = new HeaderService(header);
    }

    // Contact Service
    const contactForm = document.querySelector<HTMLFormElement>(SELECTORS.CONTACT_FORM);
    if (contactForm) {
      this._services.contact = new ContactService(contactForm);
    }
  }

  /**
   * Configura eventos globales
   * 
   * @private
   */
  private _setupGlobalEvents(): void {
    // Manejar errores no capturados
    window.addEventListener('error', (event: ErrorEvent) => {
      console.error('Error no capturado:', event.error);
    });

    // Manejar promesas rechazadas
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      console.error('Promesa rechazada no manejada:', event.reason);
    });
  }

  /**
   * Obtiene un servicio por nombre
   * 
   * @param {string} serviceName - Nombre del servicio
   * @returns {NavigationService | AnimationService | HeaderService | ContactService | null} Instancia del servicio
   */
  getService(
    serviceName: keyof IServices
  ): NavigationService | AnimationService | HeaderService | ContactService | null {
    return this._services[serviceName] || null;
  }

  /**
   * Carga datos desde Firestore y los renderiza
   * 
   * @private
   * @returns {Promise<void>}
   */
  private async _loadDataFromFirestore(): Promise<void> {
    try {
      // Cargar datos en paralelo para mayor velocidad
      const data = await DataService.loadAllData();

      // Renderizar contenido primero (sin esperar imágenes)
      // Esto hace que la página se muestre inmediatamente
      if (data.profile) {
        // Renderizar texto primero
        ContentRenderer.renderProfile(data.profile);
        ContentRenderer.renderContact(data.profile);
        
        // Preload de imágenes críticas tan pronto como tengamos las URLs
        // Esto inicia la descarga inmediatamente
        if (data.profile.bannerImage) {
          this._preloadImage(data.profile.bannerImage);
        }
        if (data.profile.profileImage || data.profile.avatar) {
          this._preloadImage(data.profile.profileImage || data.profile.avatar!);
        }
      }

      // Renderizar experiencias
      if (data.experiences && data.experiences.length > 0) {
        ContentRenderer.renderExperiences(data.experiences);
      }

      // Renderizar educaciones
      if (data.educations && data.educations.length > 0) {
        ContentRenderer.renderEducations(data.educations);
      }

      // Renderizar habilidades
      if (data.skills) {
        ContentRenderer.renderSkills(data.skills);
      }

      // Renderizar proyectos
      if (data.projects && data.projects.length > 0) {
        ContentRenderer.renderProjects(data.projects);
      }

      console.log('Datos cargados desde Firestore correctamente');
      
      // Las imágenes se cargarán de forma asíncrona sin bloquear
    } catch (error) {
      console.warn('No se pudieron cargar datos desde Firestore. Usando datos estáticos del HTML.', error);
      // Continuar con los datos estáticos del HTML si Firestore falla
    }
  }

  /**
   * Preload de imagen para iniciar la descarga inmediatamente
   * 
   * @private
   * @param {string} url - URL de la imagen
   */
  private _preloadImage(url: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  }

  /**
   * Limpia recursos de la aplicación
   */
  destroy(): void {
    if (this._services.animation) {
      this._services.animation.destroy();
    }
    DataService.clearCache();
    this._services = {};
    this._isInitialized = false;
  }
}

// Inicializar aplicación cuando el DOM esté listo
const app = new App();

if (document.readyState === 'loading') {
  document.addEventListener(EVENTS.DOM_CONTENT_LOADED, () => {
    app.initialize().catch(console.error);
  });
} else {
  app.initialize().catch(console.error);
}

// Exportar para uso en otros módulos si es necesario
export default app;


