import { useQuery } from "convex/react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../convex/_generated/api";

export default function Guest() {
  const guestId = useParams().id;
  const navigate = useNavigate();
  const guest = useQuery(api.guest.findOne, guestId ? { id: guestId } : "skip");
  if (guest === undefined) {
    return <div>loading...</div>;
  }
  if (guest === null) {
    navigate("/error");
    return null;
  }
  return (
    <div>
      Hello {guest.firstName} {guest.lastName}
    </div>
  );
}
