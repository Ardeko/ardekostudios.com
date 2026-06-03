import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <img src="/ardeko.png" alt="Ardeko" className="h-8 w-auto object-contain opacity-80" />
              <div>
                <div className="text-xs font-black tracking-[0.3em] text-white">ARDEKO</div>
                <div className="text-[8px] font-bold tracking-[0.3em] text-gray-600 uppercase">Studios</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 font-light leading-relaxed">
              İstanbul merkezli bağımsız mobil oyun stüdyosu. Minimalist mekanikler, maksimum eğlence.
            </p>

            <div className="flex gap-2 mt-5">
              <a
                href="https://apps.apple.com/tr/developer/arda-guner/id1896681354?l=tr"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 border border-white/10 rounded-lg text-[9px] font-black tracking-widest text-gray-400 hover:text-white hover:border-white/30 transition-all uppercase"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/developer?id=Ardeko+Studios&hl=tr"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 border border-white/10 rounded-lg text-[9px] font-black tracking-widest text-gray-400 hover:text-white hover:border-white/30 transition-all uppercase"
              >
                Google Play
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            <h4 className="text-[9px] font-black tracking-[0.4em] text-gray-500 uppercase mb-5">
              Sosyal
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://www.instagram.com/ardekostudios/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-200 transition-colors font-light"
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
          >
            <h4 className="text-[9px] font-black tracking-[0.4em] text-gray-500 uppercase mb-5">
              Hukuki
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://ardaguner.com/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-200 transition-colors font-light"
                >
                  Gizlilik Politikası
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-700 font-medium tracking-widest uppercase">
            © {new Date().getFullYear()} Ardeko Studios. Tüm hakları saklıdır.
          </p>

          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-indigo-500"
            />
            <span className="text-[9px] text-gray-700 font-bold tracking-widest uppercase">
              Made with ♥ in Istanbul
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}