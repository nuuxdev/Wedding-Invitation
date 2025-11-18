import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function WishList() {
  const wishes = useQuery(api.wish.findAll);
  if (wishes === undefined) return <div>loading...</div>;

  return (
    <div>
      <h2>Wish List</h2>
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
