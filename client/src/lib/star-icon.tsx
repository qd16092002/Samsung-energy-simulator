import React from 'react';
const GradientStar: React.FC = () => (
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
        fill="url(#paint0_linear_4402_2548)"
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
    </defs>
  </svg>
);
const GradientStarBorder: React.FC = () => (
  <svg
    width="29"
    height="29"
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.0245 1.46352C14.1741 1.00287 14.8259 1.00287 14.9755 1.46353L17.98 10.7102C18.0469 10.9162 18.2389 11.0557 18.4555 11.0557H28.1781C28.6624 11.0557 28.8638 11.6755 28.472 11.9602L20.6062 17.675C20.431 17.8023 20.3577 18.028 20.4246 18.234L23.429 27.4807C23.5787 27.9414 23.0515 28.3245 22.6596 28.0398L14.7939 22.325C14.6186 22.1977 14.3814 22.1977 14.2061 22.325L6.34038 28.0398C5.94853 28.3245 5.42129 27.9414 5.57096 27.4807L8.5754 18.234C8.64234 18.028 8.56901 17.8023 8.39377 17.675L0.528044 11.9602C0.136187 11.6755 0.337576 11.0557 0.821937 11.0557H10.5445C10.7611 11.0557 10.9531 10.9162 11.02 10.7102L14.0245 1.46352Z"
      fill="#E0E0E0"
      stroke="#E0E0E0"
      strokeWidth="0.5"
    />
  </svg>
);
export { GradientStar, GradientStarBorder };