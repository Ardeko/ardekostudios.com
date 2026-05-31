import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = ['GAMES', 'ABOUT', 'CONTACT'];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => item.toLowerCase());
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          return;
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.nav
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-[#05070F]/80 backdrop-blur-2xl border-r border-white/5 flex-col justify-between items-center py-12 px-8 z-50"
      >
        <div className="w-full flex flex-col items-center gap-4">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            className="w-28 h-28 flex items-center justify-center"
          >
            <img
              src="/ardeko.png"
              alt="Ardeko Studios"
              className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]"
            />
          </motion.a>
          <div className="text-center mt-1">
            <h1 className="text-sm font-black tracking-[0.3em] text-white">ARDEKO</h1>
            <p className="text-[9px] font-medium tracking-[0.4em] text-gray-500 mt-1">STUDIOS</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.toLowerCase();
            return (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200"
              >
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  animate={{
                    backgroundColor: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                    borderColor: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
                  }}
                  style={{ border: '1px solid' }}
                  transition={{ duration: 0.3 }}
                />

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="active-bar"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                      className="absolute left-0 top-2 bottom-2 w-[2px] bg-indigo-500 rounded-full"
                    />
                  )}
                </AnimatePresence>

                <span
                  className={`relative z-10 text-[11px] font-black tracking-[0.35em] transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-200'
                  }`}
                >
                  {item}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="ml-auto w-1 h-1 rounded-full bg-indigo-400"
                  />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Değiştirdiğimiz Yeni Sosyal Alan Burası */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="flex mb-2">
            <motion.a
              href="https://www.instagram.com/ardekostudios/"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1, color: '#818cf8' }}
              className="text-[10px] font-black tracking-[0.2em] text-gray-600 hover:text-indigo-400 transition-colors uppercase"
            >
              INSTAGRAM
            </motion.a>
          </div>
          <div className="text-[9px] font-medium text-gray-700 tracking-widest uppercase">v1.0.0</div>
        </div>
      </motion.nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#05070F]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-5 z-50">
        <a href="#">
          <img src="/ardeko.png" alt="Ardeko" className="h-8 w-auto object-contain" />
        </a>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 p-2"
        >
          <motion.div animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-white origin-center" />
          <motion.div animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }} className="w-5 h-0.5 bg-white" />
          <motion.div animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-white origin-center" />
        </button>
      </div>

      {/* Mobile Full-screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 95% 5%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 95% 5%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 95% 5%)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#05070F] z-40 flex flex-col justify-center items-center gap-8 md:hidden"
          >
            <img src="/ardeko.png" alt="Ardeko" className="h-20 w-auto mb-6 opacity-80" />
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="text-2xl font-black tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}