export function createPageUrl(pageName) {
  const map = {
    Home: '/',
    Packages: '/packages',
    Gallery: '/gallery',
    Booking: '/booking',
    MyBookings: '/mybooking',
    Contact: '/contact',
  };
  return map[pageName] || '/';
}
