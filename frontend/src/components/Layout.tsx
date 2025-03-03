import React from "react";
import { Toaster } from "sonner";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
};
