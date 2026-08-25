import React from 'react';

interface KpswLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
}

export const KpswLogo: React.FC<KpswLogoProps> = ({
  size = 'sm',
  showSubtitle = false,
  className = '',
}) => {
  // Dimensions & font scales for each size preset
  const config = {
    xs: {
      width: 'w-20',
      maxW: '85px',
      kpswClass: 'text-[18px] sm:text-[20px]',
      estClass: 'text-[7px] sm:text-[8px] tracking-[0.25em]',
      subClass: 'text-[8px]',
      gap: 'gap-0',
    },
    sm: {
      width: 'w-28',
      maxW: '115px',
      kpswClass: 'text-[24px] sm:text-[28px]',
      estClass: 'text-[9px] sm:text-[10px] tracking-[0.28em]',
      subClass: 'text-[9px]',
      gap: 'gap-0',
    },
    md: {
      width: 'w-36',
      maxW: '150px',
      kpswClass: 'text-[32px] sm:text-[38px]',
      estClass: 'text-[11px] sm:text-[13px] tracking-[0.3em]',
      subClass: 'text-[10px]',
      gap: 'gap-0.5',
    },
    lg: {
      width: 'w-52',
      maxW: '220px',
      kpswClass: 'text-[46px] sm:text-[54px]',
      estClass: 'text-[15px] sm:text-[18px] tracking-[0.32em]',
      subClass: 'text-[11px]',
      gap: 'gap-1',
    },
    xl: {
      width: 'w-64',
      maxW: '280px',
      kpswClass: 'text-[56px] sm:text-[66px]',
      estClass: 'text-[18px] sm:text-[22px] tracking-[0.35em]',
      subClass: 'text-[13px]',
      gap: 'gap-1.5',
    },
  }[size];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none text-center ${className}`}
      title="โรงเรียนกำแพงแสนวิทยา • KPSW EST.1962"
    >
      {/* Main KPSW EST.1962 Logo Box - Guaranteed 100% Unclipped */}
      <div className={`flex flex-col items-center justify-center leading-none ${config.gap} px-1.5 py-0.5`}>
        {/* KPSW Main Text */}
        <span
          className={`font-black uppercase text-[#006837] tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.22)] ${config.kpswClass}`}
          style={{
            fontFamily: "'Arial Black', 'Impact', 'Franklin Gothic Heavy', 'Segoe UI Black', sans-serif",
            fontWeight: 900,
            lineHeight: 0.95,
          }}
        >
          KPSW
        </span>

        {/* EST. 1962 Subtitle Text */}
        <span
          className={`font-black uppercase text-[#006837] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.18)] ${config.estClass}`}
          style={{
            fontFamily: "'Arial Black', 'Impact', 'Franklin Gothic Heavy', 'Segoe UI Black', sans-serif",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          EST. 1962
        </span>
      </div>

      {/* Optional Thai School Name & Department Subtitles */}
      {showSubtitle && (
        <div className="flex flex-col items-center mt-1 text-center">
          <span className={`font-bold text-[#006837] tracking-wide ${config.subClass}`}>
            โรงเรียนกำแพงแสนวิทยา • KPSW EST.1962
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี
          </span>
        </div>
      )}
    </div>
  );
};
