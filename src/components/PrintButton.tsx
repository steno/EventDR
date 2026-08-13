"use client";

interface PrintButtonProps {
  label: string;
}

export function PrintButton({ label }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mt-5 inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 py-2.5 text-sm font-bold text-white transition-transform active:scale-95 print:hidden"
    >
      {label}
    </button>
  );
}
