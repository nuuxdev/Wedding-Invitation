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

  if (guest === null) {
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
      {!guest ? (
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
                    <h1>Abiy</h1>
                    <p>&</p>
                    <h1>Eden</h1>
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
              {/* Save the Date Section */}
              <section className="text-center" id="save-the-date">
                <h3>Save the Date</h3>
                <Countdown date="2026-01-01" renderer={renderer} />
                <p className="uppercase" style={{ marginTop: '2rem', letterSpacing: '0.2em' }}>
                  January 1st, 2026
                </p>
              </section>

              {/* Couple Section */}
              <section className="couple-section" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <img
                    src="/5.webp"
                    alt="Abiy Sebsibe"
                  />
                  <h3>Abiy Sebsibe</h3>
                  <a href="https://www.instagram.com/henooks" target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.png" alt="Instagram" style={{ width: '24px', height: '24px', display: 'inline-block', border: 'none', borderRadius: 0, outline: 'none', boxShadow: 'none' }} />
                  </a>
                </div>
                <div>
                  <img
                    src="/bride.webp"
                    alt="Eden Andualem"
                  />
                  <h3>Eden Andualem</h3>
                  <a href="https://www.instagram.com/henooks" target="_blank" rel="noopener noreferrer">
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

              {/* Location */}
              <section className="text-center">
                <h3>The Venue</h3>
                <p>Addis Ababa, Ethiopia</p>
                <a
                  href="https://maps.app.goo.gl/Cp9uRSczVvjivXks8"
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
                  Golf Club
                </a>
              </section>

              <Form guest={guest} />
              <WishList />
              <Gallery />
            </div>
          )}
        </>
      )}
    </main>
  );
}
