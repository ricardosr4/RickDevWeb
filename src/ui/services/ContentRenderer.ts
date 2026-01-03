/**
 * @fileoverview Servicio para renderizar contenido dinámico desde Firestore
 * @module ui/services/ContentRenderer
 */

import type { 
  IProfileData, 
  IExperienceFirestoreData, 
  IEducationFirestoreData, 
  ISkillsFirestoreData 
} from '@infrastructure/types/firestore.types';
import type { Timestamp } from 'firebase/firestore';

/**
 * Servicio para renderizar contenido dinámico en el DOM
 * 
 * @class ContentRenderer
 */
export class ContentRenderer {
  /**
   * Renderiza el perfil en el header y hero
   * 
   * @static
   * @param {IProfileData | null} profile - Datos del perfil
   */
  static renderProfile(profile: IProfileData | null): void {
    if (!profile) return;

    // Actualizar nombre en header
    const headerName = document.querySelector<HTMLElement>('.logo h1');
    if (headerName && profile.fullName) {
      headerName.textContent = profile.fullName.split(' ').slice(0, 2).join(' ');
    }

    // Actualizar banner image con carga prioritaria inmediata
    const bannerImage = document.querySelector<HTMLElement>('#banner-image');
    if (bannerImage && profile.bannerImage) {
      // Cargar inmediatamente con alta prioridad (imagen crítica)
      this._loadImageAsync(profile.bannerImage, (url) => {
        bannerImage.style.backgroundImage = `url(${url})`;
        bannerImage.classList.add('image-loaded');
        bannerImage.setAttribute('aria-label', 'Banner de perfil personalizado');
      }, () => {
        bannerImage.classList.add('image-error');
      }, true); // high priority
    }

    // Actualizar profile image con carga prioritaria inmediata
    const profileImage = document.querySelector<HTMLImageElement>('#profile-image');
    if (profileImage) {
      const imageUrl = profile.profileImage || profile.avatar;
      if (imageUrl) {
        // Cargar inmediatamente con alta prioridad (imagen crítica)
        profileImage.loading = 'eager'; // Cambiar a eager para imágenes críticas
        profileImage.decoding = 'async';
        profileImage.fetchPriority = 'high'; // Alta prioridad de carga
        
        this._loadImageAsync(imageUrl, (url) => {
          profileImage.src = url;
          profileImage.alt = profile.fullName ? `Foto de perfil de ${profile.fullName}` : 'Foto de perfil';
          profileImage.classList.add('image-loaded');
        }, () => {
          profileImage.classList.add('image-error');
        }, true); // high priority
      } else {
        profileImage.src = '';
        profileImage.alt = 'Foto de perfil';
      }
    }

    // Actualizar título en hero
    const heroTitle = document.querySelector<HTMLElement>('.hero-title');
    if (heroTitle && profile.title) {
      heroTitle.textContent = profile.title;
    }

    // Actualizar subtítulo en hero
    const heroSubtitle = document.querySelector<HTMLElement>('.hero-subtitle');
    if (heroSubtitle && profile.bio) {
      heroSubtitle.textContent = profile.bio;
    }
  }

  /**
   * Renderiza las experiencias en el timeline
   * 
   * @static
   * @param {IExperienceFirestoreData[]} experiences - Array de experiencias
   */
  static renderExperiences(experiences: IExperienceFirestoreData[]): void {
    const timeline = document.querySelector<HTMLElement>('.timeline');
    if (!timeline || !experiences || experiences.length === 0) return;

    timeline.innerHTML = experiences.map(exp => {
      const responsibilities = exp.responsibilities || [];
      const responsibilitiesList = responsibilities
        .map(resp => `<li>${this._escapeHtml(resp)}</li>`)
        .join('');

      const technologies = Array.isArray(exp.technologies) && exp.technologies.length > 0
        ? exp.technologies.map(tech => `<span class="tech-badge">${this._escapeHtml(tech)}</span>`).join('')
        : '';

      return `
        <article class="timeline-item" role="listitem">
          <div class="timeline-marker" aria-hidden="true"></div>
          <div class="timeline-content">
            <time class="timeline-date" datetime="${this._getDateTime(exp.startDate, exp.endDate)}">${exp.period || ''}</time>
            <h3>${this._escapeHtml(exp.position || '')}</h3>
            <p class="timeline-company">${this._escapeHtml(exp.company || '')}${exp.location ? ` • ${this._escapeHtml(exp.location)}` : ''}</p>
            ${exp.description ? `<p class="timeline-description-text">${this._escapeHtml(exp.description)}</p>` : ''}
            ${responsibilitiesList ? `<ul class="timeline-description">${responsibilitiesList}</ul>` : ''}
            ${technologies ? `<div class="timeline-technologies">${technologies}</div>` : ''}
          </div>
        </article>
      `;
    }).join('');
  }

  /**
   * Renderiza las educaciones
   * 
   * @static
   * @param {IEducationFirestoreData[]} educations - Array de educaciones
   */
  static renderEducations(educations: IEducationFirestoreData[]): void {
    const educationSection = document.querySelector<HTMLElement>('.education-section');
    if (!educationSection || !educations || educations.length === 0) return;

    // Filtrar solo educaciones activas
    const activeEducations = educations.filter(edu => edu.isActive !== false);
    
    if (activeEducations.length === 0) {
      // Si no hay educaciones activas, ocultar la sección o mostrar mensaje
      const existingItems = educationSection.querySelectorAll<HTMLElement>('.education-item');
      existingItems.forEach(item => item.remove());
      return;
    }

    // Buscar el contenedor después del h3
    const h3 = educationSection.querySelector<HTMLElement>('h3');
    if (!h3) return;

    // Limpiar items existentes
    const existingItems = educationSection.querySelectorAll<HTMLElement>('.education-item');
    existingItems.forEach(item => item.remove());
    
    // Buscar o crear contenedor
    let container = h3.nextElementSibling as HTMLElement | null;
    if (!container || !container.classList.contains('education-list')) {
      container = document.createElement('div');
      container.className = 'education-list';
      educationSection.appendChild(container);
    }

    const educationItems = activeEducations.map(edu => {
      return `
        <div class="education-item">
          <div class="education-year">${this._escapeHtml(edu.period || '')}</div>
          <div class="education-details">
            <h4>${this._escapeHtml(edu.degree || '')}</h4>
            <p class="education-institution">${this._escapeHtml(edu.institution || '')}${edu.field ? ` • ${this._escapeHtml(edu.field)}` : ''}</p>
            ${edu.description ? `<p class="education-description">${this._escapeHtml(edu.description)}</p>` : ''}
            ${edu.honors ? `<p class="education-honors">${this._escapeHtml(edu.honors)}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = educationItems;
  }

  /**
   * Renderiza las habilidades
   * 
   * @static
   * @param {ISkillsFirestoreData | null} skills - Objeto con habilidades por categoría
   */
  static renderSkills(skills: ISkillsFirestoreData | null): void {
    if (!skills) return;

    const skillsSection = document.querySelector<HTMLElement>('.skills-section');
    if (!skillsSection) return;

    const skillsGrid = skillsSection.querySelector<HTMLElement>('.skills-grid');
    if (!skillsGrid) return;

    // Limpiar habilidades existentes
    skillsGrid.innerHTML = '';

    // Renderizar por categoría
    const skillKeys: (keyof ISkillsFirestoreData)[] = [
      'lenguajes',
      'frameworksUI',
      'arquitectura',
      'libreriasAPIs',
      'herramientas',
      'testing'
    ];

    skillKeys.forEach(categoryKey => {
      const categorySkills = skills[categoryKey];
      if (!Array.isArray(categorySkills) || categorySkills.length === 0) return;

      const categoryName = this._formatCategoryName(categoryKey);
      const skillsList = categorySkills
        .map(skill => {
          const skillName = typeof skill === 'string' ? skill : String(skill);
          return `<span class="skill-item" role="listitem">${this._escapeHtml(skillName)}</span>`;
        })
        .join('');

      const categoryHTML = `
        <div class="skill-category">
          <h4>${categoryName}</h4>
          <div class="skill-list" role="list" aria-label="Habilidades de ${categoryName}">
            ${skillsList}
          </div>
        </div>
      `;

      skillsGrid.insertAdjacentHTML('beforeend', categoryHTML);
    });
  }

  /**
   * Actualiza la información de contacto
   * 
   * @static
   * @param {IProfileData | null} profile - Datos del perfil
   */
  static renderContact(profile: IProfileData | null): void {
    if (!profile) return;

    const contactInfo = document.querySelector<HTMLElement>('.contact-info');
    if (!contactInfo) return;

    // Actualizar email
    const emailLink = contactInfo.querySelector<HTMLAnchorElement>('a[href^="mailto:"]');
    if (emailLink && profile.email) {
      emailLink.href = `mailto:${profile.email}`;
      emailLink.textContent = profile.email;
    }

    // Actualizar teléfono si existe
    if (profile.phone) {
      const phoneItem = contactInfo.querySelector<HTMLElement>('.contact-item:nth-child(2)');
      if (phoneItem) {
        phoneItem.innerHTML = `
          <h4>Teléfono</h4>
          <p><a href="tel:${profile.phone.replace(/\s/g, '')}" aria-label="Llamar a ${profile.fullName || 'contacto'}">${profile.phone}</a></p>
        `;
      }
    }

    // Actualizar ubicación
    if (profile.location) {
      const locationItem = contactInfo.querySelector<HTMLElement>('.contact-item:nth-child(3)');
      if (locationItem) {
        locationItem.innerHTML = `
          <h4>Ubicación</h4>
          <p>${this._escapeHtml(profile.location)}</p>
        `;
      }
    }

    // Actualizar LinkedIn
    if (profile.social?.linkedin) {
      const linkedinLink = contactInfo.querySelector<HTMLAnchorElement>('a[href*="linkedin"]');
      if (linkedinLink) {
        linkedinLink.href = profile.social.linkedin;
        linkedinLink.textContent = profile.social.linkedin.replace('https://www.', '').replace('https://', '');
      }
    }

    // Actualizar GitHub
    if (profile.social?.github) {
      const githubLink = contactInfo.querySelector<HTMLAnchorElement>('a[href*="github"]');
      if (githubLink) {
        githubLink.href = profile.social.github;
        githubLink.textContent = profile.social.github.replace('https://', '');
      }
    }
  }

  /**
   * Formatea el nombre de categoría
   * 
   * @static
   * @param {string} key - Clave de la categoría
   * @returns {string} Nombre formateado
   * @private
   */
  private static _formatCategoryName(key: string): string {
    const names: Record<string, string> = {
      lenguajes: 'Lenguajes',
      frameworksUI: 'Frameworks y UI',
      arquitectura: 'Arquitectura',
      libreriasAPIs: 'Librerías y APIs',
      herramientas: 'Herramientas',
      testing: 'Testing',
      frontend: 'Frontend',
      mobile: 'Mobile',
      libraries: 'Librerías',
      architecture: 'Arquitectura'
    };
    return names[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  /**
   * Obtiene datetime para el atributo datetime
   * 
   * @static
   * @param {Timestamp | undefined} startDate - Fecha de inicio
   * @param {Timestamp | null | undefined} endDate - Fecha de fin
   * @returns {string} Fecha formateada
   * @private
   */
  private static _getDateTime(
    startDate?: Timestamp, 
    endDate?: Timestamp | null
  ): string {
    // Si son Timestamps de Firestore, convertir
    if (startDate && typeof startDate.toDate === 'function') {
      const start = startDate.toDate();
      const end = endDate && typeof endDate.toDate === 'function' ? endDate.toDate() : null;
      if (end) {
        return `${start.getFullYear()}-${start.getMonth() + 1}/${end.getFullYear()}-${end.getMonth() + 1}`;
      }
      return `${start.getFullYear()}-${start.getMonth() + 1}`;
    }
    return '';
  }

  /**
   * Escapa HTML para prevenir XSS
   * 
   * @static
   * @param {string | null | undefined} text - Texto a escapar
   * @returns {string} Texto escapado
   * @private
   */
  private static _escapeHtml(text: string | null | undefined): string {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Carga una imagen de forma asíncrona con callbacks
   * 
   * @private
   * @param {string} url - URL de la imagen
   * @param {Function} onLoad - Callback cuando la imagen carga exitosamente
   * @param {Function} onError - Callback cuando hay un error
   * @param {boolean} highPriority - Si es true, usa fetchpriority="high"
   */
  private static _loadImageAsync(
    url: string, 
    onLoad: (url: string) => void, 
    onError: () => void,
    highPriority: boolean = false
  ): void {
    const img = new Image();
    
    // Configurar prioridad de carga si el navegador lo soporta
    if (highPriority && 'fetchPriority' in img) {
      (img as any).fetchPriority = 'high';
    }
    
    // Agregar referrerpolicy para mejor performance
    img.referrerPolicy = 'no-referrer-when-downgrade';
    
    // Usar requestIdleCallback si está disponible para no bloquear, pero con timeout corto
    const loadImage = () => {
      img.onload = () => {
        onLoad(url);
      };
      
      img.onerror = () => {
        console.warn('Error al cargar imagen:', url);
        onError();
      };
      
      // Iniciar carga inmediatamente
      img.src = url;
    };
    
    // Para imágenes críticas, cargar inmediatamente
    // Para otras, usar requestIdleCallback con timeout corto
    if (highPriority) {
      loadImage();
    } else if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadImage, { timeout: 100 });
    } else {
      // Fallback: cargar después de un pequeño delay
      setTimeout(loadImage, 10);
    }
  }
}


