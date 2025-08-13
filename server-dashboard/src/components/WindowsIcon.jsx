import React from "react";

const WindowsIcon = ({ size = 20, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
  >
    <rect x="1" y="3" width="10" height="10" fill="#00A4EF" rx="0.5"/>
    <rect x="13" y="3" width="10" height="10" fill="#00A4EF" rx="0.5"/>
    <rect x="1" y="13" width="10" height="10" fill="#0078D6" rx="0.5"/>
    <rect x="13" y="13" width="10" height="10" fill="#0078D6" rx="0.5"/>
  </svg>
);

export default WindowsIcon;