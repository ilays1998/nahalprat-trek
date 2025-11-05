import React from 'react';
import { useLanguage } from '../layout';

export default function Privacy() {
  const { language } = useLanguage();
  const isRTL = language === 'he';

  const content = {
    he: {
      title: "מדיניות פרטיות – טרק נחל פרת",
      lastUpdate: "עודכן לאחרונה:",
      sections: [
        {
          title: "1. כללי",
          content: `בטרק נחל פרת אנו מכבדים את פרטיות המשתמשים ומתחייבים לשמור על המידע האישי שלכם. מדיניות פרטיות זו נועדה להבהיר כיצד אנו אוספים, משתמשים ושומרים על הנתונים שלכם בהתאם לחוק הגנת הפרטיות, התשמ"א–1981 ולתקנות החלות בישראל ובמדינות נוספות.`
        },
        {
          title: "2. סוגי המידע שאנו אוספים",
          content: `2.1 במהלך השימוש באתר או ביצוע הזמנה אנו עשויים לאסוף את המידע הבא:
- פרטי זיהוי: שם מלא, כתובת דוא"ל, מספר טלפון.
- פרטי הזמנה: תאריכי לינה, שירותים שנרכשו, בקשות מיוחדות.
- פרטי תשלום: מידע הנדרש לצורך ביצוע התשלום (באמצעות ספקי סליקה חיצוניים בלבד, ואינו נשמר בשרתי החברה).
- נתוני גלישה: כתובת IP, סוג דפדפן, מערכת הפעלה ונתוני שימוש בסיסיים הנאספים אוטומטית לצורכי תחזוקה, אבטחה ושיפור השירות.
2.2 אנו איננו אוספים מידע רגיש כגון מספרי זהות, פרטי אשראי מלאים או מידע רפואי. עם זאת, ייתכן שנבקש מהמשתמש לציין אלרגיות או רגישויות למזון, וזאת אך ורק לצורך התאמת הארוחות והשירותים הנלווים במהלך הטרק. מידע זה נשמר באופן מאובטח ואינו משמש לכל מטרה אחרת.`
        },
        {
          title: "3. שימוש במידע",
          content: `המידע שנאסף משמש אותנו למטרות הבאות בלבד:
- ניהול הזמנות, שירותי לינה והובלת ציוד.
- יצירת קשר עם המשתמש בנוגע להזמנה, ביטול או עדכון שירות.
- שליחת הודעות שירות (אישור הזמנה, תזכורות, ביטולים וכד').
- התאמת הארוחות והשירותים הנלווים בהתאם לרגישויות או אלרגיות שדווחו.
- ניתוח נתונים אנונימיים לשם תחזוקה ושיפור השירותים.
אנו איננו משתמשים במידע לצורכי פרסום, שיווק או מכירת נתונים לצדדים שלישיים.`
        },
        {
          title: "4. שימוש בעוגיות (Cookies)",
          content: `האתר משתמש בעוגיות (Cookies) בסיסיות בלבד לצורך תחזוקת האתר וניהול סשן משתמשים.
מטרות השימוש:
- שמירה על התחברות המשתמש במהלך הגלישה.
- ניהול העדפות שפה ונגישות.
- שמירה על יציבות ותפקוד תקין של האתר.
איננו משתמשים בעוגיות לצורכי פרסום, ניתוח התנהגותי או מעקב שיווקי.
ניתן לשלוט בשימוש בעוגיות דרך הגדרות הדפדפן.`
        },
        {
          title: "5. שיתוף מידע עם צדדים שלישיים",
          content: `ייתכן שנעזר בצדדים שלישיים לצורך הפעלת האתר ושירותיו, למשל:
- ספקי דוא"ל – לשליחת אישורי הזמנה והתראות.
- ספקי מיפוי (Google Maps) – להצגת מסלולים ומידע גאוגרפי.
- ספקי סליקה – לעיבוד תשלומים מאובטח.
שירותים אלה מקבלים גישה למידע הנדרש בלבד לביצוע תפקידם ואינם רשאים להשתמש בו לכל מטרה אחרת.`
        },
        {
          title: "6. אבטחת מידע",
          content: `החברה נוקטת באמצעי אבטחה טכנולוגיים וארגוניים מתקדמים, לרבות:
- הצפנת תקשורת (SSL/HTTPS).
- גישה מוגבלת למידע אישי לעובדים מורשים בלבד.
- ניטור ועדכון שוטף של מערכות האבטחה.
עם זאת, לא ניתן להבטיח חסינות מוחלטת מפני חדירות או שימוש בלתי מורשה במידע.`
        },
        {
          title: "7. שמירת מידע",
          content: `המידע האישי נשמר רק לפרק הזמן הדרוש למטרות שלשמן נאסף, או לפי דרישות החוק.
לאחר מכן המידע יימחק או יעבור תהליך אנונימיזציה.`
        },
        {
          title: "8. זכויות המשתמש",
          content: `בהתאם לחוק, עומדות למשתמש הזכויות הבאות:
- לקבל עותק מהמידע שנשמר אודותיו.
- לבקש תיקון, עדכון או מחיקה של מידע.
- להתנגד לשימוש מסוים במידע.
למימוש זכויות אלה ניתן לפנות אלינו באמצעות הפרטים המפורטים להלן.`
        },
        {
          title: "9. תאימות לחוקים בינלאומיים",
          content: `אנו פועלים בהתאם לעקרונות חוקי הגנת הפרטיות, לרבות הוראות ה-GDPR (האיחוד האירופי) וה-CCPA (קליפורניה), ככל שהן חלות.`
        },
        {
          title: "10. יצירת קשר",
          content: `לכל שאלה, בקשה או בירור הנוגעים למדיניות פרטיות זו, ניתן לפנות אלינו:
דוא"ל: treknahalprat@gmail.com
טלפון/וואטסאפ: 054-5901376`
        },
        {
          title: "11. סיכום",
          content: `אנו אוספים מינימום מידע הדרוש להפעלת השירותים בלבד.
אנו משתמשים בעוגיות אך ורק לניהול סשן ולתחזוקה.
איננו מעבירים מידע אישי לצורכי פרסום או שיווק.
אנו מחויבים לשקיפות, אבטחה ואחריות מלאה כלפי המשתמשים שלנו.`
        }
      ]
    },
    en: {
      title: "Privacy Policy – Nahal Prat Trek",
      lastUpdate: "Last updated:",
      sections: [
        {
          title: "1. Introduction",
          content: `At Nahal Prat Trek, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information in accordance with applicable privacy laws.`
        },
        {
          title: "2. Information We Collect",
          content: `We may collect the following data when you use our website or services:
- Personal details: name, email address, phone number.
- Booking information: dates, services purchased, preferences.
- Payment information: processed securely via third-party providers and not stored on our servers.
- Technical data: IP address, browser type, session identifiers – used solely for maintenance and security.
We do not collect sensitive data such as ID numbers or full credit card details. However, we may request information about food allergies or sensitivities solely for the purpose of adapting meals and related services during the trek. This information is stored securely and is not used for any other purpose.`
        },
        {
          title: "3. How We Use Your Information",
          content: `We use the collected data only for:
- Managing bookings and accommodation services.
- Communicating with you about confirmations, changes, or cancellations.
- Sending operational (non-marketing) notifications.
- Adapting meals and related services according to reported allergies or sensitivities.
- Improving website stability and user experience.
We do not use your data for marketing, advertising, or data resale.`
        },
        {
          title: "4. Cookies and Tracking",
          content: `Our website uses cookies strictly for session management and essential maintenance purposes, such as:
- Keeping you logged in during a session.
- Remembering language or accessibility preferences.
- Maintaining website stability and security.
We do not use cookies for advertising, analytics, or marketing.
You can manage or delete cookies through your browser settings.`
        },
        {
          title: "5. Sharing Your Information",
          content: `We may share limited data with trusted third parties solely for service operation:
- Email providers for booking confirmations and notifications.
- Mapping services (e.g., Google Maps) for route display.
- Payment processors for secure payment transactions.
These providers are authorized to use your data only to perform their specific function.`
        },
        {
          title: "6. Data Security",
          content: `We implement industry-standard security measures, including:
- HTTPS encryption for data transmission.
- Restricted access to personal data.
- Continuous monitoring and updates of security infrastructure.
While we take strong precautions, no online system is completely immune to breaches.`
        },
        {
          title: "7. Data Retention",
          content: `We retain personal data only as long as necessary to provide our services or as required by law.  
When data is no longer needed, it is securely deleted or anonymized.`
        },
        {
          title: "8. Your Rights",
          content: `You have the right to:
- Access and obtain a copy of your personal data.
- Request correction, update, or deletion of your data.
- Object to certain processing.
To exercise your rights, please contact us using the details below.`
        },
        {
          title: "9. Legal Compliance",
          content: `We comply with applicable privacy regulations, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), where relevant.`
        },
        {
          title: "10. Contact Us",
          content: `For questions or requests related to this Privacy Policy:
Email: treknahalprat@gmail.com
Phone / WhatsApp: 054-5901376`
        },
        {
          title: "11. Summary",
          content: `We collect only the minimal data necessary to provide and maintain our services.
Cookies are used only for session and maintenance purposes.
We never use personal data for marketing or tracking.
We are committed to transparency, data protection, and respect for your privacy.`
        }
      ]
    }
  };

  const pageContent = content[language];

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-desert-50 to-white py-12 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-desert-200 px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-desert-900 text-center">
              {pageContent.title}
            </h1>
            <p className="text-xl text-desert-900 text-center mt-2">
              {pageContent.lastUpdate}{" "}
              {language === "he" ? "5.11.2025" : "November 5, 2025"}
            </p>
          </div>

          <div className="px-8 py-12">
            <div className="space-y-8">
              {pageContent.sections.map((section, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
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
