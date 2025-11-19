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
            {!openInvitation ? (
              <div className="cover">
                <h1>Wedding Invitation</h1>
                <p>to</p>
                <h2>
                  {guest.firstName} {guest.lastName}
                </h2>
                <button onClick={() => setOpenInvitation(true)}>
                  Open Invitation
                </button>
              </div>
            ) : (
              <div className="cover">
                <h2>Abiy</h2>
                <h1>&</h1>
                <h2>Eden</h2>
              </div>
            )}
          </div>

          {openInvitation && (
            <div className="content-wrapper">
              {/* Save the Date Section */}
              <section className="text-center">
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
                    src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1470&auto=format&fit=crop"
                    alt="Abiy Sebsibe"
                  />
                  <h3>Abiy Sebsibe</h3>
                  <a href="https://www.instagram.com/henooks" target="_blank" rel="noopener noreferrer">
                    @henooks
                  </a>
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop"
                    alt="Eden Andualem"
                  />
                  <h3>Eden Andualem</h3>
                  <a href="https://www.instagram.com/henooks" target="_blank" rel="noopener noreferrer">
                    @eden
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
                <button style={{
                  marginTop: '1rem',
                  background: 'transparent',
                  border: '1px solid var(--color-crimson)',
                  color: 'var(--color-crimson)',
                  padding: '0.5rem 1.5rem',
                  cursor: 'pointer'
                }}>
                  View Map
                </button>
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
