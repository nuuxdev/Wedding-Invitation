import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLanguage } from "../LanguageContext";

import { useState } from "react";

export default function WishList({ count }: { count?: number }) {
  const [seed] = useState(Math.random());

  const wishes = useQuery(api.wish.findAll, { count, seed });
  const { t } = useLanguage();

  if (wishes === undefined) {
    return <div className="text-center" style={{ padding: '2rem' }}>Loading wishes...</div>;
  }

  return (
    <div>
      <h3 className="text-center">{t('wishList')}</h3>
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
