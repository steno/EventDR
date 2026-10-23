"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { PwaInstallModal } from "@/components/PwaInstallModal";

interface FooterInstallLinkProps {
  dict: Dictionary;
  className?: string;
}

export function FooterInstallLink({
  dict,
  className = "hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors",
}: FooterInstallLinkProps) {
  const { canShowInstall, isStandalone } = usePwaInstall();
  const [open, setOpen] = useState(false);

  if (!canShowInstall || isStandalone) return null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {dict.install.menuLabel}
      </button>
      <PwaInstallModal dict={dict} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
