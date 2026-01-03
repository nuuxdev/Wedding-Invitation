import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLanguage } from "../LanguageContext";

import { useState } from "react";

export default function WishList({ count }: { count?: number }) {
  const [seed, setSeed] = useState(Math.random());

  const wishes = useQuery(api.wish.findAll, { count, seed });
  const { t } = useLanguage();

  if (wishes === undefined) {
    return <div className="text-center" style={{ padding: '2rem' }}>Loading wishes...</div>;
  }

  return (
    <div>
      <h3 className="text-center">{t('wishList')}</h3>
      <ul style={{ minHeight: '600px', alignContent: 'center' }}>
        {wishes.map((wish) => (
          <li key={wish._id}>
            <h4>{wish.fullName}</h4>
            <p style={{
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{wish.message}</p>
          </li>
        ))}
      </ul>
      <div className="text-center" style={{ marginTop: '2rem' }}>
        <button
          onClick={() => setSeed(Math.random())}
          className="button-outline"
        >
          {t('loadRandom')}
        </button>
      </div>
    </div>
  );
}
