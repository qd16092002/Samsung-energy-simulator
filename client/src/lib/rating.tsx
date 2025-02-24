import React, { useState } from "react";

const GradientStar: React.FC<{ filled: number }> = ({ filled }) => {
  return (
    <svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_4402_2548)">
        <path
          d="M14.0245 0.463523C14.1741 0.00286782 14.8259 0.00286996 14.9755 0.463525L17.98 9.71024C18.0469 9.91625 18.2389 10.0557 18.4555 10.0557H28.1781C28.6624 10.0557 28.8638 10.6755 28.472 10.9602L20.6062 16.675C20.431 16.8023 20.3577 17.028 20.4246 17.234L23.429 26.4807C23.5787 26.9414 23.0515 27.3245 22.6596 27.0398L14.7939 21.325C14.6186 21.1977 14.3814 21.1977 14.2061 21.325L6.34038 27.0398C5.94853 27.3245 5.42129 26.9414 5.57096 26.4807L8.5754 17.234C8.64234 17.028 8.56901 16.8023 8.39377 16.675L0.528044 10.9602C0.136187 10.6755 0.337576 10.0557 0.821937 10.0557H10.5445C10.7611 10.0557 10.9531 9.91625 11.02 9.71024L14.0245 0.463523Z"
          fill={
            filled === 1
              ? "url(#paint0_linear_4402_2548)" // Full star
              : filled === 0.5
              ? "url(#paint0_linear_half_4402_2548)" // Half star
              : "#e0e0e0" // Empty star
          }
        />
      </g>
      <defs>
        <filter
          id="filter0_d_4402_2548"
          x="0.321289"
          y="0.118042"
          width="32.3574"
          height="31.0195"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4402_2548"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4402_2548"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_4402_2548"
          x1="14.5"
          y1="-1"
          x2="11.8128"
          y2="31.369"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#29A587" />
          <stop offset="1" stopColor="#103F34" />
        </linearGradient>
        <linearGradient
          id="paint0_linear_half_4402_2548"
          x1="0"
          y1="0"
          x2="16.5"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#29A587" />
          <stop offset="1" stopColor="#e0e0e0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Rating: React.FC<{
  maxStars: number;
  value: number;
  onChange: (value: number) => void;
}> = ({ maxStars, value, onChange }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const getFilledStatus = (starIndex: number): number => {
    const starValue = starIndex + 1;
    const hover = hoverValue ?? value;
    if (hover >= starValue) return 1; // Full star
    if (hover >= starValue - 0.5) return 0.5; // Half star
    return 0; // Empty star
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // Relative x position
    const half = rect.width / 2;
    setHoverValue(index + (x < half ? 0.5 : 1));
  };

  const handleClick = (index: number) => {
    onChange(hoverValue ?? index + 1);
  };

  return (
    <div style={{ display: "flex", gap: "4px", cursor: "pointer" }}>
      {Array.from({ length: maxStars }, (_, index) => (
        <div
          key={index}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseLeave={() => setHoverValue(null)}
          onClick={() => handleClick(index)}
        >
          <GradientStar filled={getFilledStatus(index)} />
        </div>
      ))}
    </div>
  );
};

export default Rating;