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
  const [loading, setLoading] = useState(false);

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

      setMessage("");
      alert(`${response.success ? "Success" : "Error"}: ${response.message}`);
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setLoading(false);
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
      <button type="submit" disabled={loading}>
        {loading ? "Loading" : "Submit"}
      </button>
    </form>
  );
}
