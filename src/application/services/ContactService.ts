/**
 * @fileoverview Servicio de aplicación para manejar el formulario de contacto
 * @module application/services/ContactService
 */

import { EVENTS } from '@shared/constants';
import { isValidEmail } from '@shared/utils';
import type { IContactFormData } from '@shared/types';

/**
 * Servicio para manejar el formulario de contacto
 * 
 * @class ContactService
 */
export class ContactService {
  private readonly _form: HTMLFormElement;
  private readonly _submitButton: HTMLButtonElement | null;
  private _isSubmitting: boolean = false;

  /**
   * Crea una instancia de ContactService
   * 
   * @param {HTMLFormElement} form - Formulario de contacto
   */
  constructor(form: HTMLFormElement) {
    this._form = form;
    this._submitButton = this._form.querySelector<HTMLButtonElement>('button[type="submit"]');
    this._init();
  }

  /**
   * Inicializa el servicio
   * 
   * @private
   */
  private _init(): void {
    if (this._form) {
      this._form.addEventListener(EVENTS.SUBMIT, (e: Event) => {
        this._handleSubmit(e);
      });

      // Validación en tiempo real
      this._setupRealTimeValidation();
    }
  }

  /**
   * Configura validación en tiempo real
   * 
   * @private
   */
  private _setupRealTimeValidation(): void {
    const inputs = this._form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this._validateField(input);
      });

      input.addEventListener('input', () => {
        this._clearFieldError(input);
      });
    });
  }

  /**
   * Valida un campo individual
   * 
   * @param {HTMLInputElement | HTMLTextAreaElement} field - Campo a validar
   * @private
   */
  private _validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remover errores previos
    this._clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Por favor, ingresa un email válido';
    } else if (field.id === 'contact-name' && value.length < 2) {
      isValid = false;
      errorMessage = 'El nombre debe tener al menos 2 caracteres';
    } else if (field.id === 'contact-message' && value.length < 10) {
      isValid = false;
      errorMessage = 'El mensaje debe tener al menos 10 caracteres';
    }

    if (!isValid) {
      this._showFieldError(field, errorMessage);
    }

    return isValid;
  }

  /**
   * Muestra error en un campo
   * 
   * @param {HTMLInputElement | HTMLTextAreaElement} field - Campo con error
   * @param {string} message - Mensaje de error
   * @private
   */
  private _showFieldError(field: HTMLInputElement | HTMLTextAreaElement, message: string): void {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    // Remover mensaje de error previo si existe
    const existingError = field.parentElement?.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Crear mensaje de error
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    field.parentElement?.appendChild(errorElement);
  }

  /**
   * Limpia el error de un campo
   * 
   * @param {HTMLInputElement | HTMLTextAreaElement} field - Campo a limpiar
   * @private
   */
  private _clearFieldError(field: HTMLInputElement | HTMLTextAreaElement): void {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    const errorElement = field.parentElement?.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Maneja el envío del formulario
   * 
   * @param {Event} event - Evento de submit
   * @private
   */
  private async _handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this._isSubmitting) {
      return;
    }

    const formData = this._getFormData();

    // Validar todos los campos
    const nameField = this._form.querySelector<HTMLInputElement>('#contact-name');
    const emailField = this._form.querySelector<HTMLInputElement>('#contact-email');
    const messageField = this._form.querySelector<HTMLTextAreaElement>('#contact-message');

    let isValid = true;

    if (nameField) {
      isValid = this._validateField(nameField) && isValid;
    }
    if (emailField) {
      isValid = this._validateField(emailField) && isValid;
    }
    if (messageField) {
      isValid = this._validateField(messageField) && isValid;
    }

    if (!isValid) {
      this._showMessage('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    if (this._validateFormData(formData)) {
      await this._submitForm(formData);
    }
  }

  /**
   * Obtiene los datos del formulario
   * 
   * @returns {IContactFormData} Datos del formulario
   * @private
   */
  private _getFormData(): IContactFormData {
    const formData = new FormData(this._form);
    return {
      name: (formData.get('name') as string) || '',
      email: (formData.get('email') as string) || '',
      message: (formData.get('message') as string) || ''
    };
  }

  /**
   * Valida los datos del formulario
   * 
   * @param {IContactFormData} formData - Datos a validar
   * @returns {boolean} True si los datos son válidos
   * @private
   */
  private _validateFormData(formData: IContactFormData): boolean {
    if (!formData.name || formData.name.trim().length < 2) {
      this._showMessage('El nombre debe tener al menos 2 caracteres', 'error');
      return false;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      this._showMessage('Por favor, ingresa un email válido', 'error');
      return false;
    }

    if (!formData.message || formData.message.trim().length < 10) {
      this._showMessage('El mensaje debe tener al menos 10 caracteres', 'error');
      return false;
    }

    return true;
  }

  /**
   * Envía el formulario guardándolo en Firestore
   * 
   * @param {IContactFormData} formData - Datos del formulario
   * @private
   */
  private async _submitForm(formData: IContactFormData): Promise<void> {
    this._isSubmitting = true;
    this._setLoadingState(true);

    try {
      // Importar el repositorio de mensajes
      const { ContactMessageRepository } = await import('@infrastructure/repositories/ContactMessageRepository');
      
      console.log('Guardando mensaje en Firestore...', formData);

      // Guardar el mensaje en Firestore
      const messageId = await ContactMessageRepository.createMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      });

      console.log('Mensaje guardado exitosamente con ID:', messageId);

      this._showMessage('¡Mensaje enviado exitosamente! Te responderé pronto.', 'success');
      this._form.reset();
      
      // Limpiar todos los errores
      const fields = this._form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
      fields.forEach(field => this._clearFieldError(field));

    } catch (error: unknown) {
      console.error('Error al enviar el formulario:', error);
      
      let errorMessage = 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctame directamente por email.';
      
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }

      this._showMessage(errorMessage, 'error');
    } finally {
      this._isSubmitting = false;
      this._setLoadingState(false);
    }
  }

  /**
   * Establece el estado de carga del formulario
   * 
   * @param {boolean} isLoading - Si está cargando
   * @private
   */
  private _setLoadingState(isLoading: boolean): void {
    if (this._submitButton) {
      this._submitButton.disabled = isLoading;
      if (isLoading) {
        this._submitButton.textContent = 'Enviando...';
        this._submitButton.style.opacity = '0.7';
        this._submitButton.style.cursor = 'not-allowed';
      } else {
        this._submitButton.textContent = 'Enviar Mensaje';
        this._submitButton.style.opacity = '1';
        this._submitButton.style.cursor = 'pointer';
      }
    }

    const inputs = this._form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
    inputs.forEach(input => {
      input.disabled = isLoading;
    });
  }

  /**
   * Muestra un mensaje al usuario
   * 
   * @param {string} message - Mensaje a mostrar
   * @param {'success' | 'error'} type - Tipo de mensaje
   * @private
   */
  private _showMessage(message: string, type: 'success' | 'error'): void {
    // Remover mensaje previo si existe
    const existingMessage = this._form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Crear mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.setAttribute('role', 'alert');
    messageElement.textContent = message;

    // Insertar antes del botón de envío
    if (this._submitButton && this._submitButton.parentElement) {
      this._submitButton.parentElement.insertBefore(messageElement, this._submitButton);
    } else {
      this._form.appendChild(messageElement);
    }

    // Scroll al mensaje
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Remover después de 5 segundos (solo si es éxito)
    if (type === 'success') {
      setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
          messageElement.remove();
        }, 300);
      }, 5000);
    }
  }
}


