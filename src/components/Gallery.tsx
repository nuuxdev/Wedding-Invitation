export default function Gallery() {
  const images = [
    "/cover.png",
    "/cover.png",
    "/cover.png",
    "/cover.png",
    "/cover.png",
    "/cover.png",
    "/cover.png",
    "/cover.png",
    "/cover.png",
    "/cover.png",
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
