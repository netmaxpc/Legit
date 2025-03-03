import React, { useState } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";

export interface InputAnalysisBoxProps {
  onAnalyze: (input: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

export const InputAnalysisBox: React.FC<InputAnalysisBoxProps> = ({
  onAnalyze,
  placeholder = "Enter a URL, email, phone number, or paste suspicious text...",
  className,
  isLoading = false,
}) => {
  const [input, setInput] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="relative border border-metal-accent/30 bg-metal-shadow/80 backdrop-blur-sm rounded-md overflow-hidden group focus-within:border-metal-chrome transition-all duration-300">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a website, message, or phone number to check..."
          rows={5}
          className="w-full p-4 bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground/70 resize-none"
          disabled={isLoading}
        />
        
        {input && (
          <div className="absolute top-2 right-2">
            <Button 
              type="button"
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 rounded-full text-muted-foreground/70 hover:text-foreground hover:bg-background/80"
              onClick={() => setInput("")}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Clear input</span>
            </Button>
          </div>
        )}
        
        {/* Animated scanning line that appears when loading */}
        {isLoading && (
          <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
            <div className="h-1 bg-metal-chrome/50 animate-scan absolute w-full"></div>
            <div className="absolute inset-0 bg-metal-accent/5 opacity-10"></div>
          </div>
        )}
      </div>
      
      <Button 
        type="submit"
        variant="cyber"
        className="w-full mt-4 flex items-center justify-center gap-2 bg-metal-chrome text-metal-shadow hover:bg-metal-highlight"
        disabled={!input.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Checking...
          </>
        ) : (
          <>
            Check Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </Button>
      
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { opacity: 0.2; }
          100% { transform: translateY(100%); opacity: 0.8; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </form>
  );
};
