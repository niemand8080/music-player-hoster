import React, { useState } from "react";

interface BlurProps {
  pos: "top" | "left" | "bottom" | "right";
  width?: string;
  height?: string;
  gradientColor?: string;
  hoverColor?: string;
  absolute?: boolean;
  visible?: boolean;
  blurPercent?: number;
  isHovered?: boolean;
}

const Blur: React.FC<BlurProps> = ({
  pos,
  width = "100%",
  height = "100%",
  gradientColor = "#1f2937",
  hoverColor = "#1f2937",
  absolute = false,
  visible = true,
  blurPercent = 33,
  isHovered = false,
}) => {
  const positionClass = {
    top: "top-0 left-0",
    left: "top-0 left-0",
    right: "top-0 right-0",
    bottom: "bottom-0 left-0",
  }[pos];

  const gradientDirection = {
    top: "to bottom",
    left: "to right",
    right: "to left",
    bottom: "to top",
  }[pos];

  const blurDimensions = pos === "right" || pos === "left"
    ? `h-full w-[${blurPercent}%]`
    : `h-[${blurPercent}%] w-full`;

  return (
    <div
      className={`
        ${absolute ? "absolute" : "sticky"}
        ${positionClass}
        ${!visible && "opacity-0"}
        z-30 transition-all duration-300
      `}
      style={{ width, height }}
    >
      <div
        className={`
          pointer-events-none absolute h-full w-full
          transition-opacity duration-300 ease-in-out
          ${isHovered ? "opacity-0" : "opacity-100"}
        `}
        style={{
          background: `linear-gradient(${gradientDirection}, ${gradientColor}, transparent)`,
        }}
      />
      <div
        className={`
          pointer-events-none absolute h-full w-full
          transition-opacity duration-300 ease-in-out
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        style={{
          background: `linear-gradient(${gradientDirection}, ${hoverColor}, transparent)`,
        }}
      />
      <div
        className={`
          absolute ${blurDimensions} ${pos}-0
          pointer-events-none backdrop-blur-[1px]
        `}
      />
    </div>
  );
};

export default Blur;
