"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast dark:group-[.toaster]:bg-[#2A2A2A] group-[.toaster]:bg-background  group-[.toaster]:text-foreground  dark:group-[.toaster]:border-white/50 group-[.toaster]:border-accent/50 group-[.toaster]:shadow-lg",
          description:
            "group-[.toast]:text-foreground dark:group-[.toast]:text-foreground/60",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
