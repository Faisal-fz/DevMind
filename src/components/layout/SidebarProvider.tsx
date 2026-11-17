"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

interface SidebarContextValue {
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

interface SidebarProviderProps {
  children: ReactNode;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isDesktopOpen, setDesktopOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
      setDesktopOpen((open) => !open);
    } else {
      setMobileOpen((open) => !open);
    }
  }, []);

  const value = useMemo(
    () => ({ isDesktopOpen, isMobileOpen, setMobileOpen, toggleSidebar }),
    [isDesktopOpen, isMobileOpen, toggleSidebar],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
