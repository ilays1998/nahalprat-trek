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

// Mapping of image filenames to custom titles
export const filenameTitleMap = {
  "DSC_0323.JPG": { en: "Picture 1", he: "תמונה 1" },
  "DSC_0391.JPG": { en: "Picture 2", he: "תמונה 2" },
  "DSC_0396.JPG": { en: "Picture 3", he: "תמונה 3" },
  "DSC_0379.JPG": { en: "Picture 4", he: "תמונה 4" },
  "DSC_0426.JPG": { en: "Picture 5", he: "תמונה 5" },
  "DSC_0404.JPG": { en: "Picture 6", he: "תמונה 6" },
  "DSC_0369.JPG": { en: "Picture 7", he: "תמונה 7" },
  "DSC_0410.JPG": { en: "Picture 8", he: "תמונה 8" },
  "DSC_0346.JPG": { en: "Picture 9", he: "תמונה 9" },
  "DSC_0394.JPG": { en: "Picture 10", he: "תמונה 10" },
  "DSC_0372.JPG": { en: "Picture 11", he: "תמונה 11" },
  "DSC_0321.JPG": { en: "Picture 12", he: "תמונה 12" },
  "DSC_0338.JPG": { en: "Picture 13", he: "תמונה 13" },
  "DSC_0335.JPG": { en: "Picture 14", he: "תמונה 14" },
  "DSC_0425.JPG": { en: "Picture 15", he: "תמונה 15" },
  "DSC_0409.JPG": { en: "Picture 16", he: "תמונה 16" },
  "DSC_0432.JPG": { en: "Picture 17", he: "תמונה 17" },
  "DSC_0431.JPG": { en: "Picture 18", he: "תמונה 18" },
  "DSC_0325.JPG": { en: "Picture 19", he: "תמונה 19" },
};
