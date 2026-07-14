import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseGoogleDriveUrl(url: string): string {
  if (!url) return url;
  try {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('drive.google.com') && urlObj.searchParams.has('id')) {
      return `https://drive.google.com/uc?export=view&id=${urlObj.searchParams.get('id')}`;
    }
  } catch (e) {
    // If URL parsing fails, return original
  }
  return url;
}
