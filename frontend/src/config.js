// Frontend Configuration
const config = {
  // Change backend port here
  BACKEND_PORT: import.meta.env.VITE_BACKEND_PORT || '5001',
  FRONTEND_PORT: import.meta.env.VITE_FRONTEND_PORT || '3000',
  BACKEND_URL_ENV: import.meta.env.VITE_BACKEND_URL,
  BACKEND_HOST_ENV: import.meta.env.VITE_BACKEND_HOST,
  
  // Auto-generated URLs
  get BACKEND_URL() {
    if (this.BACKEND_URL_ENV) return this.BACKEND_URL_ENV;
    if (this.BACKEND_HOST_ENV) return `https://${this.BACKEND_HOST_ENV}`;
    return `http://localhost:${this.BACKEND_PORT}`;
  },
  
  get API_BASE_URL() {
    return `${this.BACKEND_URL}/api`;
  },
  
  get FRONTEND_URL() {
    return `http://localhost:${this.FRONTEND_PORT}`;
  }
};

export default config; 