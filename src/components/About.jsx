import { motion } from 'framer-motion';
import { useLang } from '../lib/i18n';
import Journey from './Journey';

const valuesContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const valueItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function About() {
  const { t } = useLang();
  return (
    <section id="about" className="py-32 px-6 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center lg:text-left"
        >
          <p className="text-[11px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-3">
            {t.about.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            {t.about.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9 }}
            className="flex flex-col justify-center"
          >
            <p className="text-2xl sm:text-3xl font-black text-white leading-tight mb-6 tracking-tight">
              {t.about.quotePre}
              <span className="text-indigo-400">{t.about.quoteHighlight}</span>
              {t.about.quotePost}
            </p>
            <p className="text-gray-400 text-base font-light leading-relaxed mb-6">
              {t.about.p1}
            </p>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              {t.about.p2}
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-10 h-px w-full bg-gradient-to-r from-indigo-500/50 via-purple-500/30 to-transparent origin-left"
            />
          </motion.div>

          <motion.div
            variants={valuesContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {t.about.values.map((v, i) => (
              <motion.div
                key={i}
                variants={valueItem}
                whileHover={{ y: -4, borderColor: 'rgba(99,102,241,0.3)' }}
                data-cursor="soft"
                className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 flex flex-col gap-3 cursor-default transition-colors"
              >
                <span className="text-2xl">{v.icon}</span>
                <h4 className="text-sm font-black text-white tracking-tight">{v.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
        >
          <Journey />
        </motion.div>
      </div>
    </section>
  );
}
