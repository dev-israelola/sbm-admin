import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now()
    .toString(36)
    .slice(-4)}`;
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export function groupBy<T, K extends string | number>(
  arr: T[],
  by: (v: T) => K,
) {
  return arr.reduce<Record<string, T[]>>((acc, v) => {
    const k = String(by(v));
    (acc[k] ||= []).push(v);
    return acc;
  }, {});
}
