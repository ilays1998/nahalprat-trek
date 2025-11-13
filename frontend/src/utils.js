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
  "DSC_0323.JPG": { en: "First Day Views", he: "מנופי היום הראשון" },
  "DSC_0391.JPG": { en: "Stream Landscapes", he: "נופי הנחל" },
  "DSC_0396.JPG": { en: "Haruv Pool", he: "בריכת החרוב" },
  "DSC_0379.JPG": { en: "Tamar Pool", he: "בריכת התמר" },
  "DSC_0426.JPG": { en: "Climb to Nofei Prat", he: "העלייה לנופי פרת" },
  "DSC_0404.JPG": { en: "Haruv Pool", he: "בריכת החרוב" },
  "DSC_0369.JPG": { en: "Ein Parah Spring", he: "עין פארה" },
  "DSC_0410.JPG": { en: "Hikers in the Stream", he: "מטיילים בנחל" },
  "DSC_0346.JPG": { en: "Viewpoint over Ein Parah", he: "תצפית על עין פארה" },
  "DSC_0394.JPG": { en: "Hikers in the Stream", he: "מטיילים בנחל" },
  "DSC_0372.JPG": { en: "Stream Landscapes", he: "נופי הנחל" },
  "DSC_0321.JPG": { en: "Descent into the Stream", he: "הירידה לנחל" },
  "DSC_0338.JPG": { en: "Beginning of the Stream", he: "תחילת הנחל" },
  "DSC_0335.JPG": { en: "Beginning of the Stream", he: "תחילת הנחל" },
  "DSC_0425.JPG": { en: "View from Mitzpe Yonatan", he: "תצפית ממצפה יונתן" },
  "DSC_0409.JPG": { en: "Fish in the Stream", he: "דגים בנחל" },
  "DSC_0432.JPG": { en: "Ruins at Khirbet Almit", he: "עתיקות בחירבת עלמית" },
  "DSC_0431.JPG": { en: "Mitzpe Yonatan", he: "מצפה יונתן" },
  "DSC_0358.JPG": { en: "Faran Monastery", he: "מנזר פארן" },
  "DSC_0413.JPG": { en: "Prat Stream", he: "נחל פרת" },
  "DSC_0406.JPG": { en: "Haruv Pool", he: "בריכת החרוב" },
  "30_הנחל.jpg": { en: "The Stream in Winter", he: "הנחל בחורף" },
  "31_מנזר חריטון.JPG": { en: "Chariton Monastery", he: "מנזר חריטון" },
  "32_מנזר_חריטון.jpg": { en: "Chariton Monastery", he: "מנזר חריטון" },
  "34_ברכת התמר.jpg": { en: "Tamar Pool", he: "בריכת התמר" },
  "35_ברכת התמר.JPG": { en: "Tamar Pool", he: "בריכת התמר" },
  "36_נחזור לנחל.jpg": { en: "The Stream in Winter", he: "הנחל בחורף" },
  "37_עין מבוע.JPG": { en: "Ein Mabua Spring", he: "עין מבוע" },
  "39_עין מבוע.jpg": { en: "Ein Mabua Spring", he: "עין מבוע" },
  "42_עין מבוע.jpg": { en: "Ein Mabua Spring", he: "עין מבוע" },
  "zimmer_garden.jpg": { en: "Cabin Garden", he: "גינת הצימר" },
  "zimmer_standard_1.jpg": { en: "Standard Cabin", he: "צימר סטנדרט" },
  "zimmer_standard_2.jpg": { en: "Standard Cabin", he: "צימר סטנדרט" },
  "zimmer_standard_3.jpg": { en: "Standard Cabin", he: "צימר סטנדרט" },
};
