import { Fragment } from 'react';
import { motion } from 'framer-motion';

/**
 * Ardeko Studios — scroll reveal primitifleri.
 *
 * Referans sitelerdeki başlıkların "yerine oturma" hissi buradan geliyor:
 * her kelime kendi overflow-hidden kutusunun içinden yukarı kayarak giriyor.
 *
 * Erişilebilirlik: bölünen metin ekran okuyucuya tek parça verilir
 * (aria-label), parçalar aria-hidden'dır.
 */

const EASE = [0.16, 1, 0.3, 1];

/**
 * Başlıklar için kelime kelime maske reveal.
 *
 *   <SplitWords as="h2" text={'Fizik tabanlı\noyunlar yapıyoruz'}
 *               className="text-6xl font-black" />
 *
 * `\n` ile satır kırabilirsin. Türkçe ğ/ç/ş/y gibi alt uzantılar
 * kırpılmasın diye kutuya pb/-mb payı verilmiştir.
 */
export function SplitWords({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 0.045,
  duration = 0.9,
  once = true,
}) {
  const value = String(text);
  const lines = value.split('\n');
  let index = 0;

  return (
    <Tag className={className} aria-label={value}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').filter(Boolean).map((word) => {
            const i = index++;
            return (
              <Fragment key={`${li}-${i}`}>
                <span
                  className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
                  aria-hidden="true"
                >
                  <motion.span
                    className="inline-block will-change-transform"
                    initial={{ y: '115%' }}
                    whileInView={{ y: '0%' }}
                    viewport={{ once, margin: '-12% 0px -12% 0px' }}
                    transition={{ duration, delay: delay + i * stagger, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                </span>{' '}
              </Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Genel amaçlı blok reveal — kart, paragraf, buton grubu için.
 */
export function Reveal({
  children,
  className = '',
  y = 30,
  delay = 0,
  duration = 0.85,
  once = true,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Görseller için clip-path açılışı + hafif içeri zoom.
 * Görsel kırpma alanı açılırken kendisi 1.15'ten 1'e iner — perde açılıyor
 * hissi veriyor, düz fade'den çok daha "yapılmış" duruyor.
 */
export function ClipReveal({
  children,
  className = '',
  delay = 0,
  duration = 1.1,
  direction = 'up', // 'up' | 'down' | 'left' | 'right'
  once = true,
}) {
  const from = {
    up: 'inset(0% 0% 100% 0%)',
    down: 'inset(100% 0% 0% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  }[direction];

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once, margin: '-8% 0px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once, margin: '-8% 0px' }}
        transition={{ duration: duration * 1.25, delay, ease: EASE }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Reveal;
