// A simple utility to merge tailwind classes, inspired by clsx and tailwind-merge.
// This helps in building reusable and customizable components.

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
