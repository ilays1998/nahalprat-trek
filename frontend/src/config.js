// Frontend Configuration
const config = {
  // Change backend port here
  BACKEND_PORT: import.meta.env.VITE_BACKEND_PORT || '5000',
  FRONTEND_PORT: import.meta.env.VITE_FRONTEND_PORT || '3000',
  BACKEND_URL_ENV: import.meta.env.VITE_BACKEND_URL,
  BACKEND_HOST_ENV: import.meta.env.VITE_BACKEND_HOST,
  
  // Auto-generated URLs
  get BACKEND_URL() {
    if (this.BACKEND_URL_ENV) return this.BACKEND_URL_ENV;
    if (this.BACKEND_HOST_ENV) return `https://${this.BACKEND_HOST_ENV}`;
    // Use the same host as the frontend when in development
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `http://${host}:${this.BACKEND_PORT}`;
  },
  
  get API_BASE_URL() {
    return `${this.BACKEND_URL}/api`;
  },
  
  get FRONTEND_URL() {
    // Use the current window location instead of hardcoding localhost
    return typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : `http://localhost:${this.FRONTEND_PORT}`;
  },

  // Contact Information
  CONTACT: {
    EMAIL: 'treknahalprat@gmail.com',
    PHONE: {
      he: '054-5901376',           // Hebrew - local format
      en: '+972-54-590-1376'      // English - international format
    }
  },

  // Social Media Links
  SOCIAL: {
    INSTAGRAM: 'https://www.instagram.com/treknahalprat/',
    FACEBOOK: '#',
    YOUTUBE: '#'
  }
};

export default config; 