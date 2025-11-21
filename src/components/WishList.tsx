import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLanguage } from "../LanguageContext";

export default function WishList() {
  const wishes = useQuery(api.wish.findAll);
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
