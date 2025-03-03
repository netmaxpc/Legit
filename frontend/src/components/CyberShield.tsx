import React from "react";
import { cn } from "../utils/cn";

export interface CyberShieldProps extends React.SVGAttributes<SVGElement> {
  className?: string;
  glowing?: boolean;
}

export const CyberShield: React.FC<CyberShieldProps> = ({ 
  className,
  glowing = false,
  ...props 
}) => {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "w-24 h-24", 
        glowing ? "filter drop-shadow-[0_0_4px_rgba(215,215,215,0.7)]" : "",
        className
      )}
      {...props}
    >
      {/* Shield base - Chrome effect with gradient */}
      <defs>
        <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D7D7D7" />
          <stop offset="45%" stopColor="#F5F5F5" />
          <stop offset="55%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#D7D7D7" />
        </linearGradient>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#202020" />
          <stop offset="50%" stopColor="#505050" />
          <stop offset="100%" stopColor="#202020" />
        </linearGradient>
      </defs>
      
      {/* Shield base */}
      <path 
        d="M50 10 L90 30 V70 C90 90 50 110 50 110 C50 110 10 90 10 70 V30 L50 10Z" 
        fill="url(#metalGradient)" 
        stroke="url(#chromeGradient)" 
        strokeWidth="2"
        className={glowing ? "animate-pulse" : ""}
      />
      
      {/* Inner shield pattern */}
      <path 
        d="M50 20 L80 35 V65 C80 80 50 95 50 95 C50 95 20 80 20 65 V35 L50 20Z" 
        fill="none" 
        stroke="#505050" 
        strokeWidth="1" 
      />

      {/* Center emblem - simplified */}
      <path 
        d="M50 40 L65 50 L50 60 L35 50 Z" 
        fill="none" 
        stroke="#D7D7D7" 
        strokeWidth="2" 
      />
      
      {/* Center circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="8" 
        fill="#505050" 
        className={glowing ? "animate-pulse" : ""}
      />
      <circle 
        cx="50" 
        cy="50" 
        r="4" 
        fill="#F5F5F5" 
      />
      
      {/* Metal accents */}
      <path 
        d="M50 58 L50 75" 
        stroke="#D7D7D7" 
        strokeWidth="2" 
      />
      <path 
        d="M35 50 L20 50" 
        stroke="#D7D7D7" 
        strokeWidth="2" 
      />
      <path 
        d="M65 50 L80 50" 
        stroke="#D7D7D7" 
        strokeWidth="2" 
      />
      
      {/* Chrome nodes */}
      <circle cx="50" cy="75" r="3" fill="#D7D7D7" />
      <circle cx="20" cy="50" r="3" fill="#D7D7D7" />
      <circle cx="80" cy="50" r="3" fill="#D7D7D7" />
    </svg>
  );
};
