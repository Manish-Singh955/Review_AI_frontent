import QRCode from 'react-qr-code';

const QRCodeGenerator = ({ qrCode }) => {
  const appUrl = (import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin).replace(/\/+$/, '');
  const qrUrl = `${appUrl}/review/${qrCode}`;

  const downloadQrCode = () => {
    const svg = document.getElementById(`qr-${qrCode}`);

    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${qrCode}.png`;
      link.click();

      URL.revokeObjectURL(url);
    };

    image.src = url;
  };

  return (
    <div className="qr-block">
      <div className="qr-preview">
        <QRCode id={`qr-${qrCode}`} value={qrUrl} size={180} />
      </div>

      <p className="qr-url">{qrUrl}</p>

      <div className="qr-actions">
        <a href={qrUrl} target="_blank" rel="noreferrer" className="link-button">
          Preview QR
        </a>
        <button type="button" className="secondary-button" onClick={downloadQrCode}>
          Download QR
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
