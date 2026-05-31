import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const CONTACT_CARDS = [
  { icon: '✉️', label: 'E-posta', value: 'ardaguner2000@gmail.com', href: 'mailto:ardaguner2000@gmail.com' },
  { icon: '📸', label: 'INSTRAGRAM', value: '@ardekoStudios', href: '#' },
  { icon: '📍', label: 'Konum', value: 'İstanbul, Türkiye', href: '#' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-32 px-6 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
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
          {/* Left: Form */}
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
                  className="flex flex-col gap-4"
                >
                  {[
                    { name: 'name', label: 'Adınız', type: 'text', placeholder: 'Arda GÜNER' },
                    { name: 'email', label: 'E-posta', type: 'email', placeholder: 'arda@ardekostudios.com' },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-1.5">
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
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/[0.05]"
                        />
                        {focused === field.name && (
                          <motion.div
                            layoutId="input-glow"
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.08)' }}
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Textarea */}
                  <div className="flex flex-col gap-1.5">
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
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/[0.05] resize-none"
                      />
                      {focused === 'message' && (
                        <motion.div
                          layoutId="input-glow"
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.08)' }}
                        />
                      )}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 px-8 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-[0_0_30px_rgba(99,102,241,0.25)] relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10">Gönder →</span>
                  </motion.button>
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
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
                    className="text-[10px] font-black tracking-widest text-indigo-400 uppercase mt-2 hover:text-white transition-colors"
                  >
                    Yeni mesaj gönder
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Contact cards */}
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

            {CONTACT_CARDS.map((card, i) => (
              <motion.a
                key={i}
                href={card.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08 }}
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

            {/* Response time badge */}
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
