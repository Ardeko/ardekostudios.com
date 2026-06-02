import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

const CONTACT_CARDS = [
  { icon: '✉️', label: 'E-posta', value: 'ardaguner2000@gmail.com', href: 'mailto:ardaguner2000@gmail.com' },
  { icon: '📸', label: 'INSTAGRAM', value: '@ardekostudios', href: 'https://www.instagram.com/ardekostudios/' },
  { icon: '📍', label: 'Konum', value: 'İstanbul, Türkiye', href: '#' },
];

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

function MagneticButton({ children, loading, disabled }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el || disabled || loading) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    el.style.transition = 'transform 0.1s ease';
    el.style.boxShadow = '0 0 50px rgba(99,102,241,0.5)';
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    ref.current.style.boxShadow = '0 0 30px rgba(99,102,241,0.25)';
  };

  return (
    <button
      ref={ref}
      type="submit"
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="mt-2 px-8 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-[0_0_30px_rgba(99,102,241,0.25)] relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed will-change-transform"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
            />
            Gönderiliyor...
          </>
        ) : (
          'Gönder →'
        )}
      </span>
    </button>
  );
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Contact() {
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
    if (!form.name.trim()) newErrors.name = 'Ad gerekli';
    if (!form.email.trim()) newErrors.email = 'E-posta gerekli';
    else if (!validateEmail(form.email)) newErrors.email = 'Geçerli bir e-posta girin';
    if (!form.message.trim()) newErrors.message = 'Mesaj gerekli';
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

  const inputBase =
    'w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:bg-white/[0.05]';

  return (
    <section id="contact" className="py-32 px-6 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center lg:text-left"
        >
          <p className="text-[11px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-3">
            Ulaşın
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            İletişim
          </h2>
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
                      { name: 'name', label: 'Adınız', type: 'text', placeholder: 'Arda GÜNER' },
                      { name: 'email', label: 'E-posta', type: 'email', placeholder: 'info@ardekostudios.com' },
                    ].map((field) => (
                      <motion.div key={field.name} variants={fieldItem} className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type={field.type}
                            name={field.name}
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
                              className="absolute inset-0 rounded-xl pointer-events-none"
                              style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.08)' }}
                            />
                          )}
                        </div>
                        <AnimatePresence>
                          {errors[field.name] && (
                            <motion.span
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
                      <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                        Mesajınız
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused(null)}
                          placeholder="Merhaba, sizinle iletişime geçmek istiyorum..."
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
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.08)' }}
                          />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.message && (
                          <motion.span
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
                      <MagneticButton loading={loading} disabled={loading} />
                    </motion.div>

                    <AnimatePresence>
                      {serverError && (
                        <motion.p
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[11px] text-red-400 font-medium text-center"
                        >
                          Bir hata oluştu. Lütfen tekrar deneyin veya direkt e-posta gönderin.
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
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl"
                  >
                    🎉
                  </motion.div>
                  <h3 className="text-xl font-black text-white">Mesajınız ulaştı!</h3>
                  <p className="text-gray-500 text-sm font-light">En kısa sürede geri dönüş yapacağız.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); setErrors({}); }}
                    className="text-[10px] font-black tracking-widest text-indigo-400 uppercase mt-2 hover:text-white transition-colors"
                  >
                    Yeni mesaj gönder
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
              İş birliği fırsatları, basın sorguları veya sadece merhaba demek için —
              her türlü mesajı bekliyoruz.
            </p>

            <motion.div
              variants={cardsContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col gap-5"
            >
              {CONTACT_CARDS.map((card, i) => (
                <motion.a
                  key={i}
                  href={card.href}
                  variants={cardItem}
                  whileHover={{ x: 6, borderColor: 'rgba(99,102,241,0.3)' }}
                  className="flex items-center gap-4 bg-white/[0.02] border border-white/8 rounded-2xl px-5 py-4 transition-colors group"
                >
                  <span className="text-xl w-8 text-center">{card.icon}</span>
                  <div>
                    <div className="text-[9px] font-black tracking-widest text-gray-600 uppercase mb-0.5">
                      {card.label}
                    </div>
                    <div className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                      {card.value}
                    </div>
                  </div>
                  <span className="ml-auto text-gray-600 group-hover:text-indigo-400 transition-colors text-xs">→</span>
                </motion.a>
              ))}
            </motion.div>

            <div className="flex items-center gap-2 mt-2">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                Genellikle 24 saat içinde yanıt veriyoruz
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
