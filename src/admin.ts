/**
 * @fileoverview Panel de Administración
 * @module admin
 */

import './styles/admin.css';
import { FirebaseService } from '@infrastructure/FirebaseService';
import { AuthService } from '@infrastructure/AuthService';
import { ProfileRepository } from '@infrastructure/repositories/ProfileRepository';
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { ContactMessageRepository } from '@infrastructure/repositories/ContactMessageRepository';
import { StorageService } from '@infrastructure/services/StorageService';
import { Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { 
  IProfileData, 
  IExperienceFirestoreData, 
  IEducationFirestoreData, 
  ISkillsFirestoreData,
  IProjectFirestoreData 
} from '@infrastructure/types/firestore.types';

/**
 * Panel de administración
 * 
 * @class AdminPanel
 */
class AdminPanel {
  private editingExperienceId: string | null = null;
  private editingEducationId: string | null = null;
  private editingProjectId: string | null = null;
  private projectImageIndex: number = 0;
  private deletedProjectIds: Set<string> = new Set(); // Registro de proyectos eliminados en esta sesión

  /**
   * Crea una instancia de AdminPanel
   */
  constructor() {
    this.editingExperienceId = null;
    this.editingEducationId = null;
    this.editingProjectId = null;
    this.projectImageIndex = 0;
    this.loadDeletedProjectIds(); // Cargar proyectos eliminados desde localStorage
  }

  /**
   * Carga los IDs de proyectos eliminados desde localStorage
   */
  private loadDeletedProjectIds(): void {
    try {
      const stored = localStorage.getItem('deletedProjectIds');
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        ids.forEach(id => this.deletedProjectIds.add(id));
        console.log(`Cargados ${ids.length} proyectos eliminados desde localStorage`);
      }
    } catch (error) {
      console.warn('Error al cargar proyectos eliminados desde localStorage:', error);
    }
  }
  
  /**
   * Guarda los IDs de proyectos eliminados en localStorage
   */
  private saveDeletedProjectIds(): void {
    try {
      const ids = Array.from(this.deletedProjectIds);
      localStorage.setItem('deletedProjectIds', JSON.stringify(ids));
    } catch (error) {
      console.warn('Error al guardar proyectos eliminados en localStorage:', error);
    }
  }
  
  /**
   * Limpia los IDs de proyectos eliminados de localStorage (después de verificar que realmente fueron eliminados)
   */
  private async cleanupDeletedProjectIds(): Promise<void> {
    const idsToRemove: string[] = [];
    for (const id of this.deletedProjectIds) {
      try {
        const project = await ProjectRepository.getProjectById(id);
        if (!project) {
          // El proyecto realmente fue eliminado, podemos removerlo del registro
          idsToRemove.push(id);
        }
      } catch (error) {
        // Si hay error, mantener el ID en el registro por seguridad
        console.warn(`Error al verificar proyecto ${id} para limpieza:`, error);
      }
    }
    
    idsToRemove.forEach(id => this.deletedProjectIds.delete(id));
    if (idsToRemove.length > 0) {
      this.saveDeletedProjectIds();
      console.log(`Limpiados ${idsToRemove.length} IDs de proyectos realmente eliminados del registro`);
    }
  }

  /**
   * Inicializa el panel de administración
   * 
   * @returns {Promise<void>}
   */
  async init(): Promise<void> {
    try {
      console.log('Inicializando panel de administración...');
      FirebaseService.initialize();
      console.log('Firebase inicializado');
      
      // Verificar autenticación
      AuthService.onAuthStateChange((user: User | null) => {
        console.log('Estado de autenticación cambió:', user ? 'Usuario autenticado' : 'Usuario no autenticado');
        if (user) {
          console.log('Usuario:', user.email);
          this.showDashboard(user);
        } else {
          this.showLogin();
        }
      });

      // Verificar estado inicial
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        console.log('Usuario ya autenticado:', currentUser.email);
        this.showDashboard(currentUser);
      } else {
        console.log('No hay usuario autenticado, mostrando login');
        this.showLogin();
      }

      // Event listeners
      this.setupEventListeners();
      console.log('Panel de administración inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar panel de administración:', error);
      const errorDiv = document.getElementById('login-error');
      if (errorDiv) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errorDiv.textContent = 'Error al inicializar: ' + errorMessage;
        errorDiv.style.display = 'block';
      }
    }
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners(): void {
    // Login form
    const loginForm = document.getElementById('login-form') as HTMLFormElement | null;
    if (loginForm) {
      loginForm.addEventListener('submit', (e: Event) => this.handleLogin(e as SubmitEvent));
    }

    // Password toggle
    const passwordToggle = document.getElementById('password-toggle');
    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
    }

    // Load saved credentials
    this.loadSavedCredentials();

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Navigation
    document.querySelectorAll<HTMLElement>('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        const section = target.dataset.section;
        if (section) {
          this.switchSection(section);
        }
      });
    });

    // Profile form
    const saveProfileBtn = document.getElementById('save-profile-btn');
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener('click', () => this.saveProfile());
    }

    // Image upload handlers
    this.setupImageUploadHandlers();

    // Experiences
    const addExperienceBtn = document.getElementById('add-experience-btn');
    if (addExperienceBtn) {
      addExperienceBtn.addEventListener('click', () => this.openExperienceModal());
    }

    const experienceForm = document.getElementById('experience-form') as HTMLFormElement | null;
    if (experienceForm) {
      experienceForm.addEventListener('submit', (e: Event) => this.saveExperience(e as SubmitEvent));
    }

    // Education
    const addEducationBtn = document.getElementById('add-education-btn');
    if (addEducationBtn) {
      addEducationBtn.addEventListener('click', () => this.openEducationModal());
    }

    const educationForm = document.getElementById('education-form') as HTMLFormElement | null;
    if (educationForm) {
      educationForm.addEventListener('submit', (e: Event) => this.saveEducation(e as SubmitEvent));
    }

    // Skills
    const saveSkillsBtn = document.getElementById('save-skills-btn');
    if (saveSkillsBtn) {
      saveSkillsBtn.addEventListener('click', () => this.saveSkills());
    }

    // Projects
    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
      addProjectBtn.addEventListener('click', () => this.openProjectModal());
    }

    const projectForm = document.getElementById('project-form') as HTMLFormElement | null;
    if (projectForm) {
      projectForm.addEventListener('submit', (e: Event) => this.saveProject(e as SubmitEvent));
    }

    // Project image upload handlers
    this.setupProjectImageUploadHandlers();

    // Messages
    const refreshMessagesBtn = document.getElementById('refresh-messages-btn');
    if (refreshMessagesBtn) {
      refreshMessagesBtn.addEventListener('click', () => this.loadMessages());
    }

    // Modal close buttons
    document.querySelectorAll<HTMLElement>('.modal-close, [data-modal]').forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        const modalId = target.dataset.modal || target.closest('[data-modal]')?.getAttribute('data-modal') || null;
        if (modalId) {
          this.closeModal(modalId);
        }
      });
    });

    // Close modal on background click
    document.querySelectorAll<HTMLElement>('.modal').forEach(modal => {
      modal.addEventListener('click', (e: Event) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  /**
   * Muestra la pantalla de login
   */
  showLogin(): void {
    const loginScreen = document.getElementById('login-screen');
    const adminDashboard = document.getElementById('admin-dashboard');
    if (loginScreen) loginScreen.style.display = 'flex';
    if (adminDashboard) adminDashboard.style.display = 'none';
  }

  /**
   * Muestra el dashboard
   * 
   * @param {User} user - Usuario autenticado
   */
  showDashboard(user: User): void {
    const loginScreen = document.getElementById('login-screen');
    const adminDashboard = document.getElementById('admin-dashboard');
    const userEmail = document.getElementById('user-email');
    
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'flex';
    if (userEmail) userEmail.textContent = user.email || '';
    
    this.loadAllData();
    this.updateMessagesBadge();
  }

  /**
   * Actualiza el badge de mensajes no leídos
   */
  async updateMessagesBadge(): Promise<void> {
    try {
      const unreadCount = await ContactMessageRepository.getUnreadCount();
      const badge = document.getElementById('messages-badge');
      if (badge) {
        if (unreadCount > 0) {
          badge.textContent = String(unreadCount);
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('Error al actualizar badge de mensajes:', error);
    }
  }

  /**
   * Carga y muestra los mensajes de contacto
   */
  async loadMessages(): Promise<void> {
    const messagesList = document.getElementById('messages-list');
    const messageDiv = document.getElementById('messages-message');
    const refreshBtn = document.getElementById('refresh-messages-btn') as HTMLButtonElement | null;

    if (!messagesList) return;

    try {
      // Mostrar loading
      messagesList.innerHTML = '<div class="loading-messages" style="text-align: center; padding: 2rem; color: var(--admin-text-secondary);">Cargando mensajes...</div>';
      
      if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.textContent = 'Cargando...';
      }

      // Obtener mensajes
      const messages = await ContactMessageRepository.getAllMessages(100);

      if (messages.length === 0) {
        messagesList.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--admin-text-secondary);"><p>No hay mensajes todavía.</p></div>';
        if (refreshBtn) {
          refreshBtn.disabled = false;
          refreshBtn.textContent = '🔄 Actualizar';
        }
        return;
      }

      // Renderizar mensajes
      messagesList.innerHTML = messages.map((msg: { id?: string; name: string; email: string; message: string; read?: boolean; createdAt?: Timestamp }) => {
        const date = msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleString('es-ES') : 'Fecha no disponible';
        const isRead = msg.read ? 'read' : 'unread';
        const readBadge = msg.read ? '' : '<span class="unread-badge">Nuevo</span>';
        
        return `
          <div class="message-card ${isRead}" data-message-id="${msg.id}">
            <div class="message-header">
              <div class="message-sender">
                <strong>${this._escapeHtml(msg.name)}</strong>
                ${readBadge}
              </div>
              <div class="message-actions">
                <a href="mailto:${this._escapeHtml(msg.email)}" class="btn-icon" title="Responder">📧</a>
                ${!msg.read ? `<button class="btn-icon mark-read-btn" data-id="${msg.id}" title="Marcar como leído">✓</button>` : ''}
                <button class="btn-icon delete-message-btn" data-id="${msg.id}" title="Eliminar">🗑️</button>
              </div>
            </div>
            <div class="message-email">
              <a href="mailto:${this._escapeHtml(msg.email)}">${this._escapeHtml(msg.email)}</a>
            </div>
            <div class="message-date">${date}</div>
            <div class="message-content">${this._escapeHtml(msg.message).replace(/\n/g, '<br>')}</div>
          </div>
        `;
      }).join('');

      // Event listeners para acciones
      messagesList.querySelectorAll('.mark-read-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const messageId = (e.target as HTMLElement).dataset.id;
          if (messageId) {
            await this.markMessageAsRead(messageId);
          }
        });
      });

      messagesList.querySelectorAll('.delete-message-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const messageId = (e.target as HTMLElement).dataset.id;
          if (messageId) {
            await this.deleteMessage(messageId);
          }
        });
      });

      // Actualizar badge
      await this.updateMessagesBadge();

      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.textContent = '🔄 Actualizar';
      }

    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      messagesList.innerHTML = `<div style="text-align: center; padding: 2rem; color: #ef4444;"><p>Error al cargar mensajes: ${errorMessage}</p></div>`;
      
      if (messageDiv) {
        this.showMessage('messages-message', `Error al cargar mensajes: ${errorMessage}`, 'error');
      }

      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.textContent = '🔄 Actualizar';
      }
    }
  }

  /**
   * Marca un mensaje como leído
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await ContactMessageRepository.markAsRead(messageId);
      await this.loadMessages();
      await this.updateMessagesBadge();
      this.showMessage('messages-message', 'Mensaje marcado como leído', 'success');
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.showMessage('messages-message', `Error: ${errorMessage}`, 'error');
    }
  }

  /**
   * Elimina un mensaje
   */
  async deleteMessage(messageId: string): Promise<void> {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    try {
      await ContactMessageRepository.deleteMessage(messageId);
      await this.loadMessages();
      await this.updateMessagesBadge();
      this.showMessage('messages-message', 'Mensaje eliminado', 'success');
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.showMessage('messages-message', `Error: ${errorMessage}`, 'error');
    }
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const toggleIcon = document.getElementById('password-toggle-icon');
    
    if (passwordInput && toggleIcon) {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
        toggleIcon.setAttribute('aria-label', 'Ocultar contraseña');
      } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
        toggleIcon.setAttribute('aria-label', 'Mostrar contraseña');
      }
    }
  }

  /**
   * Guarda las credenciales en localStorage
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  saveCredentials(email: string, password: string): void {
    const rememberMe = document.getElementById('remember-me') as HTMLInputElement | null;
    if (rememberMe && rememberMe.checked) {
      localStorage.setItem('savedEmail', email);
      localStorage.setItem('savedPassword', password);
    } else {
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedPassword');
    }
  }

  /**
   * Carga las credenciales guardadas
   */
  loadSavedCredentials(): void {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    const rememberMe = document.getElementById('remember-me') as HTMLInputElement | null;
    
    if (savedEmail && savedPassword) {
      const emailInput = document.getElementById('email') as HTMLInputElement | null;
      const passwordInput = document.getElementById('password') as HTMLInputElement | null;
      
      if (emailInput) emailInput.value = savedEmail;
      if (passwordInput) passwordInput.value = savedPassword;
      if (rememberMe) rememberMe.checked = true;
    }
  }

  /**
   * Maneja el login
   * 
   * @param {SubmitEvent} e - Evento de submit
   */
  async handleLogin(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value.trim();
    const password = (form.password as HTMLInputElement).value;
    const errorDiv = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit-btn') as HTMLButtonElement | null;
    const btnText = document.getElementById('login-btn-text');
    const btnLoading = document.getElementById('login-btn-loading');

    // Validación básica
    if (!email || !password) {
      if (errorDiv) {
        errorDiv.textContent = 'Por favor completa todos los campos';
        errorDiv.style.display = 'block';
      }
      return;
    }

    try {
      if (errorDiv) errorDiv.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.style.opacity = '0.7';
      }
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';

      console.log('Intentando iniciar sesión con:', email);
      
      // Intentar login
      try {
        await AuthService.login(email, password);
        console.log('Login exitoso');
        // Guardar credenciales si está marcado "recordar"
        this.saveCredentials(email, password);
      } catch (loginError) {
        console.log('Error en login:', loginError);
        const errorMessage = loginError instanceof Error ? loginError.message : 'Unknown error';
        
        // Si el usuario no existe, intentar crearlo
        if (errorMessage.includes('no encontrado') || errorMessage.includes('user-not-found')) {
          console.log('Usuario no encontrado, intentando crear cuenta...');
          try {
            await AuthService.register(email, password);
            console.log('Usuario creado exitosamente');
            // El onAuthStateChange se encargará de mostrar el dashboard
            return;
          } catch (registerError) {
            console.error('Error al crear usuario:', registerError);
            const registerErrorMessage = registerError instanceof Error ? registerError.message : 'Unknown error';
            throw new Error(registerErrorMessage || 'No se pudo crear el usuario. Verifica que Firebase Authentication esté habilitado.');
          }
        } else {
          throw loginError;
        }
      }
    } catch (error) {
      console.error('Error completo:', error);
      if (errorDiv) {
        const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión. Verifica tu email y contraseña.';
        errorDiv.textContent = errorMessage;
        errorDiv.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.cursor = 'pointer';
        submitBtn.style.opacity = '1';
      }
      if (btnText) btnText.style.display = 'inline';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  }

  /**
   * Maneja el logout
   */
  async handleLogout(): Promise<void> {
    try {
      await AuthService.logout();
      this.showLogin();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión');
    }
  }

  /**
   * Cambia de sección
   * 
   * @param {string} section - Nombre de la sección
   */
  switchSection(section: string): void {
    
    // Update nav buttons
    document.querySelectorAll<HTMLElement>('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.section === section) {
        btn.classList.add('active');
      }
    });

    // Update sections
    document.querySelectorAll<HTMLElement>('.admin-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const targetSection = document.getElementById(`section-${section}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Load data if needed
    if (section === 'experiences') {
      this.loadExperiences();
    } else if (section === 'education') {
      this.loadEducation();
    } else if (section === 'projects') {
      this.loadProjects();
    } else if (section === 'messages') {
      this.loadMessages();
    }
  }

  /**
   * Carga todos los datos
   */
  async loadAllData(): Promise<void> {
    try {
      await Promise.all([
        this.loadProfile(),
        this.loadSkills(),
        this.loadExperiences(),
        this.loadEducation(),
        this.loadProjects()
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  /**
   * Carga el perfil
   */
  async loadProfile(): Promise<void> {
    try {
      const profile = await ProfileRepository.getProfile();
      if (profile) {
        this.populateProfileForm(profile);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      this.showMessage('profile-message', 'Error al cargar el perfil', 'error');
    }
  }

  /**
   * Pobla el formulario de perfil
   * 
   * @param {IProfileData} profile - Datos del perfil
   */
  populateProfileForm(profile: IProfileData): void {
    const firstNameInput = document.getElementById('profile-firstName') as HTMLInputElement | null;
    const lastNameInput = document.getElementById('profile-lastName') as HTMLInputElement | null;
    const titleInput = document.getElementById('profile-title') as HTMLInputElement | null;
    const bioInput = document.getElementById('profile-bio') as HTMLTextAreaElement | null;
    const emailInput = document.getElementById('profile-email') as HTMLInputElement | null;
    const phoneInput = document.getElementById('profile-phone') as HTMLInputElement | null;
    const locationInput = document.getElementById('profile-location') as HTMLInputElement | null;
    const websiteInput = document.getElementById('profile-website') as HTMLInputElement | null;
    const bannerImageUrlInput = document.getElementById('profile-bannerImage-url') as HTMLInputElement | null;
    const profileImageUrlInput = document.getElementById('profile-profileImage-url') as HTMLInputElement | null;
    const linkedinInput = document.getElementById('profile-linkedin') as HTMLInputElement | null;
    const githubInput = document.getElementById('profile-github') as HTMLInputElement | null;

    if (firstNameInput) firstNameInput.value = profile.firstName || '';
    if (lastNameInput) lastNameInput.value = profile.lastName || '';
    if (titleInput) titleInput.value = profile.title || '';
    if (bioInput) bioInput.value = profile.bio || '';
    if (emailInput) emailInput.value = profile.email || '';
    if (phoneInput) phoneInput.value = profile.phone || '';
    if (locationInput) locationInput.value = profile.location || '';
    if (websiteInput) websiteInput.value = profile.website || '';
    if (bannerImageUrlInput) bannerImageUrlInput.value = profile.bannerImage || '';
    if (profileImageUrlInput) profileImageUrlInput.value = profile.profileImage || '';
    if (linkedinInput) linkedinInput.value = profile.social?.linkedin || '';
    if (githubInput) githubInput.value = profile.social?.github || '';

    // Mostrar imágenes actuales si existen
    this.displayCurrentImages(profile.bannerImage, profile.profileImage);
  }

  /**
   * Guarda el perfil
   */
  async saveProfile(): Promise<void> {
    const saveBtn = document.getElementById('save-profile-btn') as HTMLButtonElement | null;
    const originalText = saveBtn?.textContent || 'Guardar Cambios';
    
    try {
      // Deshabilitar botón y mostrar loading
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Guardando...';
        saveBtn.style.opacity = '0.7';
        saveBtn.style.cursor = 'not-allowed';
      }

      const form = document.getElementById('profile-form') as HTMLFormElement | null;
      if (!form) {
        throw new Error('No se encontró el formulario');
      }
      
      const formData = new FormData(form);
      
      // Obtener URLs de imágenes (pueden venir de subida o de inputs ocultos)
      const bannerImageUrlInput = document.getElementById('profile-bannerImage-url') as HTMLInputElement | null;
      const profileImageUrlInput = document.getElementById('profile-profileImage-url') as HTMLInputElement | null;

      const profileData: IProfileData = {
        firstName: (formData.get('firstName') as string) || '',
        lastName: (formData.get('lastName') as string) || '',
        fullName: `${formData.get('firstName')} ${formData.get('lastName')}`,
        title: (formData.get('title') as string) || '',
        bio: (formData.get('bio') as string) || '',
        email: (formData.get('email') as string) || '',
        phone: (formData.get('phone') as string) || '',
        location: (formData.get('location') as string) || '',
        website: (formData.get('website') as string) || '',
        bannerImage: bannerImageUrlInput?.value || '',
        profileImage: profileImageUrlInput?.value || '',
        social: {
          linkedin: (formData.get('linkedin') as string) || '',
          github: (formData.get('github') as string) || ''
        }
      };

      console.log('Guardando perfil...', profileData);
      await ProfileRepository.updateProfile(profileData);
      
      // Mostrar mensaje de éxito
      this.showMessage('profile-message', '✅ Perfil actualizado correctamente', 'success');
      
      // Restaurar botón
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
        saveBtn.style.opacity = '1';
        saveBtn.style.cursor = 'pointer';
      }
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Mostrar mensaje de error detallado
      this.showMessage('profile-message', `❌ Error al guardar el perfil: ${errorMessage}`, 'error');
      
      // Restaurar botón
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
        saveBtn.style.opacity = '1';
        saveBtn.style.cursor = 'pointer';
      }
    }
  }

  /**
   * Carga las experiencias
   */
  async loadExperiences(): Promise<void> {
    try {
      console.log('Cargando experiencias...');
      const experiences = await ExperienceRepository.getAllExperiences();
      console.log(`Experiencias cargadas: ${experiences.length}`, experiences);
      this.renderExperiences(experiences);
    } catch (error) {
      console.error('Error al cargar experiencias:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showMessage('experience-message', `Error al cargar experiencias: ${errorMessage}`, 'error');
    }
  }

  /**
   * Renderiza las experiencias
   * 
   * @param {IExperienceFirestoreData[]} experiences - Array de experiencias
   */
  renderExperiences(experiences: IExperienceFirestoreData[]): void {
    const container = document.getElementById('experiences-list');
    if (!container) return;

    if (experiences.length === 0) {
      container.innerHTML = '<p style="color: var(--admin-text-light);">No hay experiencias agregadas</p>';
      return;
    }

    // Ordenar por order descendente para mostrar las más recientes primero
    const sortedExperiences = [...experiences].sort((a, b) => (b.order || 0) - (a.order || 0));

    container.innerHTML = sortedExperiences.map((exp) => {
      const startDate = exp.startDate && typeof exp.startDate.toDate === 'function' 
        ? exp.startDate.toDate().toISOString().split('T')[0] 
        : '';
      const endDate = exp.endDate && typeof exp.endDate.toDate === 'function' 
        ? exp.endDate.toDate().toISOString().split('T')[0] 
        : '';
      const period = exp.period || `${startDate} - ${endDate || 'Presente'}`;
      
      const responsibilities = Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0
        ? exp.responsibilities.map(r => `<li>${this._escapeHtml(r)}</li>`).join('')
        : '';
      
      const technologies = Array.isArray(exp.technologies) && exp.technologies.length > 0
        ? exp.technologies.map(tech => `<span class="tech-tag">${this._escapeHtml(tech)}</span>`).join('')
        : '';
      
      return `
        <div class="experience-card-modern" data-id="${exp.id}">
          <div class="experience-card-header">
            <div class="experience-card-main-info">
              <div class="experience-card-title-row">
                <h3 class="experience-card-title">${this._escapeHtml(exp.position || 'Sin cargo')}</h3>
                <span class="experience-badge ${exp.isActive ? 'active' : 'inactive'}">
                  ${exp.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <p class="experience-card-company">
                <span class="company-icon">🏢</span>
                ${this._escapeHtml(exp.company || '')}
                ${exp.location ? ` <span class="location-separator">•</span> <span class="location-text">${this._escapeHtml(exp.location)}</span>` : ''}
              </p>
              <p class="experience-card-period">
                <span class="period-icon">📅</span>
                ${this._escapeHtml(period)}
              </p>
            </div>
          </div>
          
          <div class="experience-card-body">
            ${exp.description ? `
              <div class="experience-card-section">
                <h4 class="section-label">Descripción</h4>
                <p class="section-content">${this._escapeHtml(exp.description)}</p>
              </div>
            ` : ''}
            
            ${responsibilities ? `
              <div class="experience-card-section">
                <h4 class="section-label">Responsabilidades</h4>
                <ul class="experience-responsibilities-list">
                  ${responsibilities}
                </ul>
              </div>
            ` : ''}
            
            ${technologies ? `
              <div class="experience-card-section">
                <h4 class="section-label">Tecnologías</h4>
                <div class="technologies-container">
                  ${technologies}
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="experience-card-actions">
            <button class="btn btn-primary" data-action="edit" data-id="${exp.id}">
              ✏️ Editar
            </button>
            <button class="btn btn-danger" data-action="delete" data-id="${exp.id}">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Agregar event listeners para los botones
    container.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).dataset.id;
        if (id) {
          this.editExperience(id);
        }
      });
    });

    container.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).dataset.id;
        if (id) {
          this.deleteExperience(id);
        }
      });
    });
  }


  /**
   * Escapa HTML para prevenir XSS
   * 
   * @private
   * @param {string | null | undefined} text - Texto a escapar
   * @returns {string} Texto escapado
   */
  private _escapeHtml(text: string | null | undefined): string {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Abre el modal de experiencia
   * 
   * @param {string | null} experienceId - ID de la experiencia a editar o null para nueva
   */
  openExperienceModal(experienceId: string | null = null): void {
    this.editingExperienceId = experienceId;
    const modal = document.getElementById('experience-modal');
    const form = document.getElementById('experience-form') as HTMLFormElement | null;
    const title = document.getElementById('experience-modal-title');

    if (modal && form && title) {
      if (experienceId) {
        title.textContent = 'Editar Experiencia';
        this.loadExperienceData(experienceId);
      } else {
        title.textContent = 'Nueva Experiencia';
        form.reset();
        const isActiveCheckbox = document.getElementById('experience-isActive') as HTMLInputElement | null;
        if (isActiveCheckbox) isActiveCheckbox.checked = true;
      }

      modal.style.display = 'flex';
    }
  }

  /**
   * Carga los datos de una experiencia
   * 
   * @param {string} id - ID de la experiencia
   */
  async loadExperienceData(id: string): Promise<void> {
    try {
      const experience = await ExperienceRepository.getExperienceById(id);
      if (experience) {
        const idInput = document.getElementById('experience-id') as HTMLInputElement | null;
        const positionInput = document.getElementById('experience-position') as HTMLInputElement | null;
        const companyInput = document.getElementById('experience-company') as HTMLInputElement | null;
        const locationInput = document.getElementById('experience-location') as HTMLInputElement | null;
        const startDateInput = document.getElementById('experience-startDate') as HTMLInputElement | null;
        const endDateInput = document.getElementById('experience-endDate') as HTMLInputElement | null;
        const descriptionInput = document.getElementById('experience-description') as HTMLTextAreaElement | null;
        const responsibilitiesInput = document.getElementById('experience-responsibilities') as HTMLTextAreaElement | null;
        const technologiesInput = document.getElementById('experience-technologies') as HTMLInputElement | null;
        const orderInput = document.getElementById('experience-order') as HTMLInputElement | null;
        const isActiveCheckbox = document.getElementById('experience-isActive') as HTMLInputElement | null;

        if (idInput) idInput.value = experience.id || '';
        if (positionInput) positionInput.value = experience.position || '';
        if (companyInput) companyInput.value = experience.company || '';
        if (locationInput) locationInput.value = experience.location || '';
        
        if (startDateInput && experience.startDate && typeof experience.startDate.toDate === 'function') {
          const date = experience.startDate.toDate().toISOString().split('T')[0];
          startDateInput.value = date || '';
        }
        if (endDateInput && experience.endDate && typeof experience.endDate.toDate === 'function') {
          const date = experience.endDate.toDate().toISOString().split('T')[0];
          endDateInput.value = date || '';
        }
        
        if (descriptionInput) descriptionInput.value = experience.description || '';
        if (responsibilitiesInput) {
          responsibilitiesInput.value = Array.isArray(experience.responsibilities) 
            ? experience.responsibilities.join('\n') 
            : '';
        }
        if (technologiesInput) {
          technologiesInput.value = Array.isArray(experience.technologies)
            ? experience.technologies.join(', ')
            : '';
        }
        if (orderInput) orderInput.value = String(experience.order || 0);
        if (isActiveCheckbox) isActiveCheckbox.checked = experience.isActive !== false;
      }
    } catch (error) {
      console.error('Error al cargar experiencia:', error);
      this.showMessage('experience-message', 'Error al cargar la experiencia', 'error');
    }
  }

  /**
   * Guarda una experiencia
   * 
   * @param {SubmitEvent} e - Evento de submit
   */
  async saveExperience(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const id = (formData.get('id') as string) || `exp_${Date.now()}`;

      const startDate = formData.get('startDate') as string;
      const endDate = formData.get('endDate') as string;
      const responsibilities = (formData.get('responsibilities') as string)
        .split('\n')
        .filter(r => r.trim())
        .map(r => r.trim());
      const technologies = (formData.get('technologies') as string)
        .split(',')
        .filter(t => t.trim())
        .map(t => t.trim());

      const experienceData: Partial<IExperienceFirestoreData> = {
        id,
        position: (formData.get('position') as string) || '',
        company: (formData.get('company') as string) || '',
        location: (formData.get('location') as string) || '',
        startDate: startDate ? Timestamp.fromDate(new Date(startDate)) : undefined,
        endDate: endDate ? Timestamp.fromDate(new Date(endDate)) : null,
        isCurrent: !endDate,
        period: endDate 
          ? `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`
          : `${this.formatDate(startDate)} - Presente`,
        description: (formData.get('description') as string) || '',
        responsibilities,
        technologies,
        order: parseInt((formData.get('order') as string) || '0') || 0,
        isActive: (formData.get('isActive') as string) === 'on'
      };

      if (this.editingExperienceId) {
        await ExperienceRepository.updateExperience(this.editingExperienceId, experienceData);
      } else {
        await ExperienceRepository.createExperience(experienceData as IExperienceFirestoreData);
      }

      this.closeModal('experience-modal');
      // Recargar experiencias inmediatamente
      await this.loadExperiences();
      this.showMessage(
        'experience-message', 
        this.editingExperienceId ? 'Experiencia actualizada correctamente' : 'Experiencia creada correctamente', 
        'success'
      );
    } catch (error) {
      console.error('Error al guardar experiencia:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showMessage('experience-message', `Error al guardar: ${errorMessage}`, 'error');
    }
  }

  /**
   * Edita una experiencia
   * 
   * @param {string} id - ID de la experiencia
   */
  async editExperience(id: string): Promise<void> {
    this.openExperienceModal(id);
  }

  /**
   * Elimina una experiencia
   * 
   * @param {string} id - ID de la experiencia
   */
  async deleteExperience(id: string): Promise<void> {
    if (!confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
      return;
    }

    try {
      await ExperienceRepository.deleteExperience(id);
      await this.loadExperiences();
      this.showMessage('experience-message', 'Experiencia eliminada correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar experiencia:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showMessage('experience-message', `Error al eliminar la experiencia: ${errorMessage}`, 'error');
    }
  }

  /**
   * Carga las educaciones
   */
  async loadEducation(): Promise<void> {
    try {
      const educations = await EducationRepository.getAllEducations();
      this.renderEducation(educations);
    } catch (error) {
      console.error('Error al cargar educación:', error);
    }
  }

  /**
   * Renderiza las educaciones
   * 
   * @param {IEducationFirestoreData[]} educations - Array de educaciones
   */
  renderEducation(educations: IEducationFirestoreData[]): void {
    const container = document.getElementById('education-list');
    if (!container) return;

    if (educations.length === 0) {
      container.innerHTML = '<p style="color: var(--admin-text-light);">No hay educación agregada</p>';
      return;
    }

    container.innerHTML = educations.map(edu => {
      const startDate = edu.startDate && typeof edu.startDate.toDate === 'function' 
        ? edu.startDate.toDate().toISOString().split('T')[0] 
        : '';
      const endDate = edu.endDate && typeof edu.endDate.toDate === 'function' 
        ? edu.endDate.toDate().toISOString().split('T')[0] 
        : '';
      const period = edu.period || `${startDate} - ${endDate || 'Presente'}`;
      
      return `
        <div class="item-card">
          <div class="item-content">
            <h3 class="item-title">${this._escapeHtml(edu.degree || 'Sin título')}</h3>
            <p class="item-subtitle">${this._escapeHtml(edu.institution || '')} - ${this._escapeHtml(edu.field || '')}</p>
            <p class="item-subtitle">${this._escapeHtml(period)}</p>
            ${edu.description ? `<p class="item-description">${this._escapeHtml(edu.description)}</p>` : ''}
            <span class="item-badge ${edu.isActive ? 'active' : 'inactive'}">
              ${edu.isActive ? 'Activa' : 'Inactiva'}
            </span>
          </div>
          <div class="item-actions">
            <button class="btn btn-primary" onclick="adminPanel.editEducation('${edu.id}')">Editar</button>
            <button class="btn btn-danger" onclick="adminPanel.deleteEducation('${edu.id}')">Eliminar</button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Abre el modal de educación
   * 
   * @param {string | null} educationId - ID de la educación a editar o null para nueva
   */
  openEducationModal(educationId: string | null = null): void {
    this.editingEducationId = educationId;
    const modal = document.getElementById('education-modal');
    const form = document.getElementById('education-form') as HTMLFormElement | null;
    const title = document.getElementById('education-modal-title');

    if (modal && form && title) {
      if (educationId) {
        title.textContent = 'Editar Educación';
        this.loadEducationData(educationId);
      } else {
        title.textContent = 'Nueva Educación';
        form.reset();
        const isActiveCheckbox = document.getElementById('education-isActive') as HTMLInputElement | null;
        const isCompletedCheckbox = document.getElementById('education-isCompleted') as HTMLInputElement | null;
        if (isActiveCheckbox) isActiveCheckbox.checked = true;
        if (isCompletedCheckbox) isCompletedCheckbox.checked = true;
      }

      modal.style.display = 'flex';
    }
  }

  /**
   * Carga los datos de una educación
   * 
   * @param {string} id - ID de la educación
   */
  async loadEducationData(id: string): Promise<void> {
    try {
      const education = await EducationRepository.getEducationById(id);
      if (education) {
        const idInput = document.getElementById('education-id') as HTMLInputElement | null;
        const degreeInput = document.getElementById('education-degree') as HTMLInputElement | null;
        const institutionInput = document.getElementById('education-institution') as HTMLInputElement | null;
        const fieldInput = document.getElementById('education-field') as HTMLInputElement | null;
        const locationInput = document.getElementById('education-location') as HTMLInputElement | null;
        const startDateInput = document.getElementById('education-startDate') as HTMLInputElement | null;
        const endDateInput = document.getElementById('education-endDate') as HTMLInputElement | null;
        const descriptionInput = document.getElementById('education-description') as HTMLTextAreaElement | null;
        const honorsInput = document.getElementById('education-honors') as HTMLInputElement | null;
        const orderInput = document.getElementById('education-order') as HTMLInputElement | null;
        const isActiveCheckbox = document.getElementById('education-isActive') as HTMLInputElement | null;
        const isCompletedCheckbox = document.getElementById('education-isCompleted') as HTMLInputElement | null;

        if (idInput) idInput.value = education.id || '';
        if (degreeInput) degreeInput.value = education.degree || '';
        if (institutionInput) institutionInput.value = education.institution || '';
        if (fieldInput) fieldInput.value = education.field || '';
        if (locationInput) locationInput.value = education.location || '';
        
        if (startDateInput && education.startDate && typeof education.startDate.toDate === 'function') {
          const date = education.startDate.toDate().toISOString().split('T')[0];
          startDateInput.value = date || '';
        }
        if (endDateInput && education.endDate && typeof education.endDate.toDate === 'function') {
          const date = education.endDate.toDate().toISOString().split('T')[0];
          endDateInput.value = date || '';
        }
        
        if (descriptionInput) descriptionInput.value = education.description || '';
        if (honorsInput) honorsInput.value = education.honors || '';
        if (orderInput) orderInput.value = String(education.order || 0);
        if (isActiveCheckbox) isActiveCheckbox.checked = education.isActive !== false;
        if (isCompletedCheckbox) isCompletedCheckbox.checked = education.isCompleted !== false;
      }
    } catch (error) {
      console.error('Error al cargar educación:', error);
      this.showMessage('education-message', 'Error al cargar la educación', 'error');
    }
  }

  /**
   * Guarda una educación
   * 
   * @param {SubmitEvent} e - Evento de submit
   */
  async saveEducation(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const id = (formData.get('id') as string) || `edu_${Date.now()}`;

      const startDate = formData.get('startDate') as string;
      const endDate = formData.get('endDate') as string;

      const educationData: Partial<IEducationFirestoreData> = {
        id,
        degree: (formData.get('degree') as string) || '',
        institution: (formData.get('institution') as string) || '',
        field: (formData.get('field') as string) || '',
        location: (formData.get('location') as string) || '',
        startDate: startDate ? Timestamp.fromDate(new Date(startDate)) : undefined,
        endDate: endDate ? Timestamp.fromDate(new Date(endDate)) : null,
        period: endDate 
          ? `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`
          : `${this.formatDate(startDate)} - Presente`,
        description: (formData.get('description') as string) || '',
        honors: (formData.get('honors') as string) || '',
        order: parseInt((formData.get('order') as string) || '0') || 0,
        isActive: (formData.get('isActive') as string) === 'on',
        isCompleted: (formData.get('isCompleted') as string) === 'on'
      };

      if (this.editingEducationId) {
        await EducationRepository.updateEducation(this.editingEducationId, educationData);
        this.showMessage('education-message', 'Educación actualizada correctamente', 'success');
      } else {
        await EducationRepository.createEducation(educationData as IEducationFirestoreData);
        this.showMessage('education-message', 'Educación creada correctamente', 'success');
      }

      setTimeout(() => {
        this.closeModal('education-modal');
        this.loadEducation();
      }, 1000);
    } catch (error) {
      console.error('Error al guardar educación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showMessage('education-message', `Error al guardar: ${errorMessage}`, 'error');
    }
  }

  /**
   * Edita una educación
   * 
   * @param {string} id - ID de la educación
   */
  async editEducation(id: string): Promise<void> {
    this.openEducationModal(id);
  }

  /**
   * Elimina una educación
   * 
   * @param {string} id - ID de la educación
   */
  async deleteEducation(id: string): Promise<void> {
    if (!confirm('¿Estás seguro de que quieres eliminar esta educación?')) {
      return;
    }

    try {
      await EducationRepository.deleteEducation(id);
      this.loadEducation();
    } catch (error) {
      console.error('Error al eliminar educación:', error);
      alert('Error al eliminar la educación');
    }
  }

  /**
   * Carga las habilidades
   */
  async loadSkills(): Promise<void> {
    try {
      const skills = await SkillRepository.getSkills();
      if (skills) {
        this.populateSkillsForm(skills);
      }
    } catch (error) {
      console.error('Error al cargar habilidades:', error);
    }
  }

  /**
   * Pobla el formulario de habilidades
   * 
   * @param {ISkillsFirestoreData} skills - Datos de habilidades
   */
  populateSkillsForm(skills: ISkillsFirestoreData): void {
    const lenguajesInput = document.getElementById('skills-lenguajes') as HTMLInputElement | null;
    const frameworksUIInput = document.getElementById('skills-frameworksUI') as HTMLInputElement | null;
    const arquitecturaInput = document.getElementById('skills-arquitectura') as HTMLInputElement | null;
    const libreriasAPIsInput = document.getElementById('skills-libreriasAPIs') as HTMLInputElement | null;
    const herramientasInput = document.getElementById('skills-herramientas') as HTMLInputElement | null;
    const testingInput = document.getElementById('skills-testing') as HTMLInputElement | null;

    if (lenguajesInput) lenguajesInput.value = Array.isArray(skills.lenguajes) ? skills.lenguajes.join(', ') : '';
    if (frameworksUIInput) frameworksUIInput.value = Array.isArray(skills.frameworksUI) ? skills.frameworksUI.join(', ') : '';
    if (arquitecturaInput) arquitecturaInput.value = Array.isArray(skills.arquitectura) ? skills.arquitectura.join(', ') : '';
    if (libreriasAPIsInput) libreriasAPIsInput.value = Array.isArray(skills.libreriasAPIs) ? skills.libreriasAPIs.join(', ') : '';
    if (herramientasInput) herramientasInput.value = Array.isArray(skills.herramientas) ? skills.herramientas.join(', ') : '';
    if (testingInput) testingInput.value = Array.isArray(skills.testing) ? skills.testing.join(', ') : '';
  }

  /**
   * Guarda las habilidades
   */
  async saveSkills(): Promise<void> {
    try {
      const form = document.getElementById('skills-form') as HTMLFormElement | null;
      if (!form) return;
      
      const formData = new FormData(form);
      
      const skillsData: ISkillsFirestoreData = {
        lenguajes: this.parseCommaSeparated(formData.get('lenguajes') as string),
        frameworksUI: this.parseCommaSeparated(formData.get('frameworksUI') as string),
        arquitectura: this.parseCommaSeparated(formData.get('arquitectura') as string),
        libreriasAPIs: this.parseCommaSeparated(formData.get('libreriasAPIs') as string),
        herramientas: this.parseCommaSeparated(formData.get('herramientas') as string),
        testing: this.parseCommaSeparated(formData.get('testing') as string)
      };

      await SkillRepository.updateSkills(skillsData);
      this.showMessage('skills-message', 'Habilidades actualizadas correctamente', 'success');
    } catch (error) {
      console.error('Error al guardar habilidades:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showMessage('skills-message', `Error al guardar: ${errorMessage}`, 'error');
    }
  }

  /**
   * Parsea un string separado por comas
   * 
   * @param {string | null} value - Valor a parsear
   * @returns {string[]} Array de strings
   */
  parseCommaSeparated(value: string | null): string[] {
    if (!value) return [];
    return value.split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  /**
   * Formatea una fecha
   * 
   * @param {string} dateString - String de fecha
   * @returns {string} Fecha formateada
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  /**
   * Cierra un modal
   * 
   * @param {string} modalId - ID del modal
   */
  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
    this.editingExperienceId = null;
    this.editingEducationId = null;
  }

  /**
   * Muestra un mensaje
   * 
   * @param {string} elementId - ID del elemento
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de mensaje (success, error)
   */
  showMessage(elementId: string, message: string, type: 'success' | 'error'): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.className = `message ${type}`;
      element.style.display = 'block';
      
      setTimeout(() => {
        element.style.display = 'none';
      }, 5000);
    }
  }

  /**
   * Configura los handlers para la subida de imágenes
   * 
   * @private
   */
  private setupImageUploadHandlers(): void {
    // Banner image upload
    const bannerUploadBtn = document.getElementById('banner-upload-btn');
    const bannerInput = document.getElementById('profile-bannerImage') as HTMLInputElement | null;
    const bannerRemoveBtn = document.getElementById('banner-remove-btn');

    if (bannerUploadBtn && bannerInput) {
      bannerUploadBtn.addEventListener('click', () => bannerInput.click());
      bannerInput.addEventListener('change', (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          this.handleImageUpload(file, 'banner');
        }
      });
    }

    if (bannerRemoveBtn) {
      bannerRemoveBtn.addEventListener('click', () => {
        this.removeImagePreview('banner');
      });
    }

    // Profile image upload
    const profileUploadBtn = document.getElementById('profile-upload-btn');
    const profileInput = document.getElementById('profile-profileImage') as HTMLInputElement | null;
    const profileRemoveBtn = document.getElementById('profile-remove-btn');

    if (profileUploadBtn && profileInput) {
      profileUploadBtn.addEventListener('click', () => profileInput.click());
      profileInput.addEventListener('change', (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          this.handleImageUpload(file, 'profile');
        }
      });
    }

    if (profileRemoveBtn) {
      profileRemoveBtn.addEventListener('click', () => {
        this.removeImagePreview('profile');
      });
    }
  }

  /**
   * Maneja la subida de una imagen
   * 
   * @private
   * @param {File} file - Archivo a subir
   * @param {string} type - Tipo de imagen ('banner' o 'profile')
   */
  private async handleImageUpload(file: File, type: 'banner' | 'profile'): Promise<void> {
    const uploadBtn = document.getElementById(`${type}-upload-btn`) as HTMLButtonElement | null;
    const originalBtnText = uploadBtn?.textContent || 'Seleccionar Imagen';
    
    try {
      console.log(`Iniciando subida de ${type}...`, file.name, file.size, file.type);
      
      // Verificar autenticación
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Debes estar autenticado para subir imágenes. Por favor, inicia sesión nuevamente.');
      }
      console.log('Usuario autenticado:', currentUser.email);

      // Mostrar preview inmediatamente
      this.showImagePreview(file, type);

      // Mostrar indicador de carga
      const infoElement = document.getElementById(`${type}-file-info`);
      if (infoElement) {
        infoElement.textContent = '⏳ Subiendo imagen...';
        infoElement.style.color = '#6366f1';
        infoElement.style.fontWeight = '600';
      }

      // Deshabilitar botón durante la subida
      if (uploadBtn) {
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Subiendo...';
        uploadBtn.style.opacity = '0.7';
      }

      // Subir imagen a Firebase Storage con timeout adicional
      console.log('Llamando a StorageService...');
      const uploadPromise = type === 'banner' 
        ? StorageService.uploadBannerImage(file)
        : StorageService.uploadProfileImage(file);
      
      // Timeout de seguridad de 90 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('La subida está tardando demasiado. Verifica: 1) Firebase Storage está habilitado, 2) Las reglas de Storage permiten escritura, 3) Tu conexión a internet.'));
        }, 90000);
      });
      
      const url = await Promise.race([uploadPromise, timeoutPromise]);

      console.log('Imagen subida exitosamente, URL:', url);

      // Guardar URL en input oculto
      const urlInput = document.getElementById(`profile-${type}Image-url`) as HTMLInputElement | null;
      if (urlInput) {
        urlInput.value = url;
        console.log('URL guardada en input:', urlInput.value);
      } else {
        console.warn('No se encontró el input para guardar la URL');
      }

      // Actualizar preview con URL de Firebase
      const previewImg = document.getElementById(`${type}-preview-img`) as HTMLImageElement | null;
      if (previewImg) {
        previewImg.src = url;
      }

      // Actualizar info
      if (infoElement) {
        infoElement.textContent = '✅ Imagen subida correctamente';
        infoElement.style.color = '#10b981';
        infoElement.style.fontWeight = '600';
      }

      // Restaurar botón
      if (uploadBtn) {
        uploadBtn.disabled = false;
        uploadBtn.textContent = originalBtnText;
        uploadBtn.style.opacity = '1';
      }

      this.showMessage('profile-message', `✅ ${type === 'banner' ? 'Banner' : 'Foto de perfil'} subida correctamente. No olvides hacer clic en "Guardar Cambios" para aplicar los cambios.`, 'success');
    } catch (error) {
      console.error(`Error al subir imagen ${type}:`, error);
      
      // Obtener mensaje de error más detallado
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Si es un error de Firebase, extraer más información
        if (error.message.includes('storage/')) {
          if (error.message.includes('unauthorized')) {
            errorMessage = 'No tienes permisos para subir imágenes. Verifica las reglas de Firebase Storage.';
          } else if (error.message.includes('quota')) {
            errorMessage = 'Se ha excedido la cuota de almacenamiento.';
          } else if (error.message.includes('unauthenticated')) {
            errorMessage = 'Debes estar autenticado. Por favor, inicia sesión nuevamente.';
          }
        }
      }
      
      const infoElement = document.getElementById(`${type}-file-info`);
      if (infoElement) {
        infoElement.textContent = `❌ Error: ${errorMessage}`;
        infoElement.style.color = '#ef4444';
        infoElement.style.fontWeight = '600';
      }

      // Restaurar botón
      if (uploadBtn) {
        uploadBtn.disabled = false;
        uploadBtn.textContent = originalBtnText;
        uploadBtn.style.opacity = '1';
      }

      this.showMessage('profile-message', `❌ Error al subir ${type === 'banner' ? 'banner' : 'foto de perfil'}: ${errorMessage}`, 'error');
      
      // Remover preview en caso de error
      this.removeImagePreview(type);
    }
  }

  /**
   * Muestra preview de imagen antes de subir
   * 
   * @private
   * @param {File} file - Archivo de imagen
   * @param {string} type - Tipo de imagen
   */
  private showImagePreview(file: File, type: 'banner' | 'profile'): void {
    const reader = new FileReader();
    const previewImg = document.getElementById(`${type}-preview-img`) as HTMLImageElement | null;
    const previewContainer = document.getElementById(`${type}-preview`);
    const infoElement = document.getElementById(`${type}-file-info`);

    if (previewImg && previewContainer) {
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          previewImg.src = e.target.result as string;
          previewContainer.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);

      if (infoElement) {
        infoElement.textContent = file.name;
        infoElement.style.color = '#64748b';
      }
    }
  }

  /**
   * Remueve el preview de imagen
   * 
   * @private
   * @param {string} type - Tipo de imagen
   */
  private removeImagePreview(type: 'banner' | 'profile'): void {
    const previewContainer = document.getElementById(`${type}-preview`);
    const previewImg = document.getElementById(`${type}-preview-img`) as HTMLImageElement | null;
    const fileInput = document.getElementById(`profile-${type}Image`) as HTMLInputElement | null;
    const urlInput = document.getElementById(`profile-${type}Image-url`) as HTMLInputElement | null;
    const infoElement = document.getElementById(`${type}-file-info`);

    if (previewContainer) {
      previewContainer.style.display = 'none';
    }
    if (previewImg) {
      previewImg.src = '';
    }
    if (fileInput) {
      fileInput.value = '';
    }
    if (urlInput) {
      urlInput.value = '';
    }
    if (infoElement) {
      infoElement.textContent = 'Ningún archivo seleccionado';
      infoElement.style.color = '#64748b';
    }
  }

  /**
   * Muestra las imágenes actuales del perfil
   * 
   * @private
   * @param {string | undefined} bannerUrl - URL del banner
   * @param {string | undefined} profileUrl - URL del perfil
   */
  private displayCurrentImages(bannerUrl?: string, profileUrl?: string): void {
    if (bannerUrl) {
      const bannerCurrent = document.getElementById('banner-current');
      const bannerCurrentImg = document.getElementById('banner-current-img') as HTMLImageElement | null;
      if (bannerCurrent && bannerCurrentImg) {
        bannerCurrentImg.src = bannerUrl;
        bannerCurrent.style.display = 'block';
      }
    }

    if (profileUrl) {
      const profileCurrent = document.getElementById('profile-current');
      const profileCurrentImg = document.getElementById('profile-current-img') as HTMLImageElement | null;
      if (profileCurrent && profileCurrentImg) {
        profileCurrentImg.src = profileUrl;
        profileCurrent.style.display = 'block';
      }
    }
  }

  // ============================================
  // PROJECTS METHODS
  // ============================================

  /**
   * Carga los proyectos
   */
  async loadProjects(forceRefresh: boolean = false): Promise<void> {
    try {
      console.log('Cargando proyectos... (forceRefresh:', forceRefresh, ')');
      let projects = await ProjectRepository.getAllProjects();
      console.log(`Proyectos obtenidos de Firestore: ${projects.length}`);
      
      // Verificar que los IDs en deletedProjectIds realmente no existen en Firestore
      // Usar getProjectById para verificar individualmente cada proyecto (más preciso que getAllProjects)
      const idsToRemove: string[] = [];
      
      for (const deletedId of this.deletedProjectIds) {
        try {
          // Verificar si el proyecto realmente existe usando getProjectById (que usa getDocFromServer)
          const projectExists = await ProjectRepository.getProjectById(deletedId);
          if (projectExists) {
            // El proyecto existe en Firestore, no debería estar en deletedProjectIds
            console.warn(`⚠️ Proyecto ${deletedId} está marcado como eliminado pero existe en Firestore. Removiendo del filtro.`);
            idsToRemove.push(deletedId);
          } else {
            // El proyecto realmente no existe, mantenerlo en deletedProjectIds para filtrarlo
            console.log(`✓ Proyecto ${deletedId} confirmado como eliminado (no existe en Firestore)`);
          }
        } catch (error) {
          // Si hay un error al verificar, asumir que el proyecto no existe y mantenerlo filtrado
          console.warn(`Error al verificar proyecto ${deletedId}, manteniéndolo filtrado:`, error);
        }
      }
      
      // Remover IDs incorrectos del filtro
      idsToRemove.forEach(id => {
        this.deletedProjectIds.delete(id);
        console.log(`Removido ${id} de deletedProjectIds (el proyecto existe en Firestore)`);
      });
      
      if (idsToRemove.length > 0) {
        this.saveDeletedProjectIds(); // Guardar cambios en localStorage
      }
      
      // Filtrar proyectos eliminados en esta sesión (solo los que realmente no existen)
      const beforeFilter = projects.length;
      projects = projects.filter(p => {
        if (!p.id) return false;
        if (this.deletedProjectIds.has(p.id)) {
          console.log(`Filtrando proyecto eliminado en sesión: ${p.id}`);
          return false;
        }
        return true;
      });
      
      if (beforeFilter !== projects.length) {
        console.log(`Proyectos filtrados por sesión: ${beforeFilter} -> ${projects.length} (eliminados en sesión: ${this.deletedProjectIds.size})`);
      }
      
      console.log(`Proyectos cargados: ${projects.length}`, projects.map(p => ({ id: p.id, name: p.name })));
      this.renderProjects(projects);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showMessage('project-message', `Error al cargar proyectos: ${errorMessage}`, 'error');
    }
  }

  /**
   * Renderiza los proyectos
   * 
   * @param {IProjectFirestoreData[]} projects - Array de proyectos
   */
  renderProjects(projects: IProjectFirestoreData[]): void {
    const container = document.getElementById('projects-list');
    if (!container) return;

    if (projects.length === 0) {
      container.innerHTML = '<p style="color: var(--admin-text-light);">No hay proyectos agregados</p>';
      return;
    }

    // Ordenar por order descendente
    const sortedProjects = [...projects].sort((a, b) => (b.order || 0) - (a.order || 0));

    container.innerHTML = sortedProjects.map((project) => {
      const projectId = project.id || `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const technologies = Array.isArray(project.technologies) && project.technologies.length > 0
        ? project.technologies.map(tech => `<span class="tech-tag">${this._escapeHtml(tech)}</span>`).join('')
        : '';

      return `
        <div class="project-card-modern" data-id="${projectId}">
          <div class="project-card-header">
            <div class="project-card-main-info">
              <div class="project-card-title-row">
                <h3 class="project-card-title">${this._escapeHtml(project.name || 'Sin nombre')}</h3>
                <span class="project-badge ${project.isActive ? 'active' : 'inactive'}">
                  ${project.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              ${project.mainImage ? `
                <div class="project-card-image-preview">
                  <img src="${this._escapeHtml(project.mainImage)}" alt="${this._escapeHtml(project.name || '')}" style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;">
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="project-card-body">
            ${project.shortDescription ? `
              <div class="project-card-section">
                <h4 class="section-label">Descripción Corta</h4>
                <p class="section-content">${this._escapeHtml(project.shortDescription)}</p>
              </div>
            ` : ''}
            
            ${technologies ? `
              <div class="project-card-section">
                <h4 class="section-label">Tecnologías</h4>
                <div class="technologies-container">
                  ${technologies}
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="project-card-actions">
            <button class="btn btn-primary" data-action="edit" data-id="${projectId}">
              ✏️ Editar
            </button>
            <button class="btn btn-danger" data-action="delete" data-id="${projectId}">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Agregar event listeners para los botones
    container.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const button = e.currentTarget as HTMLElement;
        const id = button.dataset.id;
        if (id) {
          this.editProject(id);
        }
      });
    });

    // Remover listeners anteriores para evitar duplicados
    container.querySelectorAll('[data-action="delete"]').forEach(btn => {
      // Clonar el botón para remover listeners anteriores
      const newBtn = btn.cloneNode(true);
      btn.parentNode?.replaceChild(newBtn, btn);
    });
    
    // Agregar nuevos listeners
    container.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // Prevenir que otros listeners se ejecuten
        const button = e.currentTarget as HTMLButtonElement;
        const id = button.dataset.id;
        console.log('Botón eliminar clickeado, ID:', id, 'Botón:', button);
        if (id && id.trim() !== '') {
          // Deshabilitar el botón para evitar múltiples clics
          button.disabled = true;
          this.deleteProject(id.trim());
        } else {
          console.error('No se encontró ID del proyecto para eliminar');
          this.showMessage('project-message', 'Error: No se pudo obtener el ID del proyecto', 'error');
        }
      }, { once: false }); // No usar once para que funcione después de recargar
    });
  }

  /**
   * Abre el modal de proyecto
   * 
   * @param {string | null} projectId - ID del proyecto a editar o null para nuevo
   */
  openProjectModal(projectId: string | null = null): void {
    this.editingProjectId = projectId;
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('project-modal-title');
    const form = document.getElementById('project-form') as HTMLFormElement | null;

    if (!modal || !form) return;

    // Reset form
    form.reset();
    this.resetProjectForm();

    if (projectId) {
      if (modalTitle) modalTitle.textContent = 'Editar Proyecto';
      this.loadProjectData(projectId);
    } else {
      if (modalTitle) modalTitle.textContent = 'Nuevo Proyecto';
    }

    modal.style.display = 'flex';
  }

  /**
   * Resetea el formulario de proyecto
   */
  resetProjectForm(): void {
    // Reset imagen principal - limpiar completamente
    const mainImagePreview = document.getElementById('project-mainImage-preview');
    const mainImageCurrent = document.getElementById('project-mainImage-current');
    const mainImageInput = document.getElementById('project-mainImage') as HTMLInputElement | null;
    const mainImageUrlInput = document.getElementById('project-mainImage-url') as HTMLInputElement | null;
    const mainImageFileInfo = document.getElementById('project-mainImage-file-info');
    
    if (mainImagePreview) {
      mainImagePreview.style.display = 'none';
      mainImagePreview.innerHTML = '<img id="project-mainImage-preview-img" src="" alt="Preview">';
    }
    if (mainImageCurrent) {
      mainImageCurrent.style.display = 'none';
      const currentImg = document.getElementById('project-mainImage-current-img') as HTMLImageElement | null;
      if (currentImg) currentImg.src = '';
    }
    if (mainImageInput) {
      mainImageInput.value = '';
      // Remover listeners anteriores
      const newInput = mainImageInput.cloneNode(true) as HTMLInputElement;
      mainImageInput.parentNode?.replaceChild(newInput, mainImageInput);
    }
    if (mainImageUrlInput) mainImageUrlInput.value = '';
    if (mainImageFileInfo) {
      mainImageFileInfo.textContent = 'Ningún archivo seleccionado';
      mainImageFileInfo.style.color = '#64748b';
    }

    // Reset imágenes adicionales - limpiar completamente
    const imagesContainer = document.getElementById('project-images-container');
    if (imagesContainer) {
      imagesContainer.innerHTML = `
        <div class="image-upload-container" data-image-index="0">
          <input type="file" class="project-additional-image" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,video/webm,video/mp4,video/ogg" style="display: none;">
          <div class="image-upload-wrapper">
            <button type="button" class="btn btn-secondary project-image-upload-btn">Seleccionar Imagen</button>
            <span class="image-upload-info project-image-file-info">Ningún archivo seleccionado</span>
          </div>
          <div class="image-preview project-image-preview" style="display: none;">
            <img class="project-image-preview-img" src="" alt="Preview">
            <button type="button" class="btn-remove-image project-image-remove-btn">✕</button>
          </div>
          <input type="hidden" class="project-image-url">
        </div>
      `;
      // Reconfigurar handlers después de limpiar
      this.setupProjectImageUploadHandlers();
    }

    this.projectImageIndex = 0;
  }

  /**
   * Configura los handlers de carga de imágenes de proyecto
   */
  setupProjectImageUploadHandlers(): void {
    // Imagen principal - usar delegación de eventos para evitar duplicados
    const mainImageUploadBtn = document.getElementById('project-mainImage-upload-btn');
    const mainImageInput = document.getElementById('project-mainImage') as HTMLInputElement | null;
    const mainImageRemoveBtn = document.getElementById('project-mainImage-remove-btn');

    if (mainImageUploadBtn && mainImageInput) {
      // Remover listeners anteriores si existen
      const newUploadBtn = mainImageUploadBtn.cloneNode(true);
      mainImageUploadBtn.parentNode?.replaceChild(newUploadBtn, mainImageUploadBtn);
      const newInput = mainImageInput.cloneNode(true) as HTMLInputElement;
      mainImageInput.parentNode?.replaceChild(newInput, mainImageInput);
      
      // Agregar nuevos listeners
      const updatedUploadBtn = document.getElementById('project-mainImage-upload-btn');
      const updatedInput = document.getElementById('project-mainImage') as HTMLInputElement | null;
      if (updatedUploadBtn && updatedInput) {
        updatedUploadBtn.addEventListener('click', () => updatedInput.click());
        updatedInput.addEventListener('change', (e) => this.handleProjectMainImageUpload(e));
      }
    }

    if (mainImageRemoveBtn) {
      const newRemoveBtn = mainImageRemoveBtn.cloneNode(true);
      mainImageRemoveBtn.parentNode?.replaceChild(newRemoveBtn, mainImageRemoveBtn);
      const updatedRemoveBtn = document.getElementById('project-mainImage-remove-btn');
      if (updatedRemoveBtn) {
        updatedRemoveBtn.addEventListener('click', () => {
          const preview = document.getElementById('project-mainImage-preview');
          const input = document.getElementById('project-mainImage') as HTMLInputElement | null;
          const urlInput = document.getElementById('project-mainImage-url') as HTMLInputElement | null;
          const fileInfo = document.getElementById('project-mainImage-file-info');
          if (preview) preview.style.display = 'none';
          if (input) input.value = '';
          if (urlInput) urlInput.value = '';
          if (fileInfo) {
            fileInfo.textContent = 'Ningún archivo seleccionado';
            fileInfo.style.color = '#64748b';
          }
        });
      }
    }

    // Imágenes adicionales - usar delegación de eventos desde el contenedor
    const imagesContainer = document.getElementById('project-images-container');
    if (imagesContainer) {
      // Remover listeners anteriores usando delegación
      imagesContainer.removeEventListener('click', this._handleProjectImageClick as EventListener);
      imagesContainer.removeEventListener('change', this._handleProjectImageChange as EventListener);
      
      // Agregar nuevos listeners con delegación
      imagesContainer.addEventListener('click', this._handleProjectImageClick.bind(this));
      imagesContainer.addEventListener('change', this._handleProjectImageChange.bind(this));
    }

    // Botón agregar otra imagen
    const addImageBtn = document.getElementById('add-project-image-btn');
    if (addImageBtn) {
      // Remover listener anterior si existe
      const newAddBtn = addImageBtn.cloneNode(true);
      addImageBtn.parentNode?.replaceChild(newAddBtn, addImageBtn);
      const updatedAddBtn = document.getElementById('add-project-image-btn');
      if (updatedAddBtn) {
        updatedAddBtn.addEventListener('click', () => {
          this.projectImageIndex++;
          const container = document.getElementById('project-images-container');
          if (container) {
            const newContainer = document.createElement('div');
            newContainer.className = 'image-upload-container';
            newContainer.setAttribute('data-image-index', String(this.projectImageIndex));
            newContainer.innerHTML = `
              <input type="file" class="project-additional-image" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,video/webm,video/mp4,video/ogg" style="display: none;">
              <div class="image-upload-wrapper">
                <button type="button" class="btn btn-secondary project-image-upload-btn">Seleccionar Imagen</button>
                <span class="image-upload-info project-image-file-info">Ningún archivo seleccionado</span>
              </div>
              <div class="image-preview project-image-preview" style="display: none;">
                <img class="project-image-preview-img" src="" alt="Preview">
                <button type="button" class="btn-remove-image project-image-remove-btn">✕</button>
              </div>
              <input type="hidden" class="project-image-url">
            `;
            container.appendChild(newContainer);
            this.setupProjectImageUploadHandlers();
          }
        });
      }
    }
  }

  /**
   * Handler delegado para clicks en imágenes de proyecto
   */
  private _handleProjectImageClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.classList.contains('project-image-upload-btn')) {
      const container = target.closest('.image-upload-container');
      const input = container?.querySelector('.project-additional-image') as HTMLInputElement | null;
      if (input) input.click();
    } else if (target.classList.contains('project-image-remove-btn')) {
      const container = target.closest('.image-upload-container');
      if (container) {
        const preview = container.querySelector('.project-image-preview') as HTMLElement | null;
        const input = container.querySelector('.project-additional-image') as HTMLInputElement | null;
        const urlInput = container.querySelector('.project-image-url') as HTMLInputElement | null;
        const fileInfo = container.querySelector('.project-image-file-info') as HTMLElement | null;
        if (preview) preview.style.display = 'none';
        if (input) input.value = '';
        if (urlInput) urlInput.value = '';
        if (fileInfo) {
          fileInfo.textContent = 'Ningún archivo seleccionado';
          fileInfo.style.color = '#64748b';
        }
      }
    }
  }

  /**
   * Handler delegado para cambios en inputs de imágenes de proyecto
   */
  private _handleProjectImageChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains('project-additional-image')) {
      this.handleProjectAdditionalImageUpload(e);
    }
  }

  /**
   * Maneja la carga de la imagen principal del proyecto
   */
  async handleProjectMainImageUpload(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const preview = document.getElementById('project-mainImage-preview');
    const previewImg = document.getElementById('project-mainImage-preview-img') as HTMLImageElement | null;
    const fileInfo = document.getElementById('project-mainImage-file-info');
    const current = document.getElementById('project-mainImage-current');

    if (!preview || !previewImg) return;

    // Validar tamaño (10MB para imágenes, 50MB para videos)
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    const maxSizeMB = isVideo ? 50 : 10;
    
    if (file.size > maxSize) {
      alert(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB`);
      input.value = '';
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isVideo) {
        // Para videos, crear un elemento video
        const video = document.createElement('video');
        video.src = result;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '200px';
        preview.innerHTML = '';
        preview.appendChild(video);
      } else {
        previewImg.src = result;
      }
      preview.style.display = 'block';
      if (current) current.style.display = 'none';
    };
    reader.readAsDataURL(file);

    // Subir imagen
    try {
      const timestamp = Date.now();
      const fileName = `project_main_${timestamp}.${file.name.split('.').pop()}`;
      const path = `projects/${fileName}`;
      
      const url = await StorageService.uploadFile(file, path);
      const urlInput = document.getElementById('project-mainImage-url') as HTMLInputElement | null;
      if (urlInput) urlInput.value = url;
      if (fileInfo) {
        fileInfo.textContent = `Imagen cargada: ${file.name}`;
        fileInfo.style.color = 'var(--admin-success-color)';
      }
    } catch (error) {
      console.error('Error al subir imagen principal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Detalles del error:', {
        message: errorMessage,
        code: (error as any)?.code,
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      
      // Mostrar mensaje de error más específico
      let userMessage = 'Error al subir la imagen. ';
      if (errorMessage.includes('403') || errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        userMessage += 'No tienes permisos. Verifica las reglas de Storage en Firebase Console.';
      } else if (errorMessage.includes('storage/unauthorized')) {
        userMessage += 'Las reglas de Storage no permiten escritura. Ve a Firebase Console > Storage > Rules y asegúrate de tener: allow write: if request.auth != null; para /projects/';
      } else {
        userMessage += errorMessage;
      }
      
      alert(userMessage);
      input.value = '';
      preview.style.display = 'none';
      if (fileInfo) {
        fileInfo.textContent = 'Error al subir imagen';
        fileInfo.style.color = 'var(--admin-error-color)';
      }
    }
  }

  /**
   * Maneja la carga de imágenes adicionales del proyecto
   */
  async handleProjectAdditionalImageUpload(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const container = input.closest('.image-upload-container');
    if (!container) return;

    const preview = container.querySelector('.project-image-preview') as HTMLElement | null;
    const previewImg = container.querySelector('.project-image-preview-img') as HTMLImageElement | null;
    const fileInfo = container.querySelector('.project-image-file-info') as HTMLElement | null;
    const urlInput = container.querySelector('.project-image-url') as HTMLInputElement | null;

    if (!preview || !previewImg) return;

    // Validar tamaño (10MB para imágenes, 50MB para videos)
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    const maxSizeMB = isVideo ? 50 : 10;
    
    if (file.size > maxSize) {
      alert(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB`);
      input.value = '';
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isVideo) {
        // Para videos, crear un elemento video
        const video = document.createElement('video');
        video.src = result;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '200px';
        preview.innerHTML = '';
        preview.appendChild(video);
      } else {
        previewImg.src = result;
      }
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Subir imagen
    try {
      const timestamp = Date.now();
      const fileName = `project_${timestamp}_${this.projectImageIndex}.${file.name.split('.').pop()}`;
      const path = `projects/${fileName}`;
      
      const url = await StorageService.uploadFile(file, path);
      if (urlInput) urlInput.value = url;
      if (fileInfo) {
        fileInfo.textContent = `Imagen cargada: ${file.name}`;
        fileInfo.style.color = 'var(--admin-success-color)';
      }
    } catch (error) {
      console.error('Error al subir imagen adicional:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Detalles del error:', {
        message: errorMessage,
        code: (error as any)?.code,
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      
      // Mostrar mensaje de error más específico
      let userMessage = 'Error al subir la imagen. ';
      if (errorMessage.includes('403') || errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        userMessage += 'No tienes permisos. Verifica las reglas de Storage en Firebase Console.';
      } else if (errorMessage.includes('storage/unauthorized')) {
        userMessage += 'Las reglas de Storage no permiten escritura. Ve a Firebase Console > Storage > Rules y asegúrate de tener: allow write: if request.auth != null; para /projects/';
      } else {
        userMessage += errorMessage;
      }
      
      alert(userMessage);
      input.value = '';
      preview.style.display = 'none';
      if (fileInfo) {
        fileInfo.textContent = 'Error al subir imagen';
        fileInfo.style.color = 'var(--admin-error-color)';
      }
    }
  }

  /**
   * Carga los datos de un proyecto para editar
   */
  async loadProjectData(id: string): Promise<void> {
    try {
      const project = await ProjectRepository.getProjectById(id);
      if (!project) {
        this.showMessage('project-message', 'Proyecto no encontrado', 'error');
        return;
      }

      // Llenar formulario
      const nameInput = document.getElementById('project-name') as HTMLInputElement | null;
      const shortDescInput = document.getElementById('project-shortDescription') as HTMLTextAreaElement | null;
      const fullDescInput = document.getElementById('project-fullDescription') as HTMLTextAreaElement | null;
      const technologiesInput = document.getElementById('project-technologies') as HTMLInputElement | null;
      const featuresInput = document.getElementById('project-features') as HTMLTextAreaElement | null;
      const repoUrlInput = document.getElementById('project-repositoryUrl') as HTMLInputElement | null;
      const liveUrlInput = document.getElementById('project-liveUrl') as HTMLInputElement | null;
      const orderInput = document.getElementById('project-order') as HTMLInputElement | null;
      const isActiveInput = document.getElementById('project-isActive') as HTMLInputElement | null;
      const mainImageUrlInput = document.getElementById('project-mainImage-url') as HTMLInputElement | null;

      if (nameInput) nameInput.value = project.name || '';
      if (shortDescInput) shortDescInput.value = project.shortDescription || '';
      if (fullDescInput) fullDescInput.value = project.fullDescription || '';
      if (technologiesInput) technologiesInput.value = Array.isArray(project.technologies) ? project.technologies.join(', ') : '';
      if (featuresInput) featuresInput.value = Array.isArray(project.features) ? project.features.join('\n') : '';
      if (repoUrlInput) repoUrlInput.value = project.repositoryUrl || '';
      if (liveUrlInput) liveUrlInput.value = project.liveUrl || '';
      if (orderInput) orderInput.value = String(project.order || 0);
      if (isActiveInput) isActiveInput.checked = project.isActive !== false;
      if (mainImageUrlInput) mainImageUrlInput.value = project.mainImage || '';

      // Mostrar imagen principal actual
      if (project.mainImage) {
        const current = document.getElementById('project-mainImage-current');
        const currentImg = document.getElementById('project-mainImage-current-img') as HTMLImageElement | null;
        if (current && currentImg) {
          currentImg.src = project.mainImage;
          current.style.display = 'block';
        }
      }

      // Cargar imágenes adicionales
      if (Array.isArray(project.images) && project.images.length > 0) {
        const imagesContainer = document.getElementById('project-images-container');
        if (imagesContainer) {
          imagesContainer.innerHTML = '';
          project.images.forEach((imageUrl, index) => {
            const container = document.createElement('div');
            container.className = 'image-upload-container';
            container.setAttribute('data-image-index', String(index));
            container.innerHTML = `
              <div class="image-current" style="display: block;">
                <p style="color: var(--admin-text-light); font-size: 0.875rem; margin-top: 0.5rem;">Imagen ${index + 1}:</p>
                <img src="${this._escapeHtml(imageUrl)}" alt="Imagen ${index + 1}" style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;">
                <button type="button" class="btn btn-danger" style="margin-top: 0.5rem;" data-remove-image="${index}">Eliminar</button>
              </div>
              <input type="hidden" class="project-image-url" value="${this._escapeHtml(imageUrl)}">
            `;
            imagesContainer.appendChild(container);
          });
          
          // Agregar botón para agregar más imágenes
          const addBtn = document.createElement('button');
          addBtn.type = 'button';
          addBtn.className = 'btn btn-secondary';
          addBtn.textContent = '+ Agregar Otra Imagen';
          addBtn.id = 'add-project-image-btn';
          addBtn.style.marginTop = '0.5rem';
          imagesContainer.appendChild(addBtn);
          
          this.setupProjectImageUploadHandlers();
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del proyecto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showMessage('project-message', `Error al cargar proyecto: ${errorMessage}`, 'error');
    }
  }

  /**
   * Guarda un proyecto
   * 
   * @param {SubmitEvent} e - Evento de submit
   */
  async saveProject(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const id = (formData.get('id') as string) || `proj_${Date.now()}`;

      const technologies = (formData.get('technologies') as string)
        .split(',')
        .filter(t => t.trim())
        .map(t => t.trim());

      const features = (formData.get('features') as string)
        .split('\n')
        .filter(f => f.trim())
        .map(f => f.trim());

      // Obtener URLs de imágenes adicionales
      const additionalImages: string[] = [];
      document.querySelectorAll('.project-image-url').forEach((input) => {
        const url = (input as HTMLInputElement).value.trim();
        if (url) additionalImages.push(url);
      });

      // Preparar datos del proyecto
      const projectData: Partial<IProjectFirestoreData> = {
        name: (formData.get('name') as string) || '',
        shortDescription: (formData.get('shortDescription') as string) || '',
        fullDescription: (formData.get('fullDescription') as string) || '',
        mainImage: (formData.get('mainImageUrl') as string) || '',
        images: additionalImages,
        technologies,
        features,
        repositoryUrl: (formData.get('repositoryUrl') as string) || '',
        liveUrl: (formData.get('liveUrl') as string) || '',
        order: parseInt((formData.get('order') as string) || '0') || 0,
        isActive: (formData.get('isActive') as string) === 'on'
      };

      if (this.editingProjectId) {
        // Al actualizar, NO incluir el ID en projectData para evitar duplicados
        // Usar siempre this.editingProjectId que es el ID real del documento
        console.log(`Actualizando proyecto con ID: ${this.editingProjectId}`);
        console.log('Datos a actualizar:', projectData);
        await ProjectRepository.updateProject(this.editingProjectId, projectData);
      } else {
        // Al crear, incluir el ID generado
        await ProjectRepository.createProject({
          ...projectData,
          id
        } as IProjectFirestoreData);
      }

      this.closeModal('project-modal');
      await this.loadProjects();
      this.showMessage(
        'project-message',
        this.editingProjectId ? 'Proyecto actualizado exitosamente' : 'Proyecto creado exitosamente',
        'success'
      );
      this.editingProjectId = null;
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showMessage('project-message', `Error al guardar proyecto: ${errorMessage}`, 'error');
    }
  }

  /**
   * Edita un proyecto
   * 
   * @param {string} id - ID del proyecto
   */
  editProject(id: string): void {
    this.openProjectModal(id);
  }

  /**
   * Elimina un proyecto
   * 
   * @param {string} id - ID del proyecto
   */
  async deleteProject(id: string): Promise<void> {
    console.log('deleteProject llamado con ID:', id);
    console.log('Tipo de ID:', typeof id);
    console.log('ID después de trim:', id?.trim());
    
    if (!id || id.trim() === '') {
      console.error('ID de proyecto inválido:', id);
      this.showMessage('project-message', 'Error: ID de proyecto inválido', 'error');
      return;
    }

    const confirmed = confirm(`¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.`);
    console.log('Usuario confirmó eliminación:', confirmed);
    
    if (!confirmed) {
      console.log('Usuario canceló la eliminación');
      return;
    }

    try {
      console.log('Iniciando eliminación del proyecto con ID:', id);
      
      // Agregar a la lista de eliminados inmediatamente
      this.deletedProjectIds.add(id);
      this.saveDeletedProjectIds(); // Guardar en localStorage
      console.log(`Proyecto ${id} agregado a lista de eliminados. Total eliminados: ${this.deletedProjectIds.size}`);
      
      // Limpiar el contenedor inmediatamente para feedback visual
      const container = document.getElementById('projects-list');
      if (container) {
        container.innerHTML = '<p style="color: var(--admin-text-light);">Eliminando proyecto...</p>';
      }
      
      // Intentar eliminar de Firestore
      try {
        await ProjectRepository.hardDeleteProject(id);
        console.log('Proyecto eliminado exitosamente de Firestore');
      } catch (deleteError) {
        // Si el proyecto ya no existe o el ID es incorrecto, mostrar mensaje claro
        const errorMsg = deleteError instanceof Error ? deleteError.message : String(deleteError);
        console.error('Error al eliminar proyecto:', errorMsg);
        
        if (errorMsg.includes('no existe') || errorMsg.includes('does not exist') || errorMsg.includes('no existe en Firestore')) {
          console.warn('El proyecto no existe en Firestore. Puede que ya haya sido eliminado o el ID sea incorrecto.');
          this.showMessage('project-message', 'El proyecto no existe o ya fue eliminado. Recargando lista...', 'error');
          // Recargar proyectos para actualizar la lista
          await this.loadProjects(true);
          return; // Salir sin mostrar error
        } else {
          throw deleteError; // Re-lanzar si es otro tipo de error
        }
      }
      
      // No verificar aquí porque hardDeleteProject ya lo hace con getAllProjects
      // Esperar un poco más para asegurar propagación
      console.log('Esperando propagación adicional...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Recargar proyectos (el filtro automático eliminará este proyecto de la lista)
      console.log('Recargando lista de proyectos...');
      await this.loadProjects(true); // forceRefresh = true
      
      // Limpiar IDs de proyectos que realmente fueron eliminados (en segundo plano)
      setTimeout(() => this.cleanupDeletedProjectIds(), 2000);
      
      this.showMessage('project-message', 'Proyecto eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error completo al eliminar proyecto:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showMessage('project-message', `Error al eliminar proyecto: ${errorMessage}`, 'error');
      // Recargar de todos modos para mostrar el estado actual
      await this.loadProjects();
    }
  }
}

// Initialize
const adminPanel = new AdminPanel();
adminPanel.init();

// Make it globally available for onclick handlers
declare global {
  interface Window {
    adminPanel: AdminPanel;
  }
}

window.adminPanel = adminPanel;

export default adminPanel;

