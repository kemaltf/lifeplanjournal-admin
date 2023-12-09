// clsx is for combining classes in react
import { type ClassValue, clsx } from 'clsx';
// tailwind-merge is for merge class in tailwind
import { twMerge } from 'tailwind-merge';

// fungsi cn yang menerima sejumlah argumen,
// di mana setiap argumen dapat berupa string
// kelas atau objek kelas.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * const buttonClasses = cn(
  "bg-blue-500",
  { "text-white": true },
  { "rounded-md": true },
  { "hover:bg-blue-700": true }
);

// Contoh output
// "bg-blue-500 text-white rounded-md hover:bg-blue-700"

// Penggunaan pada elemen React
<button className={buttonClasses}>Click me</button>
 */
