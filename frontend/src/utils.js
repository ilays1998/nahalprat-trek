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
  "DSC_0323.JPG": { en: "Picture 1", he: "מנופי היום הראשון" },
  "DSC_0391.JPG": { en: "Picture 2", he: "נופי הנחל" },
  "DSC_0396.JPG": { en: "Picture 3", he: "בריכת החרוב" },
  "DSC_0379.JPG": { en: "Picture 4", he: "בריכת התמר" },
  "DSC_0426.JPG": { en: "Picture 5", he: "העלייה לנופי פרת" },
  "DSC_0404.JPG": { en: "Picture 6", he: "בריכת החרוב" },
  "DSC_0369.JPG": { en: "Picture 7", he: "עין פארה" },
  "DSC_0410.JPG": { en: "Picture 8", he: "מטיילים בנחל" },
  "DSC_0346.JPG": { en: "Picture 9", he: "תצפית על עין פארה"},
  "DSC_0394.JPG": { en: "Picture 10", he: "מטיילים בנחל" },
  "DSC_0372.JPG": { en: "Picture 11", he: "נופי הנחל" },
  "DSC_0321.JPG": { en: "Picture 12", he: "הירידה לנחל" },
  "DSC_0338.JPG": { en: "Picture 13", he: "תחילת הנחל" },
  "DSC_0335.JPG": { en: "Picture 14", he: "תחילת הנחל" },
  "DSC_0425.JPG": { en: "Picture 15", he: "תצפית ממצפה יונתן" },
  "DSC_0409.JPG": { en: "Picture 16", he: "דגים בנחל" },
  "DSC_0432.JPG": { en: "Picture 17", he: "עתיקות בחירבת עלמית" },
  "DSC_0431.JPG": { en: "Picture 18", he: "מצפה יונתן" },
  "DSC_0358.JPG": { en: "Picture 19", he: "מנזר פארן" },
  "DSC_0413.JPG": { en: "Picture 20", he: "נחל פרת" },
  "DSC_0406.JPG": { en: "Picture 21", he: "בריכת החרוב" },
};
