import { useEffect, useState, lazy, Suspense } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import Preloader from './components/Preloader';
import { LanguageProvider } from './lib/i18n';

// Games ~1300 satır ve RevoScene'in elle çizilmiş SVG sahnesini de içine
// alıyor. Ayrı chunk'a çekilince ilk bundle küçülüyor, dolayısıyla preloader
// daha erken boyanıyor. Ekranın altında kaldığı için kullanıcı chunk'ın
// indiğini fark etmiyor; aşağıda intro biter bitmez ayrıca prefetch ediyoruz.
const Games = lazy(() => import('./components/Games'));

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

  // Games chunk'ını ana thread boşa çıkar çıkmaz indir; kullanıcı oraya
  // kaydırdığında zaten hazır olsun. requestIdleCallback Safari'de yok,
  // o yüzden setTimeout'a düşüyoruz.
  useEffect(() => {
    const warm = () => import('./components/Games');
    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(warm, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(warm, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <LanguageProvider>
    <SmoothScroll>
    <div className="relative antialiased bg-[#05070F] overflow-x-clip">
      <Preloader />
      <CustomCursor />

      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-indigo-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      <motion.div
        className="hidden md:block fixed w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      {/* Film grain.
          Burada BİR ZAMANLAR data-URI SVG + <feTurbulence> vardı. Geri koyma:
          WebKit turbulence'ı GPU'ya vermez, her pikseli CPU'da hesaplar ve
          numOctaves=4 piksel başına dört kat Perlin gürültüsü demektir. iPhone'da
          dPR=3 olduğu için her 128px karo 384 cihaz pikseline denk geliyordu;
          katman `fixed` olduğundan adres çubuğu her açılıp kapandığında (resize)
          iş baştan yapılıyordu. Preloader aynı React commit'inde boyandığı için
          sayaç ekrana gelmeden önce bu hesabın bitmesi gerekiyordu -> iOS'ta
          15-25 saniyelik siyah ekran. Aynı görüntü, hazır karolanabilir dokuyla
          sıfır maliyete iniyor. */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: 'url(/noise.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <main className="w-full lg:pl-64">
          <Hero />
          {/* Yer tutucunun yüksekliği önemli: boş bir fallback verirsen chunk
              inince sayfa yüksekliği sıçrar ve Lenis'in scroll konumu kayar. */}
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            <Games />
          </Suspense>
          <About />
          <Contact />
          <Footer />
        </main>
      </div>
    </div>
    </SmoothScroll>
    </LanguageProvider>
  );
}
