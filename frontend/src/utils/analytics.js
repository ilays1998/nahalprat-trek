/**
 * Google Analytics utility functions
 */

// Track custom events
export const trackEvent = (action, category = 'engagement', label = '', value = null) => {
  if (typeof window.gtag !== 'undefined') {
    const eventData = {
      event_category: category,
      event_label: label,
    };
    
    if (value !== null) {
      eventData.value = value;
    }
    
    window.gtag('event', action, eventData);
  }
};

// Track page views manually (useful for single page app navigation)
export const trackPageView = (pagePath) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'AW-17704600474', {
      page_path: pagePath,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName, success = true) => {
  trackEvent('form_submit', 'form', formName, success ? 1 : 0);
};

// Track button clicks
export const trackButtonClick = (buttonName, location = '') => {
  trackEvent('click', 'button', `${buttonName}${location ? ` - ${location}` : ''}`);
};

// Track booking events
export const trackBookingEvent = (action, value = null) => {
  trackEvent(action, 'booking', '', value);
};

// Track user interactions
export const trackUserInteraction = (action, element = '') => {
  trackEvent(action, 'user_interaction', element);
};