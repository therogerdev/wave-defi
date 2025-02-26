import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (firstName: string, lastName: string) => {
  const firstInitial = firstName ? firstName[0] : "";
  const lastInitial = lastName ? lastName[0] : "";

  return `${firstInitial}${lastInitial}`;
};

/**
 * Copies a given text to the clipboard and shows a toast notification.
 * @param text The text to copy to clipboard.
 * @param label A label to display in the toast notification (e.g., "Token", "Address").
 */

export const handleCopy = (text: string, label: string = "") => {
  if (!text) return;

  navigator.clipboard.writeText(text);
  toast("Copied to clipboard", {
    description: `${label && label + ":"} ${text}`,
    position: "top-center",
  });
};
