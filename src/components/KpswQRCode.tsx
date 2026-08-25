import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface KpswQRCodeProps {
  value?: string;
  size?: number;
  className?: string;
  includeMargin?: boolean;
}

export const KpswQRCode: React.FC<KpswQRCodeProps> = ({
  value = 'https://code-game69.vercel.app/',
  size = 120,
  className = '',
  includeMargin = true,
}) => {
  // Fallback to valid URL if empty
  const qrValue = value && value.trim().length > 0
    ? value.trim()
    : 'https://code-game69.vercel.app/';

  return (
    <div className={`bg-white rounded-lg inline-flex items-center justify-center p-1 ${className}`}>
      <QRCodeSVG
        value={qrValue}
        size={size}
        level="M"
        includeMargin={includeMargin}
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
};
