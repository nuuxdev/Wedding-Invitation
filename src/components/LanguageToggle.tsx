import { useLanguage } from "../LanguageContext";

export default function LanguageToggle() {
    const { lang, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="button-outline lang-toggle"
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                fontFamily: lang === 'en' ? 'var(--font-amharic-serif)' : 'var(--font-serif)',
                fontSize: '1rem',
                fontWeight: 'bold',
            }}
        >
            {lang === 'en' ? 'አማርኛ' : 'English'}
        </button>
    );
}
