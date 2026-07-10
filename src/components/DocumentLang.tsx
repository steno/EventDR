"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";

interface DocumentLangProps {
  locale: Locale;
}

export function DocumentLang({ locale }: DocumentLangProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
