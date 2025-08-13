// Frontend Configuration
const config = {
  // Change backend port here
  BACKEND_PORT: import.meta.env.VITE_BACKEND_PORT || '5001',
  FRONTEND_PORT: import.meta.env.VITE_FRONTEND_PORT || '3000',
  BACKEND_URL_ENV: import.meta.env.VITE_BACKEND_URL,
  
  // Auto-generated URLs
  get BACKEND_URL() {
    return this.BACKEND_URL_ENV || `http://localhost:${this.BACKEND_PORT}`;
  },
  
  get API_BASE_URL() {
    return `${this.BACKEND_URL}/api`;
  },
  
  get FRONTEND_URL() {
    return `http://localhost:${this.FRONTEND_PORT}`;
  }
};

export default config; 