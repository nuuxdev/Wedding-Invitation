import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

type Tprops = {
  guest: Doc<"guest">;
};

export default function Form({ guest }: Tprops) {
  const addNew = useMutation(api.attendance.addNew);
  const [willAttend, setWillAttend] = useState<"yes" | "no" | "maybe">("yes");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await addNew({
        guestId: guest._id,
        fullName: `${guest.firstName} ${guest.lastName}`,
        willAttend: willAttend,
        message: message,
      });

      // Optionally reset form or show success message
      setMessage("");
      alert("submitted successfully");
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Submit</button>
    </form>
  );
}
