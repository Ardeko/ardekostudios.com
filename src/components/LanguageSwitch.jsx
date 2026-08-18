import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../lib/i18n';

/* ------------------------------------------------------------------
   LanguageSwitch — standart bir dropdown/bayrak değil, sitenin HUD/
   motor dilinde bir "frekans" kontrolü:

     · TR/EN her zaman görünür, aktif olan parlak, pasif olan soluk
     · Altlarında kayan bir glow nokta spring fizikle geçiş yapıyor
       (Navbar'daki active-bar/active-dot ile aynı motion dili)
     · Tıklayınca merkezden dışa bir "radar ping" halkası patlıyor
     · Sağında aktif dilin bayrağı (tr-crystal.png / en-crystal.png)
       küçük bir rozet olarak beliriyor, dil değişince crossfade+scale
       ile bir öncekinin yerini alıyor
------------------------------------------------------------------- */

const FLAGS = { tr: '/tr-crystal.png', en: '/en-crystal.png' };

export default function LanguageSwitch({ className = '', showFlag = true }) {
  const { lang, setLang } = useLang();
  const [pulseKey, setPulseKey] = useState(0);

  const handleClick = () => {
    setLang(lang === 'tr' ? 'en' : 'tr');
    setPulseKey((k) => k + 1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      data-cursor="ring"
      aria-label={lang === 'tr' ? 'Switch language to English' : 'Dili Türkçe olarak değiştir'}
      className={`group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] py-1.5 pl-1.5 pr-3 transition-colors duration-300 hover:border-indigo-400/40 ${className}`}
    >
      <span className="relative flex h-6 w-[52px] shrink-0 items-center rounded-full bg-black/40">
        <AnimatePresence>
          <motion.span
            key={pulseKey}
            initial={{ opacity: 0.55, scale: 0.3 }}
            animate={{ opacity: 0, scale: 2.1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400"
          />
        </AnimatePresence>

        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.75)]"
          style={{ left: lang === 'tr' ? '3px' : 'calc(100% - 21px)' }}
        />

        <span
          className={`relative z-10 flex-1 text-center text-[9px] font-black tracking-widest transition-colors duration-300 ${
            lang === 'tr' ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'
          }`}
        >
          TR
        </span>
        <span
          className={`relative z-10 flex-1 text-center text-[9px] font-black tracking-widest transition-colors duration-300 ${
            lang === 'en' ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'
          }`}
        >
          EN
        </span>
      </span>

      {showFlag && (
        <span className="relative hidden h-5 w-7 shrink-0 overflow-hidden rounded-[4px] border border-white/15 shadow-[0_0_8px_rgba(0,0,0,0.4)] sm:block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={lang}
              src={FLAGS[lang]}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </span>
      )}
    </button>
  );
}
