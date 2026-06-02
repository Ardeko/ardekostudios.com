import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Games from './components/Games';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorVariant, setCursorVariant] = useState('default');

  const springConfig = { damping: 40, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 150);
      cursorY.set(e.clientY - 150);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <div className="relative antialiased bg-[#05070F] overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-indigo-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      <motion.div
        className="hidden md:block fixed w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <main className="w-full lg:pl-64">
          <Hero />
          <Games />
          <About />
          <Contact />
          <Footer />
        </main>
      </div>
    </div>
  );
}