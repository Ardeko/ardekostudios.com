import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { SplitWords } from './Reveal';

/* Instagram, lucide v1'den çıkarıldı (marka ikonları kaldırıldı). Bu,
   Feather Icons'un (MIT) çizgi Instagram glifinin birebir aynısı — lucide
   ile aynı 24'lük ızgara ve 2px çizgi, yani yanındaki Mail/MapPin ile tek
   aile. Dolgu marka logosu değil, çizgi ikon: kartlarda diğerleriyle
   aynı dili konuşsun diye. */
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const CARD_ICONS = { email: Mail, instagram: InstagramIcon, location: MapPin };

const cardsContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const fieldsContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fieldItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* Eskiden MagneticButton'dı: imleç üzerindeyken buton fareye doğru
   kayıyordu. Mıknatıs efekti siteden tamamen kaldırıldı — bir gönder
   butonunun tıklanacak anda yer değiştirmesi hedefi küçültmekten başka
   bir şey yapmıyordu (Fitts yasası) ve dokunmatikte zaten hiç
   çalışmıyordu. Geri kalanı aynı: gradyan hover'ı, glow, loading. */
function SubmitButton({ loading, disabled }) {
  const { t } = useLang();

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      data-cursor="soft"
      className="lg-primary shine group mt-2 overflow-hidden px-8 py-4 rounded-control text-[10px] font-black tracking-widest uppercase disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
            />
            {t.contact.form.sending}
          </>
        ) : (
          <>
            {/* i18n metni "Gönder →" — ok metinde. Hareketli ok ikonu onun
                yerine geçiyor (hover'da ikon kayar, buton değil). */}
            {t.contact.form.send.replace(/\s*→\s*$/, '')}
            <ArrowRight
              aria-hidden="true"
              strokeWidth={2.5}
              className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
            />
          </>
        )}
      </span>
    </button>
  );
}

/* Başarı işareti — çizilerek beliriyor (pathLength). 🎉 emojisinin
   yerine: hareketin bir anlamı var ("tamamlandı"), dekor değil. */
function SuccessMark() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-16">
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.35), transparent 70%)' }}
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.6, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      <svg viewBox="0 0 64 64" className="relative h-16 w-16" fill="none" aria-hidden="true">
        <motion.circle
          cx="32" cy="32" r="29" stroke="rgba(52,211,153,0.9)" strokeWidth="2.5"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        />
        <motion.path
          d="M20 33.5 28.5 42 45 24" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t.contact.form.errors.name;
    if (!form.email.trim()) newErrors.email = t.contact.form.errors.email;
    else if (!validateEmail(form.email)) newErrors.email = t.contact.form.errors.emailInvalid;
    if (!form.message.trim()) newErrors.message = t.contact.form.errors.message;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setServerError(false);

    try {
      const res = await fetch('https://formspree.io/f/xwvzgnko', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setServerError(true);
      }
    } catch {
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  // text-base (16px) mobilde şart: iOS Safari 16px altındaki bir alana
  // odaklanınca sayfayı kendiliğinden yakınlaştırıyor. sm'den itibaren 14px.
  // `.well`: içe basık cam kuyu (neumorphic glass) — "buraya bir şey
  // yazılır" diyen tek yüzey dili; kenar çizgisi kontrastı taşıyor.
  const inputBase =
    'well w-full border rounded-control px-4 py-3.5 text-base sm:text-sm text-white placeholder:text-gray-500 outline-none transition-colors duration-300';

  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden">
      {/* Final ışığı — hero'daki Aurora'nın sayfanın sonundaki yankısı.
          Statik radial-gradient: animasyon yok, filtre yok. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          background:
            'radial-gradient(60% 55% at 85% 100%, rgba(147,51,234,0.12), transparent 70%), radial-gradient(55% 50% at 15% 100%, rgba(79,70,229,0.14), transparent 70%)',
        }}
      />
      <div className="relative max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center lg:text-left"
        >
          <p className="text-[11px] font-black tracking-label-x text-indigo-400 uppercase mb-3">
            {t.contact.eyebrow}
          </p>
          <SplitWords
            as="h2"
            className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase"
            text={t.contact.title}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <motion.div
                    variants={fieldsContainer}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-4"
                  >
                    {[
                      { name: 'name', label: t.contact.form.nameLabel, type: 'text', autoComplete: 'name', placeholder: t.contact.form.namePlaceholder },
                      { name: 'email', label: t.contact.form.emailLabel, type: 'email', autoComplete: 'email', placeholder: t.contact.form.emailPlaceholder },
                    ].map((field) => (
                      <motion.div key={field.name} variants={fieldItem} className="flex flex-col gap-1.5">
                        {/* htmlFor/id çifti şart: label'lar eskiden hiçbir
                            input'a bağlı değildi — ekran okuyucu alanları
                            isimsiz okuyordu, etikete tıklayınca odak
                            gitmiyordu. */}
                        <label
                          htmlFor={`contact-${field.name}`}
                          className="text-[10px] font-black tracking-widest text-gray-500 uppercase"
                        >
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            id={`contact-${field.name}`}
                            type={field.type}
                            name={field.name}
                            autoComplete={field.autoComplete}
                            aria-invalid={errors[field.name] ? true : undefined}
                            aria-describedby={errors[field.name] ? `contact-${field.name}-error` : undefined}
                            value={form[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocused(field.name)}
                            onBlur={() => setFocused(null)}
                            placeholder={field.placeholder}
                            className={`${inputBase} ${
                              errors[field.name]
                                ? 'border-red-500/50 focus:border-red-500/70'
                                : 'border-white/10 focus:border-indigo-500/50'
                            }`}
                          />
                          {focused === field.name && !errors[field.name] && (
                            <motion.div
                              layoutId="input-glow"
                              className="absolute inset-0 rounded-control pointer-events-none"
                              style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.08)' }}
                            />
                          )}
                        </div>
                        <AnimatePresence>
                          {errors[field.name] && (
                            <motion.span
                              id={`contact-${field.name}-error`}
                              role="alert"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="text-[10px] text-red-400 font-medium"
                            >
                              {errors[field.name]}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}

                    <motion.div variants={fieldItem} className="flex flex-col gap-1.5">
                      <label
                        htmlFor="contact-message"
                        className="text-[10px] font-black tracking-widest text-gray-500 uppercase"
                      >
                        {t.contact.form.messageLabel}
                      </label>
                      <div className="relative">
                        <textarea
                          id="contact-message"
                          name="message"
                          aria-invalid={errors.message ? true : undefined}
                          aria-describedby={errors.message ? 'contact-message-error' : undefined}
                          value={form.message}
                          onChange={handleChange}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused(null)}
                          placeholder={t.contact.form.messagePlaceholder}
                          rows={5}
                          className={`${inputBase} resize-none ${
                            errors.message
                              ? 'border-red-500/50 focus:border-red-500/70'
                              : 'border-white/10 focus:border-indigo-500/50'
                          }`}
                        />
                        {focused === 'message' && !errors.message && (
                          <motion.div
                            layoutId="input-glow"
                            className="absolute inset-0 rounded-control pointer-events-none"
                            style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.08)' }}
                          />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.message && (
                          <motion.span
                            id="contact-message-error"
                            role="alert"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-[10px] text-red-400 font-medium"
                          >
                            {errors.message}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div variants={fieldItem}>
                      <SubmitButton loading={loading} disabled={loading} />
                    </motion.div>

                    <AnimatePresence>
                      {serverError && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[11px] text-red-400 font-medium text-center"
                        >
                          {t.contact.form.serverError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-64 gap-4 text-center"
                >
                  <SuccessMark />
                  <h3 className="text-xl font-black text-white">{t.contact.form.successTitle}</h3>
                  <p className="text-gray-400 text-sm font-light">{t.contact.form.successBody}</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); setErrors({}); }}
                    data-cursor="ring"
                    className="text-[10px] font-black tracking-widest text-indigo-400 uppercase mt-2 hover:text-white transition-colors"
                  >
                    {t.contact.form.sendAnother}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="flex flex-col justify-center gap-5"
          >
            <p className="text-gray-400 text-base font-light leading-relaxed mb-2">
              {t.contact.lead}
            </p>

            <motion.div
              variants={cardsContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col gap-5"
            >
              {/* Kart linke gidiyorsa <a>, gitmiyorsa (Konum) düz kutu —
                  eskiden Konum `href="#"` idi: tıklayınca sayfanın başına
                  zıplıyordu. Hover'da kart değil ikon ve ok hareket ediyor. */}
              {t.contact.cards.map((card) => {
                const Icon = CARD_ICONS[card.kind];
                const Tag = card.href ? motion.a : motion.div;
                const external = card.href?.startsWith('http');
                return (
                  <Tag
                    key={card.kind}
                    {...(card.href
                      ? { href: card.href, 'data-cursor': 'ring', ...(external ? { target: '_blank', rel: 'noreferrer' } : {}) }
                      : {})}
                    variants={cardItem}
                    className={`group card-glass flex items-center gap-4 rounded-card border border-white/10 px-5 py-4 transition-colors duration-500 ease-soft ${
                      card.href ? 'hover:border-indigo-400/30' : ''
                    }`}
                  >
                    <span className="lg flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-indigo-300 transition-colors duration-300 group-hover:text-white">
                      {Icon ? <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" /> : card.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-0.5">
                        {card.label}
                      </div>
                      <div className="truncate text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                        {card.value}
                      </div>
                    </div>
                    {card.href && (
                      <ArrowUpRight
                        aria-hidden="true"
                        strokeWidth={2.2}
                        className="ml-auto h-4 w-4 shrink-0 text-gray-400 transition-[translate,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-300"
                      />
                    )}
                  </Tag>
                );
              })}
            </motion.div>

            <div className="flex items-center gap-2 mt-2">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {t.contact.responseNote}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
