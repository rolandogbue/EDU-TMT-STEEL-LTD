import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge conditional class names and Tailwind utilities, with later classes winning conflicts.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
