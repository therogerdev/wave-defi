"use client";
import React from "react";
import { useTheme } from "next-themes";

const BackgroundEffect: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`absolute z-10 top-0 left-0 w-full h-full transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#10062F] to-[#030014]" // Dark Mode Background
          : "bg-gradient-to-b from-[#F6F2FF] to-[#EDE7FF]" // Light Mode Background
      }`}
    >
      {/* Radial Glow Effect */}
      <div
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] blur-[100px] rounded-full transition-all duration-500 ${
          theme === "dark" ? "bg-purple-700/50" : "bg-purple-300/50"
        }`}
      ></div>

      {/* Another soft light effect */}
      <div
        className={`absolute bottom-10 left-1/3 w-[600px] h-[400px] blur-[80px] rounded-full transition-all duration-500 ${
          theme === "dark" ? "bg-indigo-500/40" : "bg-indigo-300/40"
        }`}
      ></div>
    </div>
  );
};

export default BackgroundEffect;
