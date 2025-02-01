import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Env from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const trimString = (data: string) => {
  if (data.length <= 50) {
    return data;
  }
  return data.slice(0, 50) + "...";
};

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return '';
  
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '';

  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long", 
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(parsedDate);
}

export const getImageUrl = (path: string): string => {
  return `${Env.API_URL}/storage/public/${path}`;
};

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim()
}