import { useQuery } from "convex/react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import Countdown from "react-countdown";

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
      // Render a completed state
      return <div>Yayyy</div>;
    } else {
      // Render a countdown
      return (
        <span>
          {days}Days <br />
          {hours}Hours <br />
          {minutes}Minutes <br />
          {seconds}Seconds
        </span>
      );
    }
  };

  return (
    <main>
      {!guest ? (
        <div className="loading">loading...</div>
      ) : (
        <>
          <div className="hero">
            {!openInvitation ? (
              <div className="cover">
                <h1>Wedding Invitation</h1>
                to{" "}
                <h2>
                  {guest.firstName} {guest.lastName}
                </h2>
                <button onClick={() => setOpenInvitation(!openInvitation)}>
                  open invitation
                </button>
              </div>
            ) : (
              <div>
                <h2>Abiy</h2>&<h2>Eden</h2>
              </div>
            )}
          </div>
          {openInvitation && (
            <div style={{ height: "200vh" }}>
              Save the Date <br />
              <Countdown date="2026-01-01" renderer={renderer} />
              <h3>2026-01-01</h3>
              <div>
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="groom"
                  width={100}
                  height={100}
                />
                <h3>Abiy Sebsibe</h3>
                <a href="https://www.instagram.com/henooks">Insta</a>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="bride"
                  width={100}
                  height={100}
                />
                <a href="https://www.instagram.com/henooks">Insta</a>
                <h3>Eden Andualem</h3>
              </div>
              <div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Ratione, mollitia, incidunt sunt laboriosam ad est quia quod
                  adipisci nulla possimus doloremque similique accusantium
                  voluptas eligendi omnis alias dolorum ullam vel.
                </p>
              </div>
              <div>location with a button here</div>
              <form>
                <input
                  type="text"
                  value={`${guest.firstName} ${guest.lastName}`}
                />
                <select name="attendance">
                  <option value="yes">I will Attend</option>
                  <option value="no">I can't make it</option>
                  <option value="maybe">Maybe</option>
                </select>
                <textarea name="wish" id="wish"></textarea>
                <button type="submit">Submit</button>
              </form>
              <div>wish list here</div>
              <div>gallery here</div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
