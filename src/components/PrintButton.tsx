"use client";

interface PrintButtonProps {
  label: string;
}

export function PrintButton({ label }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mt-4 inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-800 shadow-sm transition active:scale-95 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 print:hidden"
    >
      {label}
    </button>
  );
}
