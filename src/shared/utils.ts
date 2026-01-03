/**
 * @fileoverview Utilidades compartidas
 * @module shared/utils
 */

/**
 * Debounce function para optimizar eventos frecuentes
 * 
 * @template T - Tipo de la función
 * @param {T} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {(...args: Parameters<T>) => void} Función con debounce aplicado
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = 300
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>): void {
    const later = (): void => {
      if (timeout) clearTimeout(timeout);
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function para limitar la frecuencia de ejecución
 * 
 * @template T - Tipo de la función
 * @param {T} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {(...args: Parameters<T>) => void} Función con throttle aplicado
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number = 300
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Verifica si un elemento está visible en el viewport
 * 
 * @param {Element | null} element - Elemento a verificar
 * @param {number} threshold - Porcentaje de visibilidad requerido
 * @returns {boolean} True si el elemento es visible
 */
export const isElementInViewport = (
  element: Element | null,
  threshold: number = 0
): boolean => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
};

/**
 * Obtiene el hash de la URL sin el símbolo #
 * 
 * @param {string} hash - Hash de la URL
 * @returns {string} Hash sin el símbolo #
 */
export const getHashFromUrl = (hash: string): string => {
  return hash.replace('#', '');
};

/**
 * Valida un email
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitiza texto para prevenir XSS
 * 
 * @param {string} text - Texto a sanitizar
 * @returns {string} Texto sanitizado
 */
export const sanitizeText = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

