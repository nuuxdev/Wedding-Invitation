import { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import QRCode from "qrcode";
import { TwillAttend } from "../../convex/attendance";

export default function Form({ guest }: { guest: Doc<"guest"> }) {

  //calls

  const addNew = useMutation(api.attendance.addNew);

  //states

  const [willAttend, setWillAttend] = useState<TwillAttend>("yes");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  //refs

  const dialogRef = useRef<HTMLDialogElement>(null);

  //hooks

  useEffect(() => {
    if (!!qrCode) {
      setDownloaded(false);
      document.body.style.overflow = "hidden";
      dialogRef.current?.showModal();
    }
  }, [qrCode]);

  //functions

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await addNew({
        guestId: guest._id,
        fullName: `${guest.firstName} ${guest.lastName}`,
        willAttend: willAttend,
        message: message,
      });
      if (response.success) {
        setMessage("");
        if (response.verifyUrl) {
          const url = await QRCode.toDataURL(response.verifyUrl, {
            errorCorrectionLevel: "H",
            width: 300,
          });
          setQrCode(url);
        }
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="form-group">
        <label htmlFor="guestName">Guest Name</label>
        <input
          id="guestName"
          type="text"
          value={`${guest.firstName} ${guest.lastName}`}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="attendance">Will you attend?</label>
        <select
          id="attendance"
          name="attendance"
          value={willAttend}
          onChange={(e) =>
            setWillAttend(e.target.value as TwillAttend)
          }
        >
          <option value="yes">Yes, I will attend</option>
          <option value="no">I can't make it</option>
          <option value="maybe">Maybe</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="wish">Your Wish Message</label>
        <textarea
          name="wish"
          id="wish"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your wishes for the couple..."
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Loading" : "Submit RSVP"}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          document.body.style.overflow = "unset";
        }}
      >
        <h3>Attendance Confirmed!</h3>
        <p>Please save this QR code and show it at the entrance on the wedding day.</p>
        <div>
          <img src={qrCode || undefined} alt="qrCode" width={250} height={250} />
        </div>
        <div>
          <a
            href={qrCode}
            download={`wedding-invite-${guest.firstName}-${guest.lastName}.png`}
            onClick={() => setDownloaded(true)}
          >
            Download QR Code
          </a>
          {downloaded && (
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
            >
              Close
            </button>
          )}
        </div>
      </dialog>
    </form>
  );
}
