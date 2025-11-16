import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the route changes
    window.scrollTo(0, 0);
    
    // Track page view with Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'AW-17704600474', {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}