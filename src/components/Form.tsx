import { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import QRCode from "qrcode";
import { TwillAttend } from "../../convex/attendance";
import { useLanguage } from "../LanguageContext";

export default function Form({ guest }: { guest: Doc<"guest"> }) {
  const { t, lang } = useLanguage();

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
      <div className="form-group">
        <label htmlFor="guestName">{t('guestName')}</label>
        <input
          id="guestName"
          type="text"
          value={lang === 'am' ? `${guest.firstNameAm || guest.firstName} ${guest.lastNameAm || guest.lastName}` : `${guest.firstName} ${guest.lastName}`}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="attendance">{t('willYouAttend')}</label>
        <select
          id="attendance"
          name="attendance"
          value={willAttend}
          onChange={(e) =>
            setWillAttend(e.target.value as TwillAttend)
          }
        >
          <option value="yes">{t('yes')}</option>
          <option value="no">{t('no')}</option>
          <option value="maybe">{t('maybe')}</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="wish">{t('yourWishMessage')}</label>
        <textarea
          name="wish"
          id="wish"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('shareYourWishes')}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? t('loading') : t('submit')}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          document.body.style.overflow = "unset";
        }}
      >
        <h3>{t('attendanceConfirmed')}</h3>
        <p>{t('saveQrCode')}</p>
        <div>
          <img src={qrCode || undefined} alt="qrCode" width={250} height={250} />
        </div>
        <div>
          <a
            href={qrCode}
            download={`wedding-invite-${guest.firstName}-${guest.lastName}.png`}
            onClick={() => setDownloaded(true)}
          >
            {t('downloadQrCode')}
          </a>
          {downloaded && (
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
            >
              {t('close')}
            </button>
          )}
        </div>
      </dialog>
    </form>
  );
}
