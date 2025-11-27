import { useQuery } from "convex/react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import Countdown from "react-countdown";
import Form from "./components/Form";
import WishList from "./components/WishList";
import Gallery from "./components/Gallery";
import { useLanguage } from "./LanguageContext";
import LanguageToggle from "./components/LanguageToggle";
import { formatEthiopianDate } from "./utils/ethiopianDate";
import BackgroundMusic from "./components/BackgroundMusic";

export default function Guest() {
  const [openInvitation, setOpenInvitation] = useState(false);
  const guestId = useParams().id;
  const navigate = useNavigate();
  const guest = useQuery(api.guest.findOne, guestId ? { id: guestId } : "skip");
  const weddingInfo = useQuery(api.weddingInfo.get);
  const { t, lang } = useLanguage();

  if (guest === null || weddingInfo === null) {
    navigate("/error");
    return null;
  }

  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      return <div className="completed-message">The Celebration Has Begun!</div>;
    } else {
      return (
        <div className="countdown-grid">
          <div className="time-unit">
            <span className="number">{days}</span>
            <span className="label">{t('days')}</span>
          </div>
          <div className="time-unit">
            <span className="number">{hours}</span>
            <span className="label">{t('hours')}</span>
          </div>
          <div className="time-unit">
            <span className="number">{minutes}</span>
            <span className="label">{t('minutes')}</span>
          </div>
          <div className="time-unit">
            <span className="number">{seconds}</span>
            <span className="label">{t('seconds')}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <main>
      <BackgroundMusic />
      {!guest || !weddingInfo ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {/* Hero Section */}
          <section className={`hero ${openInvitation ? "open" : ""}`}>
            <div className={`visual-effects ${openInvitation ? "open" : ""}`}></div>
            <div className={`flower-decoration ${openInvitation ? "open" : ""}`}></div>
            <LanguageToggle />
            <div className={`hero-content ${openInvitation ? "open" : ""}`}>
              <>

                {openInvitation && (
                  <>
                    <h2>{t('weddingInvitation')}</h2>
                    <div className="bride-groom-names">
                      <h1>{lang === 'am' ? (weddingInfo?.groomFirstNameAm || weddingInfo?.groomFirstName) : weddingInfo?.groomFirstName}</h1>
                      <span className="ampersand">&</span>
                      <h1>{lang === 'am' ? (weddingInfo?.brideFirstNameAm || weddingInfo?.brideFirstName) : weddingInfo?.brideFirstName}</h1>
                      <a href="#save-the-date" className="scroll-down-arrow">
                        <img src="/down.png" alt="Scroll Down" width={28} height={28} />
                      </a>
                    </div>
                  </>
                )}
                {!openInvitation && (
                  <div className="guest-title">
                    <h2>{t('weddingInvitation')}</h2>
                    <p>{t('to')}</p>
                    <h1>
                      {lang === 'am' ? (guest?.firstNameAm || guest?.firstName) : guest?.firstName} {lang === 'am' ? (guest?.lastNameAm || guest?.lastName) : guest?.lastName}
                    </h1>
                  </div>
                )}
              </>

              {!openInvitation && (
                <button onClick={() => setOpenInvitation(true)}>
                  {t('openInvitation')}
                </button>
              )}


            </div>
            <div className="hero-overlay"></div>
          </section>

          {openInvitation && (
            <div className="content-scroll">
              {/* Save the Date & Location */}
              <section id="save-the-date" className="text-center" style={{ padding: 'var(--space-xl) 0' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t('saveTheDate')}</h2>
                <div className="countdown-container" style={{ margin: '2rem 0' }}>
                  <Countdown
                    date={new Date(weddingInfo?.weddingDate || Date.now())}
                    renderer={renderer}
                  />
                </div>
                <div style={{ marginTop: '2rem' }}>
                  <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {lang === 'am'
                      ? formatEthiopianDate(new Date(weddingInfo?.weddingDate || Date.now()))
                      : new Date(weddingInfo?.weddingDate || Date.now()).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                    }
                  </p>
                </div>

                <div style={{ marginTop: '4rem', display: "grid", placeItems: "center" }}>
                  <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t('location')}</h2>
                  <img src="/location.png" alt="Location" style={{ width: '60px', marginBottom: '1rem' }} />
                  <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                    {lang === 'am' ? (weddingInfo?.weddingPlaceAm || weddingInfo?.weddingPlace) : weddingInfo?.weddingPlace}
                  </p>
                  <a
                    href={weddingInfo?.weddingLocationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-outline"
                    style={{ marginTop: '1.5rem', display: 'inline-block' }}
                  >
                    {t('viewMap')}
                  </a>
                </div>
              </section>

              {/* Couple Section */}
              <section className="couple-section" style={{ display: 'flex', justifyContent: 'center', gap: '8rem', flexWrap: 'wrap' }}>
                <div>
                  <div className="couple-image-wrapper">
                    <img
                      src="/5.webp"
                      alt={`${weddingInfo?.groomFirstName} ${weddingInfo?.groomLastName}`}
                    />
                  </div>
                  <h3>{lang === 'am' ? (weddingInfo?.groomFirstNameAm || weddingInfo?.groomFirstName) : weddingInfo?.groomFirstName} {lang === 'am' ? (weddingInfo?.groomLastNameAm || weddingInfo?.groomLastName) : weddingInfo?.groomLastName}</h3>
                  <a href={weddingInfo?.groomInstagram || "#"} target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.png" alt="Instagram" style={{ width: '24px', height: '24px', display: 'inline-block', border: 'none', borderRadius: 0, outline: 'none', boxShadow: 'none' }} />
                  </a>
                </div>
                <div>
                  <div className="couple-image-wrapper">
                    <img
                      src="/bride.webp"
                      alt={`${weddingInfo?.brideFirstName} ${weddingInfo?.brideLastName}`}
                    />
                  </div>
                  <h3>{lang === 'am' ? (weddingInfo?.brideFirstNameAm || weddingInfo?.brideFirstName) : weddingInfo?.brideFirstName} {lang === 'am' ? (weddingInfo?.brideLastNameAm || weddingInfo?.brideLastName) : weddingInfo?.brideLastName}</h3>
                  <a href={weddingInfo?.brideInstagram || "#"} target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.png" alt="Instagram" style={{ width: '24px', height: '24px', display: 'inline-block', border: 'none', borderRadius: 0, outline: 'none', boxShadow: 'none' }} />
                  </a>
                </div>
              </section>

              {/* Quote Section */}
              <section className="text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <p style={{ fontSize: '1.2rem', lineHeight: 1.8, fontStyle: 'italic', fontFamily: 'serif', color: 'var(--color-stone)' }}>
                  "No one has ever seen God: but if we love one another, God lives in us and his love is complete in us. -1 John 4:12"
                </p>
              </section>

              <Form guest={guest} weddingInfo={weddingInfo} />
              <WishList />
              <Gallery />

              {/* Thank You Section */}
              <section className="text-center" style={{ padding: 'var(--space-xl) 0' }}>
                <h2 style={{ fontSize: lang === 'am' ? 'clamp(3rem, 8vw, 5rem)' : 'clamp(4rem, 10vw, 6rem)', color: 'var(--color-crimson)' }}>{t('thankYou')}</h2>
                <p style={{ fontSize: '1.5rem', fontStyle: 'italic', marginTop: '1rem' }}>{t('thankYouSub')}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', opacity: 0.6 }}>
                  <img src="/floral.png" alt="decoration" width={80} />
                </div>
              </section>

              <footer className="text-center" style={{ padding: '2rem', marginTop: '2rem', borderTop: '1px solid var(--color-gold-dim)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-stone)' }}>
                  &copy; {new Date().getFullYear()} <a href="https://nuuxdev.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-crimson)', textDecoration: 'none', fontWeight: 'bold' }}>NuuX</a>. All Rights Reserved.
                </p>
              </footer>
            </div>
          )}
        </>
      )}
    </main>
  );
}
