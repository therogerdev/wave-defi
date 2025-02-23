"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  // during SSR, Next.js will attempt to render all components, including the ThemeProvider. However, the ThemeProvider relies on the use of the `useTheme` hook, which is only available on the client-side.

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>; // Render children without ThemeProvider during SSR
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
