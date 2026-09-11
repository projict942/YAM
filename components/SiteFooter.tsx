"use client";

import { useEffect, useState } from "react";

type SiteLanguage = "ar" | "en";

export default function SiteFooter() {
  const [language, setLanguage] = useState<SiteLanguage>("en");

  useEffect(() => {
    const updateLanguage = () => {
      setLanguage(document.documentElement.lang === "ar" ? "ar" : "en");
    };

    updateLanguage();
    window.addEventListener("yam-language-change", updateLanguage);
    return () => window.removeEventListener("yam-language-change", updateLanguage);
  }, []);

  return (
    <footer className="site-footer" lang={language}>
      <div>
        {language === "ar"
          ? "© 2026 YAM4LCS. جميع الحقوق محفوظة."
          : "© 2026 YAM4LCS. All rights reserved."}
      </div>
      <div>Designed &amp; Developed by Fady</div>
    </footer>
  );
}