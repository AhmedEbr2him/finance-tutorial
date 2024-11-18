import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// to store amount in db
export function converAmountFromMiliunits(amount: number) {
  return amount / 1000;
};

// to show user how amount like 
export function convertAmountTomiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 3,
  }).format(value);
};
