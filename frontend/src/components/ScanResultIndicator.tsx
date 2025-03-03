import React from "react";
import { cn } from "../utils/cn";

type ThreatLevel = "scanning" | "safe" | "suspicious" | "dangerous" | "unknown";

export interface ScanResultIndicatorProps {
  status: ThreatLevel;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const getStatusConfig = (status: ThreatLevel) => {
  switch (status) {
    case "scanning":
      return {
        color: "bg-cyan-500",
        textColor: "text-cyan-500",
        borderColor: "border-cyan-500",
        shadowColor: "shadow-cyan-500/50",
        label: "Scanning",
        icon: (
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ),
      };
    case "safe":
      return {
        color: "bg-green-500",
        textColor: "text-green-500",
        borderColor: "border-green-500",
        shadowColor: "shadow-green-500/50",
        label: "Safe",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      };
    case "suspicious":
      return {
        color: "bg-yellow-500",
        textColor: "text-yellow-500",
        borderColor: "border-yellow-500",
        shadowColor: "shadow-yellow-500/50",
        label: "Suspicious",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      };
    case "dangerous":
      return {
        color: "bg-metal-chrome",
        textColor: "text-metal-chrome",
        borderColor: "border-metal-chrome",
        shadowColor: "shadow-red-500/50",
        label: "Dangerous",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    default:
      return {
        color: "bg-gray-400",
        textColor: "text-gray-400",
        borderColor: "border-gray-400",
        shadowColor: "shadow-gray-400/50",
        label: "Unknown",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
  }
};

export const ScanResultIndicator: React.FC<ScanResultIndicatorProps> = ({
  status,
  className,
  size = "md",
  showLabel = true,
}) => {
  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base"
  };
  
  const pulseAnimation = status === "scanning" ? "animate-pulse" : "";

  return (
    <div className={cn(
      "flex items-center gap-2",
      className
    )}>
      <div className={cn(
        "flex items-center justify-center rounded-full border-2",
        config.borderColor,
        sizeClasses[size],
        pulseAnimation,
        status === "scanning" && "border-dashed"
      )}>
        <span className={config.textColor}>
          {config.icon}
        </span>
      </div>
      
      {showLabel && (
        <span className={cn(
          "font-medium", 
          config.textColor,
          status === "dangerous" && "font-bold"
        )}>
          {config.label}
        </span>
      )}
    </div>
  );
};
