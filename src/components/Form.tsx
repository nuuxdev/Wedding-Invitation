import { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

type Tprops = {
  guest: Doc<"guest">;
};

import QRCode from "qrcode";

export default function Form({ guest }: Tprops) {
  const addNew = useMutation(api.attendance.addNew);
  const [willAttend, setWillAttend] = useState<"yes" | "no" | "maybe">("yes");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!!qrCode) {
      console.log(qrCode);
      dialogRef.current?.showModal();
    }
  }, [qrCode]);

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
          setWillAttend(e.target.value as "yes" | "no" | "maybe")
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
      <dialog ref={dialogRef}>
        <img src={qrCode || undefined} alt="qrCode" width={200} height={200} />
        <button onClick={() => dialogRef.current?.close()}>X</button>
      </dialog>
    </form>
  );
}
