import { motion, useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowUp } from 'lucide-react';
import { useLang } from '../lib/i18n';
import StoreIcon from './StoreIcons';

const EASE = [0.16, 1, 0.3, 1];

const STORE_LINKS = [
  { kind: 'appStore', label: 'App Store', href: 'https://apps.apple.com/tr/developer/arda-guner/id1896681354?l=tr' },
  { kind: 'googlePlay', label: 'Google Play', href: 'https://play.google.com/store/apps/developer?id=Ardeko+Studios&hl=tr' },
];

/* ------------------------------------------------------------------
   Dev wordmark (2026-11-25) — sayfanın "bitiş jeneriği".

   Kinetik tipografi: harfler görünür alana girince kendi maskelerinin
   içinden sırayla yükseliyor; alt kısmı bilerek kırpık (wordmark zeminden
   doğuyor gibi). Dikey gradyan beyazdan zemine eriyor — dolgu değil ışık.
   Dekoratif: logotip zaten yukarıda yazılı, ekran okuyucudan gizli.
   Tek seferlik `whileInView` — scroll'a bağlı sürekli bir şey yok.
------------------------------------------------------------------- */
function Wordmark() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none relative mt-12 -mb-[0.2em] select-none overflow-hidden sm:mt-16">
      <motion.div
        className="flex justify-center whitespace-nowrap font-black uppercase leading-[0.8] tracking-tighter"
        style={{ fontSize: 'clamp(4.5rem, 19vw, 17rem)' }}
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        // Negatif alt pay KULLANMA: wordmark sayfanın en dibinde; mobilde
        // ~60px yüksek ve "alt %10 hariç" payıyla hiç kesişmiyordu.
        viewport={{ once: true, amount: 0.25 }}
        transition={{ staggerChildren: 0.06 }}
      >
        {'ARDEKO'.split('').map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block bg-gradient-to-b from-white/[0.16] via-indigo-300/[0.07] to-transparent bg-clip-text text-transparent"
            variants={{ hidden: { y: '70%', opacity: 0 }, show: { y: '0%', opacity: 1 } }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Footer() {
  const { t } = useLang();
  const lenis = useLenis();

  const toTop = (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/5 px-6 pt-16 overflow-hidden">
      {/* Üst kenarda ışık şeridi — sidebar/header ile aynı dil. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent"
      />
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/ardeko.png"
                alt=""
                width={512}
                height={512}
                className="h-8 w-auto object-contain opacity-80"
              />
              <div>
                <div className="text-xs font-black tracking-label-wide text-white">ARDEKO</div>
                <div lang="en" className="text-[8px] font-bold tracking-label-wide text-gray-400 uppercase">Studios</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              {t.footer.desc}
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {STORE_LINKS.map((s) => (
                <a
                  key={s.kind}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="ring"
                  className="lg inline-flex items-center gap-2 rounded-chip px-3 py-2 text-[9px] font-black tracking-widest text-gray-300 uppercase transition-colors duration-300 hover:text-white"
                >
                  <StoreIcon kind={s.kind} className="h-3 w-3" />
                  <span lang="en">{s.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            <h4 className="text-[9px] font-black tracking-label-x text-gray-400 uppercase mb-5">
              {t.footer.social}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://www.instagram.com/ardekostudios/"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="ring"
                  className="text-xs text-gray-400 hover:text-white transition-colors font-light"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="flex flex-col items-start md:items-end"
          >
            <div className="md:text-right">
              <h4 className="text-[9px] font-black tracking-label-x text-gray-400 uppercase mb-5">
                {t.footer.legal}
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="https://ardaguner.com/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="ring"
                    className="text-xs text-gray-400 hover:text-white transition-colors font-light"
                  >
                    {t.footer.privacy}
                  </a>
                </li>
              </ul>
            </div>

            {/* Başa dön — cam kare; hover'da buton değil ok kalkıyor. */}
            <a
              href="#main"
              onClick={toTop}
              data-cursor="ring"
              aria-label={t.footer.toTop}
              className="lg group mt-8 inline-flex h-11 w-11 items-center justify-center rounded-control text-gray-300 transition-colors duration-300 hover:text-white"
            >
              <ArrowUp
                aria-hidden="true"
                strokeWidth={2.2}
                className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5"
              />
            </a>
          </motion.div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
            © {new Date().getFullYear()} <span lang="en">Ardeko Studios.</span> {t.footer.rights}
          </p>

          <div className="flex items-center gap-2">
            <span className="relative flex h-1 w-1" aria-hidden="true">
              <span className="adk-ping absolute inset-0 rounded-full bg-indigo-400" />
              <span className="relative h-1 w-1 rounded-full bg-indigo-500" />
            </span>
            <span lang="en" className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">
              Made with ♥ in Istanbul
            </span>
          </div>
        </div>
      </div>

      <Wordmark />
    </footer>
  );
}
