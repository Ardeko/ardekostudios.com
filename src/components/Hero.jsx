import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const WORDS = ['CYBER PLAY', 'BOLD GAMES', 'NEW WORLDS', 'PIXEL ART'];

function TypewriterWords() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const word = WORDS[index];
    if (!deleting && displayed.length < word.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [displayed, deleting, index]);

  return (
    <span className="text-indigo-400">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[0.85em] bg-indigo-400 ml-1 align-middle"
      />
    </span>
  );
}

const STATS = [
  { value: '1', label: 'Oyun Yayında' },
  { value: '10K+', label: 'İndirme' },
  { value: '4.8★', label: 'App Store Puanı' },
];

// Floating particle dots
function Particles() {
  const dots = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-indigo-400/20"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden"
    >
      <Particles />

      {/* Animated background blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08],
          x: ['-50%', '-47%', '-53%', '-50%'],
          y: ['-50%', '-53%', '-47%', '-50%'],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-indigo-600 rounded-full blur-[180px] pointer-events-none"
      />

      {/* Secondary blob */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.04, 0.08, 0.04],
          x: ['-30%', '-28%', '-32%', '-30%'],
          y: ['-30%', '-32%', '-28%', '-30%'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-600 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div style={{ y, opacity }} className="flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          />
          <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">
            Next-Gen Mobile Gaming
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 uppercase leading-[0.9] select-none"
        >
          <span className="bg-gradient-to-b from-white via-gray-100 to-gray-600 bg-clip-text text-transparent">
            WE CRAFT
          </span>
          <br />
          <TypewriterWords />
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-gray-400 max-w-sm sm:max-w-xl text-base md:text-lg font-light mb-12 leading-relaxed px-2"
        >
          Ardeko Studios olarak, fizik tabanlı mekanikleri ve bağımlılık yaratan minimalist bulmacaları
          sıra dışı görsellikle harmanlıyoruz.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <motion.a
            href="#games"
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(99,102,241,0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center px-8 py-4 text-xs font-black tracking-widest text-white uppercase bg-indigo-600 rounded-xl overflow-hidden group shadow-[0_0_40px_rgba(99,102,241,0.3)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Oyunları Keşfet</span>
          </motion.a>

          <motion.a
            href="#about"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-8 py-4 text-xs font-black tracking-widest text-gray-300 uppercase border border-white/10 rounded-xl hover:border-white/30 transition-colors"
          >
            Hakkımızda
          </motion.a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex items-center gap-8 sm:gap-12"
        >
          {STATS.map((stat, i) => (
            <div key={i} className={`text-center ${i !== STATS.length - 1 ? 'pr-8 sm:pr-12 border-r border-white/10' : ''}`}>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">{stat.value}</div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-widest text-gray-600 uppercase font-bold">Kaydır</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-gradient-to-b from-indigo-500/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
