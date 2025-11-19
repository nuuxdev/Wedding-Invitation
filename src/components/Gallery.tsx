export default function Gallery() {
  const images = [
    "/1.webp",
    "/2.webp",
    "/3.webp",
    "/4.webp",
    "/5.webp",
    "/6.webp",
    "/7.webp",
    "/8.webp",
    "/9.webp"
  ];
  return (
    <div className="gallery-section">
      <h3 className="text-center">Captured Moments</h3>
      <div className="gallery">
        {images.map((imageUrl, i) => (
          <img key={i} src={imageUrl} alt={`photo-${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
