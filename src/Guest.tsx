import { useQuery } from "convex/react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import Countdown from "react-countdown";
import Form from "./components/Form";
import WishList from "./components/WishList";
import Gallery from "./components/Gallery";

export default function Guest() {
  const [openInvitation, setOpenInvitation] = useState(false);
  const guestId = useParams().id;
  const navigate = useNavigate();
  const guest = useQuery(api.guest.findOne, guestId ? { id: guestId } : "skip");
  const weddingInfo = useQuery(api.weddingInfo.get);

  if (guest === null || weddingInfo === null) {
    navigate("/error");
    return null;
  }

  const location = weddingInfo?.weddingPlace?.split(',')[0]
  const city = weddingInfo?.weddingPlace?.split(',')[1]
  const country = weddingInfo?.weddingPlace?.split(',')[2]

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
            <span className="label">Days</span>
          </div>
          <div className="time-unit">
            <span className="number">{hours}</span>
            <span className="label">Hours</span>
          </div>
          <div className="time-unit">
            <span className="number">{minutes}</span>
            <span className="label">Mins</span>
          </div>
          <div className="time-unit">
            <span className="number">{seconds}</span>
            <span className="label">Secs</span>
          </div>
        </div>
      );
    }
  };

  return (
    <main>
      {!guest || !weddingInfo ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="hero">
            <div className={`visual-effects ${openInvitation ? "open" : ""}`}></div>
            <div className={`flower-decoration ${openInvitation ? "open" : ""}`}></div>
            <div className={`hero-content ${openInvitation ? "open" : ""}`}>
              {!openInvitation ? (
                <>
                  <div className="guest-title">
                    <h2>Wedding Invitation</h2>
                    <p>to</p>
                    <h1>
                      {guest.firstName} {guest.lastName}
                    </h1>
                  </div>
                  <button onClick={() => setOpenInvitation(true)}>
                    Open Invitation
                  </button>
                </>
              ) : (
                <>
                  <h1 className="bride-groom-title">Wedding</h1>
                  <div className="bride-groom-names">
                    <h1>{weddingInfo?.groomFirstName || "Groom"}</h1>
                    <p>&</p>
                    <h1>{weddingInfo?.brideFirstName || "Bride"}</h1>
                    <a href="#save-the-date" className="scroll-down-arrow">
                      <img src="/down.png" alt="Scroll Down" width={28} height={28} />
                    </a>
                  </div>

                </>
              )}
            </div>
          </div>

          {openInvitation && (
            <div className="content-wrapper">
              {/* Date & Location Section */}
              <section className="text-center" id="save-the-date">
                <h3>Save the Date</h3>
                <Countdown date={weddingInfo?.weddingDate || "2026-01-01"} renderer={renderer} />
                <p className="uppercase" style={{ marginTop: '2rem', letterSpacing: '0.2em' }}>
                  {weddingInfo?.weddingDate ? new Date(weddingInfo.weddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "January 1st, 2026"}
                </p>

                <div style={{ marginTop: '3rem' }}>
                  <h3>{location || "Location"}</h3>
                  <p><span>{city || "City"},</span><span>{country || "Country"}</span></p>
                  <a
                    href={weddingInfo?.weddingLocationLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: '1rem',
                      background: 'transparent',
                      border: '1px solid var(--color-crimson)',
                      color: 'var(--color-crimson)',
                      padding: '0.5rem 1.5rem',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'inline-block',
                      fontFamily: 'var(--font-serif)'
                    }}
                  >
                    View Map
                  </a>
                </div>
              </section>

              {/* Couple Section */}
              <section className="couple-section" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <div className="couple-image-wrapper">
                    <img
                      src="/5.webp"
                      alt={`${weddingInfo?.groomFirstName} ${weddingInfo?.groomLastName}`}
                    />
                  </div>
                  <h3>{weddingInfo?.groomFirstName} {weddingInfo?.groomLastName}</h3>
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
                  <h3>{weddingInfo?.brideFirstName} {weddingInfo?.brideLastName}</h3>
                  <a href={weddingInfo?.brideInstagram || "#"} target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.png" alt="Instagram" style={{ width: '24px', height: '24px', display: 'inline-block', border: 'none', borderRadius: 0, outline: 'none', boxShadow: 'none' }} />
                  </a>
                </div>
              </section>

              {/* Story / Intro */}
              <section className="text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3>Our Story</h3>
                <p style={{ fontStyle: 'italic', color: 'var(--color-stone)' }}>
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Ratione, mollitia, incidunt sunt laboriosam ad est quia quod
                  adipisci nulla possimus doloremque similique accusantium
                  voluptas eligendi omnis alias dolorum ullam vel."
                </p>
              </section>

              <Form guest={guest} />
              <WishList />
              <Gallery />

              {/* Thank You Section */}
              <section className="text-center" style={{ padding: 'var(--space-xl) 0' }}>
                <h2 style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', color: 'var(--color-crimson)' }}>Thank You</h2>
                <p style={{ fontSize: '1.5rem', fontStyle: 'italic', marginTop: '1rem' }}>For being a part of our journey</p>
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
