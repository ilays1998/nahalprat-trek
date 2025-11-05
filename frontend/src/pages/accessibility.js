import React from 'react';
import { useLanguage } from '../layout';
import config from '../config';

export default function Accessibility() {
  const { language } = useLanguage();
  const isRTL = language === 'he';

  const email = config.CONTACT.EMAIL;
  const phone = config.CONTACT.PHONE[language] || config.CONTACT.PHONE.en;

  const content = {
    he: {
      title: 'הצהרת נגישות',
      lastUpdate: 'עודכן לאחרונה:',
      sections: [
        {
          title: 'על ההצהרה והיקף תחולה',
          content: `האתר פותח ומעודכן באופן שוטף כדי להבטיח נגישות מרבית, בהתאם להנחיות עדכניות של WCAG 2.1 AA.

הצהרת נגישות זו חלה על אתר Nahal Prat Trek ועל כלל התכנים והשירותים הדיגיטליים הזמינים בו.
אנו מאמינים כי נגישות היא ערך יסוד המבטא שוויון, כבוד ושותפות בכל מרחבי החיים, ופועלים להעניק חוויית שימוש שווה והוגנת לכל המשתמשות והמשתמשים, לרבות אנשים עם מוגבלות.`
        },
        {
          title: 'מחויבות לנגישות',
          content: `אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג–2013.

התאמות הנגישות בוצעו לפי התקן הישראלי ת"י 5568 ובהתאם להנחיות WCAG 2.1 ברמה AA.
האתר נגיש במלואו בהתאם לתקנים אלה.`
        },
        {
          title: 'צעדים שננקטו להנגשת האתר',
          content: `• יישום HTML סמנטי ושימוש בתפקידי ARIA לפי הצורך
• ניווט מלא באמצעות מקלדת בכל רכיבי האתר
• יחס ניגודיות מספק בין טקסט לרקע בהתאם ל‑WCAG AA
• טקסט חלופי לתמונות ולרכיבים שאינם טקסט
• היררכיית כותרות ולינקים משמעותיים
• אפשרות להגדלת טקסט עד 200% ללא אובדן תוכן
• מצבי פוקוס גלויים וברורים
• טפסים עם תוויות, שגיאות והנחיות ברורות
• הימנעות מתוכן מהבהב ומאנימציות מסיחות`
        },
        {
          title: 'קיצורי מקלדת ושימוש ללא עכבר',
          content: `• מעבר לאלמנט הבא: Tab | חזרה: Shift+Tab
• הפעלת קישור/כפתור: Enter | מרחב (Space) לפי הקשר
• דילוג לתוכן הראשי (Skip link) בתחילת הדף
• הגדלת גופן: Ctrl + (Windows) | Cmd + (Mac)
• הקטנת גופן: Ctrl - (Windows) | Cmd - (Mac)
• איפוס גודל: Ctrl 0 (Windows) | Cmd 0 (Mac)`
        },
        {
          title: 'תאימות טכנית וטכנולוגיות',
          content: `האתר פותח באמצעות HTML5, CSS3 ו‑JavaScript, ותוכנן לפעול עם קוראי מסך וטכנולוגיות מסייעות נפוצות (למשל NVDA, VoiceOver).`
        },
        {
          title: 'דפדפנים ומערכות נתמכות',
          content: `Chrome, Firefox, Safari ו‑Edge בגרסאות האחרונות במחשב ובמובייל. שימוש בגרסאות ישנות מאוד או בתוספי צד שלישי מסוימים עלול לגרום למגבלות.`
        },
        {
          title: 'מגבלות ידועות ופתרונות חלופיים',
          content: `ייתכן שחלק מקבצים להורדה, מפות אינטראקטיביות או רכיבי צד שלישי אינם נגישים במלואם. במידה ונתקלתם במכשול, פנו אלינו ונציע חלופה נגישה סבירה (למשל קובץ חלופי, הסבר טלפוני או שליחת מידע במייל).`
        },
        {
          title: 'פניות ומשוב',
          content: `אם נתקלתם בבעיה נגישותית או יש לכם הצעה לשיפור, נשמח לשמוע. פנו אלינו בדוא"ל: ${email} או בטלפון/וואטסאפ: ${phone}. אנו שואפים להשיב בתוך שני ימי עסקים.`
        }
      ]
    },
    en: {
      title: 'Accessibility Statement',
      lastUpdate: 'Last updated:',
      sections: [
        {
          title: 'Scope of This Statement',
          content: `The site is developed and updated on an ongoing basis to ensure maximum accessibility, in accordance with current WCAG 2.1 AA guidelines.

This statement applies to the Nahal Prat Trek website and all digital content and services available on it.
We believe accessibility is a core value reflecting equality, dignity, and participation. We aim to provide an equitable and fair user experience for all users, including people with disabilities.`
        },
        {
          title: 'Our Commitment',
          content: `This site complies with the Equal Rights for Persons with Disabilities Regulations (Service Accessibility Adjustments), 2013.

Accessibility adjustments were implemented in accordance with Israeli Standard 5568 and WCAG 2.1 Level AA.
The site fully conforms to these standards.`
        },
        {
          title: 'Measures We Take',
          content: `• Semantic HTML and ARIA roles where appropriate
• Full keyboard navigation across site components
• Sufficient color contrast per WCAG AA
• Alternative text for images and non-text content
• Clear heading hierarchy and meaningful links
• Text can be enlarged up to 200% without loss of content
• Visible focus states
• Accessible forms with labels, error handling, and instructions
• Avoidance of flashing or distracting animations`
        },
        {
          title: 'Keyboard Navigation and No-Mouse Use',
          content: `• Next element: Tab | Previous: Shift+Tab
• Activate link/button: Enter | Space depending on context
• Skip to main content link available at page start
• Increase text size: Ctrl + (Windows) | Cmd + (Mac)
• Decrease text size: Ctrl - (Windows) | Cmd - (Mac)
• Reset text size: Ctrl 0 (Windows) | Cmd 0 (Mac)`
        },
        {
          title: 'Technical Specifications',
          content: `The site uses HTML5, CSS3, and JavaScript, and is designed to work with common assistive technologies and screen readers (e.g., NVDA, VoiceOver).`
        },
        {
          title: 'Supported Browsers and Devices',
          content: `Latest versions of Chrome, Firefox, Safari, and Edge on desktop and mobile. Very old browsers or certain third-party extensions may cause limitations.`
        },
        {
          title: 'Known Limitations and Alternatives',
          content: `Certain downloads, interactive maps, or third-party components may not be fully accessible. If you encounter a barrier, contact us and we will provide a reasonable alternative (e.g., alternative file, phone explanation, or email delivery).`
        },
        {
          title: 'Feedback and Contact',
          content: `If you experience an accessibility issue or have a suggestion, please contact us at ${email} or by phone/WhatsApp: ${phone}. We aim to respond within two business days.`
        }
      ]
    }
  };

  const pageContent = content[language];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-desert-50 to-white py-12 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-desert-200 px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-desert-900 text-center">
              {pageContent.title}
            </h1>
            <p className="text-xl text-desert-900 text-center mt-2">
              {pageContent.lastUpdate} {language === 'he' ? '5.11.2025' : 'November 5, 2025'}
            </p>
          </div>

          <div className="px-8 py-12">
            <div className="space-y-8">
              {pageContent.sections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
