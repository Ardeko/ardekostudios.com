import { motion } from 'framer-motion';

function GameCard({ game, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.15, type: 'spring', bounce: 0.2 }}
      whileHover={{ y: -10 }}
      className={`group relative rounded-3xl border overflow-hidden flex flex-col min-h-[460px] ${
        game.live
          ? 'bg-white/[0.03] border-white/10'
          : 'bg-white/[0.01] border-dashed border-white/8'
      }`}
    >
      {/* Hover shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
      </div>

      {/* Top glow on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />

      {/* Game image placeholder / mock screenshot */}
      {game.live && (
        <div className="relative h-48 bg-gradient-to-br from-indigo-900/30 to-purple-900/20 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Stylized game preview mockup */}
            <div className="relative w-32 h-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl border border-indigo-500/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 rounded-xl border border-indigo-500/10"
              />
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🚂</div>
            </div>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex gap-1.5">
              {[70, 45, 85, 55, 90, 40, 75].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                  className="flex-1 bg-indigo-500/20 rounded-t-sm origin-bottom"
                  style={{ height: `${h * 0.25}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`flex flex-col flex-1 p-8 ${!game.live ? 'items-center justify-center text-center' : ''}`}>
        {game.live ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
                ● Yayında
              </span>
              <span className="text-[9px] text-gray-600 font-bold tracking-widest">IOS · ANDROID</span>
            </div>

            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
              Switch Master: Railway
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 flex-1">
              Demiryolu makaslarını doğru zamanda değiştir, trenleri kazasız hedeflerine ulaştır.
              Refleks ve stratejiyi birleştiren minimalist bir bulmaca deneyimi.
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-xs ${s <= 4 ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">4.8 · 1.2K değerlendirme</span>
            </div>

            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="https://apps.apple.com/tr/app/switch-master-railway/id6770972534?l=tr"
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-6 py-3.5 bg-white text-[#05070F] rounded-xl text-[10px] font-black tracking-widest uppercase text-center"
              >
                App Store
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="#"
                className="flex-1 px-6 py-3.5 border border-white/15 hover:border-white/40 rounded-xl text-[10px] font-black tracking-widest text-white uppercase text-center transition-colors"
              >
                Google Play
              </motion.a>
            </div>
          </>
        ) : (
          <>
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-2xl mb-6"
            >
              🔒
            </motion.div>
            <span className="text-[9px] font-black tracking-[0.4em] text-indigo-400/60 uppercase mb-2">
              Project Codename: Unknown
            </span>
            <h3 className="text-xl font-black text-white mb-4 tracking-wider uppercase">Gizli Proje</h3>
            <p className="text-gray-500 max-w-xs text-xs font-light leading-relaxed">
              Sınırları zorlayan yeni nesil bir mobil deneyim için AR-GE süreçlerimiz devam ediyor.
              Çok yakında burada listelenecek — takipte kal.
            </p>

            {/* Coming soon animated bar */}
            <div className="mt-8 w-full h-px bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
              />
            </div>
            <span className="text-[9px] text-gray-600 font-bold tracking-widest uppercase mt-2">
              Yakında...
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function Games() {
  const games = [{ live: true }, { live: false }];

  return (
    <section id="games" className="py-32 px-6 max-w-[1280px] mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="mb-20 text-center lg:text-left"
      >
        <p className="text-[11px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-3">
          Neler Yapıyoruz?
        </p>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          Projelerimiz
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 w-full">
        {games.map((game, i) => (
          <GameCard key={i} game={game} index={i} />
        ))}
      </div>
    </section>
  );
}
