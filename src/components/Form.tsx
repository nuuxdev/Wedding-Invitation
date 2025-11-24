import { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import QRCodeStyling from "qr-code-styling";
import { TwillAttend } from "../../convex/attendance";
import { useLanguage } from "../LanguageContext";

export default function Form({ guest, weddingInfo }: { guest: Doc<"guest">, weddingInfo: Doc<"weddingInfo"> }) {
  const { t, lang } = useLanguage();

  //calls

  const addNew = useMutation(api.attendance.addNew);
  const generateUploadUrl = useMutation(api.attendance.generateUploadUrl);
  const saveQrCode = useMutation(api.attendance.saveQrCode);
  const attendance = useQuery(api.attendance.getByGuestId, { guestId: guest._id });

  //states

  const [willAttend, setWillAttend] = useState<TwillAttend>("yes");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  //refs

  const dialogRef = useRef<HTMLDialogElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  //hooks

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 300,
      height: 300,
      type: "svg",
      data: "",
      image: "/wedding-rings.svg",
      dotsOptions: {
        type: "extra-rounded",
        gradient: {
          type: "linear",
          rotation: 45,
          colorStops: [{ offset: 0, color: "#ff6b6b" }, { offset: 1, color: "#b93b48" }]
        }
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.4,
        hideBackgroundDots: true
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#b93b48"
      },
      cornersDotOptions: {
        type: "dot",
        color: "#b93b48"
      },
      qrOptions: {
        mode: "Byte",
        errorCorrectionLevel: "L"
      }
    });
  }, [weddingInfo]);

  useEffect(() => {
    if (!!qrCodeUrl) {
      if (!attendance) {
        document.body.style.overflow = "hidden";
        dialogRef.current?.showModal();
      }

      // Update QR code data and append to DOM
      if (qrCode.current && qrRef.current) {
        qrCode.current.update({
          data: qrCodeUrl
        });
        qrRef.current.innerHTML = "";
        qrCode.current.append(qrRef.current);
      }
    }
  }, [qrCodeUrl, attendance]);

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
          setQrCodeUrl(response.verifyUrl);

          // Generate QR code blob and upload
          const uploadQrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            type: "svg",
            data: response.verifyUrl,
            image: "/wedding-rings.svg",
            dotsOptions: {
              type: "extra-rounded",
              gradient: {
                type: "linear",
                rotation: 45,
                colorStops: [{ offset: 0, color: "#ff6b6b" }, { offset: 1, color: "#b93b48" }]
              }
            },
            backgroundOptions: {
              color: "#ffffff",
            },
            imageOptions: {
              crossOrigin: "anonymous",
              margin: 5,
              imageSize: 0.4,
              hideBackgroundDots: true
            },
            cornersSquareOptions: {
              type: "extra-rounded",
              color: "#b93b48"
            },
            cornersDotOptions: {
              type: "dot",
              color: "#b93b48"
            },
            qrOptions: {
              mode: "Byte",
              errorCorrectionLevel: "L"
            }
          });

          // Wait for a moment to ensure rendering (especially image loading)
          await new Promise(resolve => setTimeout(resolve, 500));

          const blob = await uploadQrCode.getRawData("png");
          if (blob) {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
              method: "POST",
              headers: { "Content-Type": "image/png" },
              body: blob as Blob,
            });
            const { storageId } = await result.json();
            await saveQrCode({ guestId: guest._id, storageId });
          }
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

  const handleDownload = async () => {
    if (qrCode.current) {
      await qrCode.current.download({ name: `wedding-invite-${guest.firstName}-${guest.lastName}`, extension: "png" });
    }
  };

  if (attendance) {
    return (
      <div className="text-center" style={{ padding: '2rem', background: 'var(--color-cream)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h3>{t('attendanceConfirmed')}</h3>
        <p>{t('saveQrCode')}</p>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          {attendance.qrCodeUrl ? (
            <img src={attendance.qrCodeUrl} alt="QR Code" width={300} height={300} />
          ) : (
            <div ref={qrRef}></div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={async () => {
              if (attendance.qrCodeUrl) {
                try {
                  const response = await fetch(attendance.qrCodeUrl);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `wedding-invite-${guest.firstName}-${guest.lastName}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error("Download failed:", error);
                  // Fallback to opening in new tab if fetch fails
                  window.open(attendance.qrCodeUrl, '_blank');
                }
              } else {
                handleDownload();
              }
            }}
            className="button-outline"
            style={{ marginBottom: '1rem', marginRight: '1rem' }}
          >
            {t('downloadQrCode')}
          </button>
        </div>
      </div>
    );
  }

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
        <div ref={qrRef} style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}></div>
        <div>
          <button
            type="button"
            onClick={handleDownload}
            className="button-outline"
            style={{ marginBottom: '1rem', marginRight: '1rem' }}
          >
            {t('downloadQrCode')}
          </button>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            {t('close')}
          </button>
        </div>
      </dialog>
    </form>
  );
}
