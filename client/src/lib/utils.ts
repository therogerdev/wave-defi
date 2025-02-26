import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

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

/**
 * Formats a bigint value as a compact number string with up to 2 decimal places.
 * @param value - The bigint value to format.
 * @returns A formatted number string.
 */

export const formatNumber = (value: bigint) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(Number(formatUnits(value, 18)));
