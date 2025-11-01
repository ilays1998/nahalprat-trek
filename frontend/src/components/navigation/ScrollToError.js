
// Scroll to error message utility
export const scrollToError = (selector = '.error-message, [role="alert"], .alert-destructive') => {
  setTimeout(() => {
    const errorElement = document.querySelector(selector);
    if (errorElement) {
      errorElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }
  }, 100);
};