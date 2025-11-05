import React from 'react';
import { useLanguage } from '../layout';
import config from '../config';

export default function Terms() {
  const { language } = useLanguage();
  const isRTL = language === 'he';

  const email = config.CONTACT.EMAIL;
  const phone = config.CONTACT.PHONE[language] || config.CONTACT.PHONE.en;

  const content = {
    he: {
      title: "תקנון ותנאי שימוש – Nahal Prat Trek",
      lastUpdate: "עודכן לאחרונה:",
      sections: [
        {
          title: "1. הגדרות",
          content: `במסמך זה:
"החברה" – המפעילה את שירותי Nahal Prat Trek;
"האתר" – האתר והשירותים הדיגיטליים של החברה;
"המשתמש/ת" – כל גולש/ת באתר וכל מזמין/ה שירות;
"השירותים" – שירותי לינה, הסעדה והובלת ציוד הקשורים לפעילות שטח;
"צדדים שלישיים" – ספקים חיצוניים, לרבות אתרי לינה, מסעדות, מובילים, חברות אשראי, רשויות וכו'.`
        },
        {
          title: "2. הסכמה לתנאים ושינויים",
          content: `2.1 השימוש באתר, ביצוע הזמנה או שימוש בשירותים מהווים הסכמה מלאה לתקנון זה.
2.2 החברה רשאית לעדכן או לשנות תנאים אלו מעת לעת. עדכון ייכנס לתוקף עם פרסומו באתר, והמשך שימוש לאחר מכן יהווה הסכמה לתנאים המעודכנים.`
        },
        {
          title: "3. מהות השירות והיקפו",
          content: `3.1 החברה מספקת שירותי לינה, הסעדה והובלת ציוד בלבד.
3.2 כל מידע, מפות, תיאורים או המלצות באתר או שנמסרים בעל-פה הם מידע כללי בלבד, ואינם מהווים הדרכה, פיקוח, ליווי, תיאום טיול או התחייבות לבטיחות.
3.3 החברה אינה אחראית לביצוע המסלול או לפעילות השטח של המשתמשים.
3.4 על המשתמש האחריות הבלעדית לבדוק את תנאי הדרך, מזג האוויר, רמת הקושי וההתאמה האישית לפני כל פעילות.`
        },
        {
          title: "4. כשירות ומצב בריאותי",
          content: `4.1 השירותים של החברה נועדו למטיילים המבצעים פעילות שטח באופן עצמאי וללא הדרכה.
4.2 השירותים מיועדים למבוגרים. קטינים יכולים להשתמש בשירות רק בליווי הורה או אפוטרופוס ועל אחריותם המלאה והבלעדית.
4.3 המשתמש מצהיר כי הוא אחראי בלעדית לבריאותו, כשירותו הפיזית והנפשית, וכי הוא מודע לכך שהחברה אינה בוחנת או מאשרת את כשירות המשתמש לפעילות שטח.
4.4 החברה אינה מספקת שירותי ביטוח מכל סוג, ומומלץ למשתמשים לוודא כי יש בידם ביטוח אישי מתאים (בריאות, תאונות, ציוד וכדומה).`
        },
        {
          title: "5. אחריות המשתמש והמלצות כלליות",
          content: `5.1 פעילות שטח מכל סוג היא באחריותו המלאה והבלעדית של המשתמש. החברה אינה מנחה, מדריכה, מפקחת או מבטיחה בטיחות כלשהי.
5.2 כל מידע או המלצה באתר או מטעם נציגי החברה ניתנים לצורך מידע כללי בלבד, ואינם מהווים ייעוץ מקצועי או הוראות בטיחות מחייבות.
5.3 האחריות הבלעדית לתכנון, לבדיקת תנאי הדרך, למסלול, למזג האוויר, לרמת הקושי, לציוד הדרוש ולביצוע הטיול – מוטלת על המשתמש בלבד.
5.4 המשתמש מתחייב לפעול לפי כל דין, הוראות רשויות, הנחיות בטיחות וכללי שמירת טבע, אך מובהר כי האחריות לעמידה בכך היא עליו בלבד.
5.5 החברה אינה אחראית לכל פגיעה, נזק, תאונה או אובדן שייגרמו במהלך פעילות שטח כלשהי, אף אם הוזכרו באתר מסלולים או נקודות עניין.`
        },
        {
          title: "6. הצהרת סיכון והגבלת אחריות",
          content: `6.1 פעילות שטח כרוכה בסיכונים טבעיים. המשתמש מצהיר כי הוא מודע לסיכונים ונוטל אותם על עצמו.
6.2 השירותים ניתנים "כפי שהם" (As-Is), ללא אחריות או התחייבות מכל סוג.
6.3 החברה, עובדיה ונציגיה לא יישאו באחריות לכל נזק גוף, רכוש, עקיף או תוצאתי, הנובע מהשימוש באתר או בשירותים.
6.4 אם וככל שתוטל אחריות כלשהי, היא מוגבלת לסכום ששולם בפועל בגין השירות הרלוונטי.
6.5 המשתמש מתחייב לשפות את החברה בגין כל נזק, הוצאה או דרישה עקב הפרת תנאי תקנון זה.`
        },
        {
          title: "7. צדדים שלישיים",
          content: `7.1 חלק מהשירותים מסופקים ע"י צדדים שלישיים. החברה אינה אחראית למעשיהם, איכותם או זמינותם.
7.2 תנאי השימוש של כל ספק חיצוני יחולו בנוסף לתקנון זה.`
        },
        {
          title: "8. הזמנות, מחירים ותשלומים",
          content: `8.1 ביצוע הזמנה מהווה התחייבות לתשלום מלא לפי המחירים במועד ההזמנה.
8.2 החברה רשאית לדרוש מקדמה/תשלום מלא לשריון מקום.
8.3 תשלום יבוצע באמצעים שהחברה תאפשר (כרטיס אשראי, העברה וכו').`
        },
        {
          title: "9. ביטולים, שינויים וכוח עליון",
          content: `9.1 ביטול ע"י המשתמש:
- עד 72 שעות לפני מועד השירות – החזר מלא;
- פחות מ-72 שעות – ללא החזר;
- אי-הגעה/עזיבה מוקדמת – ללא החזר.
9.2 ביטול או שינוי ע"י החברה עקב מזג אוויר חריג, כוח עליון או נסיבות חיצוניות יזכו את המשתמש בדחייה או החזר מלא לפי שיקול דעת החברה.
9.3 האמור כפוף לדין המחייב, לרבות הוראות חוק הגנת הצרכן, ככל שהן חלות.`
        },
        {
          title: "10. הובלת ציוד וחפצים",
          content: `10.1 ההובלה מבוצעת לפי הצהרת הלקוח על תכולת הציוד. אסור להוביל:
- כלי נשק מכל סוג;
- חומרי נפץ, חומרים מסוכנים או דליקים;
- סמים או חומרים אסורים על פי חוק;
- תכשיטים, מזומן או פריטי ערך גבוה ללא אישור מראש;
- מסמכים רשמיים חיוניים (דרכון, תעודת זהות);
- כל חומר שהובלתו אסורה על פי חוק.
10.2 החברה אינה אחראית לאובדן או נזק הנובע מאריזה לקויה, כוח עליון או נסיבות שאינן בשליטתה.
10.3 ציוד שנמצא במתחם יישמר פרק זמן סביר; איסוף – באחריות ובעלות הלקוח.
10.4 נזק לרכוש החברה יחויב לפי שיקול דעתה.`
        },
        {
          title: "11. לינה והתנהלות במתחמים",
          content: `11.1 זמני צ׳ק-אין/צ׳ק-אאוט ייקבעו מראש.
11.2 חובה לשמור על שקט, ניקיון והתנהגות נאותה.
11.3 הכנסת חיות מחמד רק באישור מראש.
11.4 שימוש לא זהיר בתשתיות או ציוד עלול להביא לחיוב או להפסקת השירות.`
        },
        {
          title: "12. שימוש באתר",
          content: `12.1 האתר לשימוש אישי בלבד. אין להעתיק, להפיץ, לשנות או לעשות שימוש מסחרי בתכניו ללא רשות בכתב מהחברה.
12.2 חל איסור לבצע פעולות אוטומטיות (כגון גרידת נתונים) או להעלות תכנים לא חוקיים או פוגעניים.
12.3 החברה רשאית לחסום גישה למשתמש שהפר תנאי שימוש או ביצע פעולה בלתי חוקית.`
        },
        {
          title: "13. תוכן גולשים, צילום ושימוש מסחרי",
          content: `13.1 משתמש המעלה תוכן מצהיר כי הוא בעל הזכויות בו.
13.2 החברה רשאית להשתמש בתוכן לצרכים שיווקיים באופן שאינו פוגע בזכויות המשתמש.
13.3 ניתן לפנות בבקשה להסרת תמונה או תוכן, והחברה תפעל בהתאם.
13.4 החברה עשויה לצלם במתחמים לצרכי שיווק ותיעוד. משתמש המתנגד לצילומו מתבקש להודיע מראש. תמונות לא יפורסמו כאשר המשתמש מזוהה באופן אישי ללא קבלת אישורו המפורש.`
        },
        {
          title: "14. קניין רוחני",
          content: `14.1 כל זכויות היוצרים, סימני המסחר, התמונות, העיצוב והקוד באתר הם רכוש החברה או צדדים שלישיים מורשים.
14.2 אין להשתמש בתכנים ללא אישור מראש ובכתב.`
        },
        {
          title: "15. פרטיות ושמירת מידע",
          content: `15.1 לצורך ניהול השירותים וההזמנות, החברה רשאית לאסוף, לשמור ולעבד מידע אישי שמוסר המשתמש ביודעין – לרבות שם, טלפון, דוא"ל, פרטי תשלום (באמצעות ספקי סליקה חיצוניים בלבד), ופרטי הזמנה.
15.2 המידע יישמר במאגרי החברה בהתאם לחוק הגנת הפרטיות, התשמ"א–1981.
15.3 החברה לא תעביר מידע אישי לצדדים שלישיים, אלא במקרים אלה בלבד:
א. לשם השלמת העסקה ומתן השירות בפועל;
ב. אם המשתמש ביצע מעשה או מחדל הפוגעים או העלולים לפגוע בחברה או בצדדים שלישיים;
ג. לשם עמידה בצו שיפוטי או דרישה חוקית;
ד. במסגרת מחלוקת או הליך משפטי בין החברה למשתמש;
ה. לצורך ניתוח נתונים סטטיסטיים, ובלבד שהמידע יוצג באופן שאינו מזהה את המשתמש הספציפי;
ו. לספקי תשלום (חברות אשראי, מעבדי תשלומים וכו') אך ורק לצורך ביצוע העסקה.
15.4 החברה רשאית להשתמש בפרטי ההתקשרות של המשתמש לצורך שליחת הודעות שירות ותפעול (אישור, ביטול, עדכון).
15.5 דיוור שיווקי יישלח רק בכפוף להסכמה מפורשת של המשתמש ובהתאם לחוק התקשורת (בזק ושידורים), תשמ"ב–1982, ותמיד ניתן להסירו.
15.6 החברה נוקטת באמצעי אבטחת מידע סבירים, אך אינה יכולה להבטיח חסינות מוחלטת מפני חדירות למערכותיה.
15.7 במקרים שאינם בשליטת החברה ו/או הנובעים מכוח עליון, החברה לא תישא באחריות לכל נזק שייגרם עקב אובדן מידע או שימוש בלתי מורשה בו.
15.8 בעצם השימוש באתר, המשתמש מביע הסכמה לשמירה ולעיבוד של המידע כמפורט לעיל.`
        },
        {
          title: "16. תקשורת אלקטרונית",
          content: `16.1 מסירת פרטי התקשרות מהווה הסכמה לקבלת הודעות תפעוליות ודיוור שירות (אישור הזמנה, ביטול, עדכון וכיו"ב).
16.2 ניתן בכל עת להסיר הרשמה מדיוור שיווקי.`
        },
        {
          title: "17. יישוב מחלוקות, דין וסמכות שיפוט",
          content: `17.1 הצדדים יפעלו תחילה לפתרון מחלוקות במו"מ ישיר בתום לב.
17.2 אם לא הושג פתרון – סמכות השיפוט הבלעדית לבתי המשפט המוסמכים בירושלים.
17.3 על התקנון יחול הדין הישראלי בלבד.`
        },
        {
          title: "18. שונות",
          content: `18.1 כותרות הסעיפים נועדו לנוחות בלבד.
18.2 אם ייקבע שסעיף מסוים בטל – יתר הסעיפים יישארו בתוקף.
18.3 אי-מימוש זכות אינו מהווה ויתור.
18.4 החברה רשאית להסב זכויותיה לאחר, ללא צורך באישור המשתמש.
18.5 נוסח זה מהווה את מלוא ההסכמות בין הצדדים ומחליף כל מצג קודם.
18.6 במקרה של סתירה, נוסח התקנון בעברית יגבר.`
        },
        {
          title: "19. יצירת קשר",
          content: `דוא"ל: ${email}
טלפון / וואטסאפ: ${phone}`
        }
      ]
    },

    en: {
      title: "Terms and Conditions – Nahal Prat Trek",
      lastUpdate: "Last updated:",
      sections: [
        {
          title: "1. Definitions",
          content: `In this document:
"Company" – the operator of Nahal Prat Trek services;
"Website" – the Company's website and digital services;
"User" – any site visitor and any person placing an order;
"Services" – accommodation, catering, and equipment transport related to outdoor activity;
"Third Parties" – external providers including lodging sites, restaurants, carriers, payment processors, authorities, etc.`
        },
        {
          title: "2. Acceptance of Terms and Changes",
          content: `2.1 Using the Website, placing an order, or using the Services constitutes full acceptance of these Terms.
2.2 The Company may amend these Terms from time to time. Changes take effect upon publication on the Website; continued use constitutes acceptance.`
        },
        {
          title: "3. Nature and Scope of Services",
          content: `3.1 The Company provides accommodation, catering, and equipment transport only.
3.2 Any information, maps, descriptions, or recommendations on the Website or given orally are general information only and do not constitute guiding, supervision, escort, trip coordination, or any safety commitment.
3.3 The Company is not responsible for users' hiking or field activity.
3.4 The User is solely responsible to verify trail conditions, weather, difficulty level, and personal suitability before any activity.`
        },
        {
          title: "4. Fitness and Health",
          content: `4.1 The Services are intended for users conducting outdoor activity independently and without guiding.
4.2 Services are intended for adults. Minors may use the Services only when accompanied by a parent or guardian, at their full and exclusive responsibility.
4.3 The User is solely responsible for their physical and mental fitness; the Company does not assess or approve fitness for outdoor activity.
4.4 The Company does not provide insurance of any kind; users are advised to maintain appropriate personal insurance (health, accident, gear).`
        },
        {
          title: "5. User Responsibility and General Recommendations",
          content: `5.1 All outdoor activity is at the User's sole and exclusive responsibility. The Company does not instruct, guide, supervise, or guarantee safety.
5.2 Any information or recommendations by the Company are for general information only and do not constitute professional advice or binding safety instructions.
5.3 The User bears exclusive responsibility for planning, checking route conditions, weather, difficulty level, equipment (e.g., water, food, footwear, lighting), and carrying out the trip.
5.4 The User must comply with applicable law, authority directives, safety guidelines, and nature protection rules; compliance is solely the User's responsibility.
5.5 The Company is not liable for any injury, damage, accident, or loss occurring during any outdoor activity, even if routes or points of interest are mentioned on the Website.`
        },
        {
          title: "6. Assumption of Risk and Limitation of Liability",
          content: `6.1 Outdoor activity involves inherent risks. The User acknowledges and assumes such risks.
6.2 The Services are provided "as is" without any warranties.
6.3 The Company, its employees, and representatives shall not be liable for bodily, property, indirect, or consequential damage arising from use of the Website or Services.
6.4 If any liability is imposed, it is limited to the amount actually paid for the relevant Service.
6.5 The User shall indemnify the Company for any loss, cost, or claim arising from breach of these Terms.`
        },
        {
          title: "7. Third Parties",
          content: `7.1 Portions of the Services may be provided by third parties; the Company is not responsible for their acts, quality, or availability.
7.2 Third-party terms apply in addition to these Terms.`
        },
        {
          title: "8. Orders, Pricing, and Payments",
          content: `8.1 Placing an order constitutes a commitment to full payment according to prices at the time of order.
8.2 The Company may require a deposit/full prepayment to reserve a spot.
8.3 Payment is made via methods enabled by the Company (credit card, transfer, etc.).`
        },
        {
          title: "9. Cancellations, Changes, and Force Majeure",
          content: `9.1 User cancellations:
- Up to 72 hours before the service – full refund;
- Less than 72 hours – no refund;
- No-show/early departure – no refund.
9.2 Company cancellations/changes due to severe weather, force majeure, or external circumstances: postponement or full refund at the Company's discretion.
9.3 Subject to mandatory law, including Israeli Consumer Protection Law, where applicable.`
        },
        {
          title: "10. Gear Transport and Items",
          content: `10.1 Transport is based on the client's declaration of contents. The following items are strictly prohibited:
- Weapons of any kind;
- Explosives, hazardous, or flammable materials;
- Drugs or illegal substances;
- Jewelry, cash, or high-value items without prior approval;
- Essential official documents (passport, ID card);
- Any items prohibited by law.
10.2 The Company is not responsible for loss/damage due to poor packing, force majeure, or circumstances beyond its control.
10.3 Found items will be kept for a reasonable period; collection is at the client's expense/responsibility.
10.4 Damage to Company property will be charged at the Company's discretion.`
        },
        {
          title: "11. Lodging and Conduct",
          content: `11.1 Check-in/check-out times are set in advance.
11.2 Users must maintain quiet, cleanliness, and proper behavior.
11.3 Pets only with prior approval.
11.4 Careless use of infrastructure/equipment may result in charges or service termination.`
        },
        {
          title: "12. Website Use",
          content: `12.1 The Website is for personal use only; copying, distributing, modifying, or commercial use without written approval is prohibited.
12.2 Automated actions (e.g., scraping) or uploading unlawful/offensive content are prohibited.
12.3 The Company may block access for violations or unlawful activity.`
        },
        {
          title: "13. User Content, Photography, and Commercial Use",
          content: `13.1 Users uploading content represent that they hold the rights.
13.2 The Company may use content for marketing in a manner that does not infringe users' rights.
13.3 Users may request removal of content/photos; the Company will act accordingly.
13.4 The Company may photograph on premises for marketing and documentation purposes. Users who object to being photographed should notify in advance. Photos will not be published when the User is personally identifiable without their explicit consent.`
        },
        {
          title: "14. Intellectual Property",
          content: `14.1 All copyrights, trademarks, images, design, and code on the Website belong to the Company or licensed third parties.
14.2 No use may be made without prior written approval.`
        },
        {
          title: "15. Privacy and Data Protection",
          content: `15.1 To operate the Services and orders, the Company may collect, store, and process personal data provided knowingly by the User—name, phone, email, payment details (via external processors only), and order details.
15.2 Data is stored in the Company's databases in accordance with the Israeli Privacy Protection Law, 1981.
15.3 Personal data will not be shared with third parties except:
(a) to complete the transaction/provide the Service;
(b) where the User harms or may harm the Company/others;
(c) to comply with a court order/legal request;
(d) in disputes/proceedings between the User and the Company;
(e) for statistical/analytical purposes, provided the data is non-identifying;
(f) to payment processors (credit card companies, payment gateways, etc.) solely for transaction processing.
15.4 The Company may use contact details to send operational/service messages (confirmation, cancellation, updates). Marketing communications will be sent only with explicit consent (opt-in) and may be unsubscribed at any time.
15.5 Reasonable security measures are implemented, but absolute protection cannot be guaranteed; in force majeure events the Company shall not be liable for loss/unauthorized use of data.
15.6 By using the Website, the User consents to the collection, storage, and processing of personal data as described.`
        },
        {
          title: "16. Electronic Communications",
          content: `16.1 Providing contact details constitutes consent to receive operational/service messages (order confirmations, cancellations, updates).
16.2 Users may unsubscribe from marketing messages at any time.`
        },
        {
          title: "17. Dispute Resolution, Governing Law, and Jurisdiction",
          content: `17.1 Parties will first attempt to resolve disputes through good-faith negotiations.
17.2 Failing that, exclusive jurisdiction lies with the competent courts in Jerusalem.
17.3 Israeli law exclusively governs these Terms.`
        },
        {
          title: "18. Miscellaneous",
          content: `18.1 Section headings are for convenience only.
18.2 If any provision is held invalid, the remainder shall remain in force.
18.3 Failure to exercise a right is not a waiver.
18.4 The Company may assign its rights without User consent.
18.5 These Terms constitute the entire agreement and supersede prior representations.
18.6 In case of conflict, the Hebrew version prevails.`
        },
        {
          title: "19. Contact",
          content: `Email: ${email}
Phone / WhatsApp: ${phone}`
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