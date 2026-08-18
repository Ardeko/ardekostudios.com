import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CONTENT, LANGS } from './i18n-content';

/* ------------------------------------------------------------------
   i18n — dil context'i.

   İçerik verisi `i18n-content.js`'te (bu dosya sadece component/hook
   export etsin diye ayrıldı, react-refresh bunu ister). Bileşenler
   `useLang()` ile `{ lang, setLang, t }` alır, `t` o an aktif dilin
   içerik ağacıdır. Nav etiketleri (GAMES/ABOUT/CONTACT), kurucu adı,
   "FOUNDER", "Made with ♥ in Istanbul" gibi zaten İngilizce/marka olan
   şeyler bilerek CONTENT dışında, bileşenin kendi içinde sabit kalıyor.
------------------------------------------------------------------- */

const STORAGE_KEY = 'ardeko-lang';

const LanguageContext = createContext(null);

function detectInitialLang() {
  if (typeof window === 'undefined') return 'tr';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LANGS.includes(stored)) return stored;
  } catch {
    // localStorage kapalı olabilir (gizli sekme vb.) — sessizce varsayılana düş
  }
  return 'tr';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  const setLang = (next) => {
    if (!LANGS.includes(next)) return;
    setLangState(next);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // sessizce yut — dil tercihi bu oturumda state olarak zaten yaşıyor
    }
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: CONTENT[lang] }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang, LanguageProvider içinde kullanılmalı');
  return ctx;
}
