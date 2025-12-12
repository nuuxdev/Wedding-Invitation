import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'am';

interface LanguageContextType {
    lang: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<string, Record<Language, string>> = {
    openInvitation: {
        en: "Open Invitation",
        am: "ግብዣውን ይክፈቱ"
    },
    saveTheDate: {
        en: "Save the Date",
        am: "ቀኑን ይያዙ"
    },
    days: {
        en: "Days",
        am: "ቀናት"
    },
    hours: {
        en: "Hours",
        am: "ሰዓታት"
    },
    minutes: {
        en: "Mins",
        am: "ደቂቃዎች"
    },
    seconds: {
        en: "Secs",
        am: "ሰከንዶች"
    },
    viewMap: {
        en: "View Map",
        am: "ካርታ ይመልከቱ"
    },
    ourStory: {
        en: "Our Story",
        am: "የኛ ታሪክ"
    },
    rsvp: {
        en: "RSVP",
        am: "ይመዝገቡ"
    },
    willAttend: {
        en: "Will Attend",
        am: "እመጣለሁ"
    },
    unableToAttend: {
        en: "Unable to Attend",
        am: "መምጣት አልችልም"
    },
    firstName: {
        en: "First Name",
        am: "ስም"
    },
    lastName: {
        en: "Last Name",
        am: "የአባት ስም"
    },
    phoneNumber: {
        en: "Phone Number",
        am: "ስልክ ቁጥር"
    },
    submit: {
        en: "Submit RSVP",
        am: "ይላኩ"
    },
    wishList: {
        en: "Wish List",
        am: "የምኞት መልዕክቶች"
    },
    leaveMessage: {
        en: "Leave a message for the couple",
        am: "ለሙሽሮቹ የምኞት መልእክት ያስቀምጡ"
    },
    yourName: {
        en: "Your Name",
        am: "ስምዎ"
    },
    yourMessage: {
        en: "Your Message",
        am: "መልእክትዎ"
    },
    sendWish: {
        en: "Send Wish",
        am: "መልእክት ይላኩ"
    },
    gallery: {
        en: "Gallery",
        am: "ፎቶዎች"
    },
    thankYou: {
        en: "Thank You",
        am: "እናመሰግናለን"
    },
    thankYouSub: {
        en: "For being a part of our journey",
        am: "በደስታችን ተካፋይ ስለሆኑ"
    },
    weddingInvitation: {
        en: "Wedding Invitation",
        am: "የሰርግ ጥሪ"
    },
    to: {
        en: "To",
        am: "ለ"
    },
    guestName: {
        en: "Guest Name",
        am: "የእንግዳ ስም"
    },
    willYouAttend: {
        en: "Will you attend?",
        am: "ይመጣሉ?"
    },
    yourWishMessage: {
        en: "Your Wish Message",
        am: "የምኞት መልእክትዎ"
    },
    shareYourWishes: {
        en: "Share your wishes for the couple...",
        am: "ለሙሽሮቹ መልካም ምኞትዎን ይግለጹ..."
    },
    loading: {
        en: "Loading",
        am: "በመጫን ላይ..."
    },
    attendanceConfirmed: {
        en: "Attendance Confirmed!",
        am: "መገኘትዎ ተረጋግጧል!"
    },
    saveQrCode: {
        en: "Please save this QR code and show it at the entrance on the wedding day.",
        am: "እባክዎን ይህን የQR ኮድ ያስቀምጡ እና በሰርጉ ቀን በመግቢያው ላይ ያሳዩ።"
    },
    downloadQrCode: {
        en: "Download QR Code",
        am: "የQR ኮድ ያውርዱ"
    },
    close: {
        en: "Close",
        am: "ዝጋ"
    },
    yes: {
        en: "Yes, I will attend",
        am: "አዎ፣ እመጣለሁ"
    },
    no: {
        en: "I can't make it",
        am: "መምጣት አልችልም"
    },
    maybe: {
        en: "Maybe",
        am: "እርግጠኛ አይደለሁም"
    },
    capturedMoments: {
        en: "Captured Moments",
        am: "የማይረሱ ጊዜያት"
    },
    location: {
        en: "Location",
        am: "ቦታ"
    }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>(() => {
        const saved = localStorage.getItem('app-lang');
        return (saved === 'en' || saved === 'am') ? saved : 'am';
    });

    useEffect(() => {
        localStorage.setItem('app-lang', lang);
        document.body.classList.toggle('lang-am', lang === 'am');
    }, [lang]);

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'am' : 'en');
    };

    const t = (key: string) => {
        return translations[key]?.[lang] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
