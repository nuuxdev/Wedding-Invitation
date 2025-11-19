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
      <input
        type="text"
        value={`${guest.firstName} ${guest.lastName}`}
        readOnly
      />
      <select
        name="attendance"
        value={willAttend}
        onChange={(e) =>
          setWillAttend(e.target.value as TwillAttend)
        }
      >
        <option value="yes">I will Attend</option>
        <option value="no">I can't make it</option>
        <option value="maybe">Maybe</option>
      </select>
      <textarea
        name="wish"
        id="wish"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Loading" : "Submit"}
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => {
          document.body.style.overflow = "unset";
        }}
        style={{
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "green" }}>Attendance Confirmed!</h3>
        <p>Please save this QR code and show it at the entrance on the wedding day.</p>
        <div style={{ margin: "20px 0" }}>
          <img src={qrCode || undefined} alt="qrCode" width={250} height={250} />
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <a
            href={qrCode}
            download={`wedding-invite-${guest.firstName}-${guest.lastName}.png`}
            onClick={() => setDownloaded(true)}
            style={{
              textDecoration: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Download QR Code
          </a>
          {downloaded && (
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: "#f0f0f0"
              }}
            >
              Close
            </button>
          )}
        </div>
      </dialog>
    </form>
  );
}
