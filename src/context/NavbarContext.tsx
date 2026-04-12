"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface NavbarContextType {
  isLogoHovered: boolean;
  setIsLogoHovered: (hovered: boolean) => void;
  isBrandingRevealed: boolean;
  setIsBrandingRevealed: (revealed: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isBrandingRevealed, setIsBrandingRevealed] = useState(false);

  return (
    <NavbarContext.Provider value={{ 
      isLogoHovered, 
      setIsLogoHovered, 
      isBrandingRevealed, 
      setIsBrandingRevealed 
    }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
}
