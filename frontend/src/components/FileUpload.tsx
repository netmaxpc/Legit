import React, { useState } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";

export interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = "image/*",
  maxSize = 5,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB`);
      return;
    }
    
    // Check file type
    if (accept !== "*" && !file.type.match(accept.replace(/\*/g, ".*"))) {
      setError("Invalid file type");
      return;
    }
    
    onUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className={cn(
          "relative w-full border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-colors",
          "bg-card/50 backdrop-blur-sm",
          isDragging ? "border-metal-chrome" : "border-metal-accent/50",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center">
          <svg
            className={`w-12 h-12 mb-3 ${isDragging ? "text-metal-chrome animate-pulse" : "text-metal-chrome/70"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-2 text-sm text-center text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground/70">
            {accept.replace("image/*", "PNG, JPG, GIF etc")}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            (Max {maxSize}MB)
          </p>

          {/* This is the invisible file input */}
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={accept}
          />
        </div>

        {/* Overlay with scanning animation when dragging */}
        {isDragging && (
          <div className="absolute inset-0 bg-gradient-to-r from-metal-chrome/10 to-metal-highlight/10 rounded-md flex items-center justify-center z-10 border border-metal-accent">
            <div className="w-full h-full relative overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-metal-accent/5 opacity-30"></div>
              <div className="absolute top-0 w-full h-1 bg-metal-chrome/50 animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { opacity: 0.2; }
          100% { transform: translateY(100%); opacity: 0.8; }
        }
      `}</style>

      <Button
        variant="cyber-outline"
        className="mt-4 w-full"
        onClick={() => document.getElementById("dropzone-file")?.click()}
      >
        Select File
      </Button>
    </div>
  );
};
