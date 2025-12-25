import { useLanguage } from "../LanguageContext";

export default function Gallery() {
  const { t } = useLanguage();
  const images = Array.from({ length: 18 }, (_, i) => `/${i + 1}.webp`);
  return (
    <div className="gallery-section">
      <h3 className="text-center">{t('capturedMoments')}</h3>
      <div className="gallery">
        {images.map((imageUrl, i) => (
          <img key={i} src={imageUrl} alt={`photo-${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
