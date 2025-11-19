import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function WishList() {
  const wishes = useQuery(api.wish.findAll);

  if (wishes === undefined) {
    return <div className="text-center" style={{ padding: '2rem' }}>Loading wishes...</div>;
  }

  return (
    <div>
      <h3 className="text-center">Wish List</h3>
      <ul>
        {wishes.map((wish) => (
          <li key={wish._id}>
            <h4>{wish.fullName}</h4>
            <p>{wish.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
