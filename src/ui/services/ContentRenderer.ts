/**
 * @fileoverview Servicio para renderizar contenido dinámico desde Firestore
 * @module ui/services/ContentRenderer
 */

import type { 
  IProfileData, 
  IExperienceFirestoreData, 
  IEducationFirestoreData, 
  ISkillsFirestoreData,
  IProjectFirestoreData 
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
   * Renderiza los proyectos
   * 
   * @static
   * @param {IProjectFirestoreData[]} projects - Array de proyectos
   */
  static renderProjects(projects: IProjectFirestoreData[]): void {
    const projectsGrid = document.querySelector<HTMLElement>('.projects-grid');
    if (!projectsGrid) {
      console.warn('ContentRenderer.renderProjects: No se encontró .projects-grid');
      return;
    }

    console.log('ContentRenderer.renderProjects: Proyectos recibidos:', projects);

    // Limpiar el grid primero para evitar el "flash" de contenido estático
    projectsGrid.innerHTML = '';
    
    // Si no hay proyectos, mostrar mensaje
    if (!projects || projects.length === 0) {
      console.log('ContentRenderer.renderProjects: No hay proyectos, mostrando mensaje');
      projectsGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No hay proyectos disponibles</p>';
      return;
    }

    // Filtrar solo proyectos activos (isActive debe ser explícitamente true)
    // Esto asegura que los proyectos eliminados o inactivos no aparezcan
    const activeProjects = projects
      .filter(proj => {
        const isActive = proj.isActive === true;
        if (!isActive) {
          console.log(`✗ Proyecto ${proj.id} filtrado en render (isActive: ${proj.isActive}, name: ${proj.name})`);
        }
        return isActive;
      })
      .sort((a, b) => (b.order || 0) - (a.order || 0))
      .slice(0, 9); // Limitar a máximo 9 proyectos
    
    console.log('ContentRenderer.renderProjects: Proyectos activos después de filtrar:', activeProjects.length);
    console.log('ContentRenderer.renderProjects: IDs de proyectos activos:', activeProjects.map(p => ({ id: p.id, name: p.name, isActive: p.isActive })));
    
    if (activeProjects.length === 0) {
      projectsGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No hay proyectos activos disponibles</p>';
      return;
    }

    projectsGrid.innerHTML = activeProjects.map(project => {
      const technologies = Array.isArray(project.technologies) && project.technologies.length > 0
        ? project.technologies.map(tech => `<span class="tag" role="listitem">${this._escapeHtml(tech)}</span>`).join('')
        : '';

      const projectId = project.id || `project-${Date.now()}`;
      const projectUrl = `#proyecto-${projectId}`;

      // Detectar si es video o imagen
      const isVideo = project.mainImage && (project.mainImage.includes('.webm') || project.mainImage.includes('.mp4') || project.mainImage.includes('.ogg'));
      const projectNameEscaped = this._escapeHtml(project.name || 'Proyecto');
      const imageUrlEscaped = project.mainImage ? this._escapeHtml(project.mainImage) : '';
      
      return `
        <article class="project-card" role="listitem" data-project-id="${projectId}">
          <div class="project-image">
            ${project.mainImage 
              ? (isVideo 
                  ? `<video src="${imageUrlEscaped}" alt="${projectNameEscaped}" loading="lazy" muted playsinline></video>`
                  : `<img src="${imageUrlEscaped}" alt="${projectNameEscaped}" loading="lazy">`)
              : `<div class="project-placeholder" aria-hidden="true">${projectNameEscaped}</div>`
            }
          </div>
          <div class="project-content">
            <h3>${this._escapeHtml(project.name || 'Sin nombre')}</h3>
            <p>${this._escapeHtml(project.shortDescription || project.description || '')}</p>
            ${technologies ? `
              <div class="project-tags" role="list" aria-label="Tecnologías utilizadas">
                ${technologies}
              </div>
            ` : ''}
            <a href="${projectUrl}" class="project-link" aria-label="Ver más detalles de ${this._escapeHtml(project.name || 'este proyecto')}" data-project-id="${projectId}">Ver más →</a>
          </div>
        </article>
      `;
    }).join('');

    // Agregar event listeners para los enlaces "Ver más"
    projectsGrid.querySelectorAll('.project-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = (link as HTMLElement).dataset.projectId;
        if (projectId) {
          this.showProjectDetail(projectId, activeProjects);
        }
      });
    });
  }

  /**
   * Muestra el detalle de un proyecto
   * 
   * @static
   * @param {string} projectId - ID del proyecto
   * @param {IProjectFirestoreData[]} projects - Array de todos los proyectos
   */
  static showProjectDetail(projectId: string, projects: IProjectFirestoreData[]): void {
    const project = projects.find(p => (p.id || `project-${Date.now()}`) === projectId);
    if (!project) return;

    // Crear o actualizar el modal de detalle
    let detailModal = document.getElementById('project-detail-modal');
    if (!detailModal) {
      detailModal = document.createElement('div');
      detailModal.id = 'project-detail-modal';
      detailModal.className = 'project-detail-modal';
      document.body.appendChild(detailModal);
    }

    const images = project.images || [];
    const allImages = project.mainImage ? [project.mainImage, ...images] : images;
    const carouselHTML = allImages.length > 0 ? this._generateImageCarousel(allImages, project.name || '') : '';
    
    const technologies = Array.isArray(project.technologies) && project.technologies.length > 0
      ? project.technologies.map(tech => `<span class="tag">${this._escapeHtml(tech)}</span>`).join('')
      : '';

    const features = Array.isArray(project.features) && project.features.length > 0
      ? project.features.map(feature => `<li>${this._escapeHtml(feature)}</li>`).join('')
      : '';

    detailModal.innerHTML = `
      <div class="project-detail-overlay"></div>
      <div class="project-detail-content">
        <button class="project-detail-close" aria-label="Cerrar detalle del proyecto">&times;</button>
        <div class="project-detail-header">
          <h2>${this._escapeHtml(project.name || 'Sin nombre')}</h2>
        </div>
        ${carouselHTML}
        <div class="project-detail-body">
          ${project.fullDescription || project.description ? `
            <div class="project-detail-section">
              <h3>Descripción</h3>
              <p>${this._escapeHtml(project.fullDescription || project.description || '')}</p>
            </div>
          ` : ''}
          ${technologies ? `
            <div class="project-detail-section">
              <h3>Tecnologías</h3>
              <div class="project-tags">${technologies}</div>
            </div>
          ` : ''}
          ${features ? `
            <div class="project-detail-section">
              <h3>Características</h3>
              <ul class="project-features">${features}</ul>
            </div>
          ` : ''}
          <div class="project-detail-links">
            ${project.repositoryUrl ? `
              <a href="${this._escapeHtml(project.repositoryUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                Ver Código
              </a>
            ` : ''}
            ${project.liveUrl ? `
              <a href="${this._escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                Ver Demo
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Mostrar modal
    detailModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Event listeners
    const closeBtn = detailModal.querySelector('.project-detail-close');
    const overlay = detailModal.querySelector('.project-detail-overlay');
    
    const closeModal = () => {
      detailModal!.style.display = 'none';
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Inicializar carrusel si hay imágenes
    if (allImages.length > 0) {
      this._initImageCarousel();
    }
  }

  /**
   * Genera el HTML del carrusel de imágenes
   * 
   * @private
   * @static
   * @param {string[]} images - Array de URLs de imágenes
   * @param {string} altText - Texto alternativo
   * @returns {string} HTML del carrusel
   */
  private static _generateImageCarousel(images: string[], altText: string): string {
    if (images.length === 0) return '';

    const slides = images.map((img, index) => `
      <div class="carousel-slide ${index === 0 ? 'active' : ''}">
        <img src="${this._escapeHtml(img)}" alt="${this._escapeHtml(altText)} - Imagen ${index + 1}" loading="lazy">
      </div>
    `).join('');

    const indicators = images.map((_, index) => `
      <button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Ir a imagen ${index + 1}"></button>
    `).join('');

    return `
      <div class="project-carousel">
        <div class="carousel-container">
          ${slides}
        </div>
        ${images.length > 1 ? `
          <button class="carousel-prev" aria-label="Imagen anterior">‹</button>
          <button class="carousel-next" aria-label="Imagen siguiente">›</button>
          <div class="carousel-indicators">
            ${indicators}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Inicializa el carrusel de imágenes
   * 
   * @private
   * @static
   */
  private static _initImageCarousel(): void {
    let currentSlide = 0;
    const slides = document.querySelectorAll<HTMLElement>('.carousel-slide');
    const indicators = document.querySelectorAll<HTMLElement>('.carousel-indicator');
    const prevBtn = document.querySelector<HTMLElement>('.carousel-prev');
    const nextBtn = document.querySelector<HTMLElement>('.carousel-next');

    const showSlide = (index: number) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });

    // Auto-play opcional (cada 5 segundos)
    setInterval(nextSlide, 5000);
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


