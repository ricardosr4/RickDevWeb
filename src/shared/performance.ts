/**
 * @fileoverview Utilidades para optimización de performance
 * @module shared/performance
 */

/**
 * Carga diferida de imágenes
 * 
 * @param {HTMLImageElement} img - Elemento de imagen
 */
export const lazyLoadImage = (img: HTMLImageElement): void => {
  if ('loading' in HTMLImageElement.prototype) {
    img.loading = 'lazy';
  } else {
    // Fallback para navegadores que no soportan loading="lazy"
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
          }
          observer.unobserve(image);
        }
      });
    });

    if (img.dataset.src) {
      imageObserver.observe(img);
    }
  }
};

/**
 * Preconecta a un dominio para mejorar performance
 * 
 * @param {string} url - URL a preconectar
 */
export const preconnect = (url: string): void => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Prefetch de recursos
 * 
 * @param {string} url - URL a prefetch
 * @param {string} as - Tipo de recurso (script, style, etc.)
 */
export const prefetch = (url: string, as: string = 'script'): void => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
};

/**
 * Carga dinámica de módulos (code splitting)
 * 
 * @param {string} modulePath - Ruta del módulo
 * @returns {Promise<unknown>} Módulo cargado
 */
export const loadModule = async (modulePath: string): Promise<unknown> => {
  try {
    const module = await import(modulePath);
    return module;
  } catch (error) {
    console.error(`Error al cargar módulo ${modulePath}:`, error);
    throw error;
  }
};

/**
 * Optimiza el rendimiento de scroll usando requestAnimationFrame
 * 
 * @template T - Tipo de la función callback
 * @param {T} callback - Función a ejecutar
 * @returns {(...args: Parameters<T>) => void} Función optimizada
 */
export const optimizeScroll = <T extends (...args: unknown[]) => unknown>(
  callback: T
): ((...args: Parameters<T>) => void) => {
  let ticking: boolean = false;
  
  return function(...args: Parameters<T>): void {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

