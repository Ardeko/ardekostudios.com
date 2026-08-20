import { useMemo, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { useLang } from '../lib/i18n';
import { MILESTONES, FILTER_OF, groupByYear } from '../lib/journey';

/**
 * Ardeko Studios — Yolculuk.
 *
 * Eski hâli 6 satırlık, iki yana serpiştirilmiş bir listeydi. Artık 17
 * kilometre taşı var (GitHub repoları + ardaguner.com kataloğu dahil), bu
 * yüzden şeritli/tek sütunlu düzene geçildi: 17 kartı sağa sola almaşık
 * dizmek uzun listelerde okunmuyor ve mobilde tamamen dağılıyor.
 *
 * Etkileşim üç yerde:
 *   1. Kategori çipleri — liste süzülür, sayaçlar canlı güncellenir.
 *   2. Karta tıklayınca açılır: tam açıklama + teknoloji yığını + linkler.
 *   3. Sol şerit scroll'a bağlı doluyor (yalnızca transform — ucuz).
 *
 * Performans notu: iOS'ta site zaten bellek/boyama sınırında (bkz.
 * CLAUDE.md "Görsel bütçesi"). Bu yüzden burada SÜREKLİ çalışan hiçbir
 * animasyon yok — sadece scroll'a bağlı tek bir transform ve etkileşimle
 * tetiklenen geçişler. `prefers-reduced-motion` hepsini kapatır.
 */

const FILTERS = ['all', 'studio', 'game', 'app', 'corporate', 'rnd'];

const CATEGORY_COLOR = {
  studio: '#818CF8',
  game: '#34D399',
  app: '#22D3EE',
  web: '#C084FC',
  corporate: '#FBBF24',
  rnd: '#FB7185',
};

function LinkIcon({ kind }) {
  if (kind === 'github') {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.570 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function Milestone({ item, words, months, linkWords, badges, expandLabel, reduce }) {
  const [open, setOpen] = useState(false);
  const color = CATEGORY_COLOR[item.category] ?? '#818CF8';
  const isStudio = item.category === 'studio';

  const date = item.month ? `${item.year} · ${months[item.month - 1]}` : `${item.year}`;
  const links = Object.entries(item.links ?? {});

  return (
    <li className="relative pl-12 sm:pl-16">
      {/* şerit üstündeki nokta */}
      <span
        className="absolute left-[13px] top-[18px] h-3 w-3 -translate-x-1/2 rounded-full sm:left-[21px]"
        style={{
          background: color,
          boxShadow: `0 0 0 4px #05070F, 0 0 14px ${color}80`,
        }}
      />

      <div
        className={`rounded-2xl border transition-colors ${
          isStudio
            ? 'border-indigo-500/25 bg-indigo-500/[0.06]'
            : 'border-white/10 bg-white/[0.03] hover:border-white/20'
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          data-cursor="soft"
          className="flex w-full items-start gap-4 p-5 text-left outline-none sm:p-6"
        >
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-500">
                {date}
              </span>
              <span
                className="rounded-full border px-2 py-0.5 text-[9px] font-black tracking-[0.15em]"
                style={{ color, borderColor: `${color}40`, background: `${color}14` }}
              >
                {badges[item.category]}
              </span>
              {item.inProgress && (
                <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[9px] font-black tracking-[0.15em] text-amber-400">
                  {linkWords.inProgress}
                </span>
              )}
            </div>

            <h4
              className={`font-black tracking-tight text-white ${
                item.highlight ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
              }`}
            >
              {words.title}
            </h4>

            {!open && (
              <p className="mt-1 line-clamp-2 text-xs font-light leading-relaxed text-gray-500">
                {words.desc}
              </p>
            )}
          </div>

          <span
            className="mt-1 shrink-0 text-[9px] font-black tracking-[0.2em] text-gray-600"
            aria-hidden="true"
          >
            {open ? '—' : expandLabel}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <p className="text-sm font-light leading-relaxed text-gray-400">
                  {words.desc}
                </p>

                {item.tech.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* Teknoloji etiketlerine ASLA `uppercase` verme: belge dili
                        `tr`, CSS büyütmesi i -> İ yapar ve "iOS" -> "İOS" olur. */}
                    {item.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-gray-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {links.map(([kind, href]) => (
                      <a
                        key={kind}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="soft"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-[10px] font-black tracking-widest text-white transition-colors hover:border-white/40"
                      >
                        <LinkIcon kind={kind} />
                        {linkWords[kind]}
                      </a>
                    ))}
                  </div>
                )}

                {item.restricted && (
                  <p className="mt-4 text-[10px] font-bold tracking-wide text-gray-600">
                    {linkWords.restricted}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}

export default function Journey() {
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const railRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 75%', 'end 55%'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const counts = useMemo(() => {
    const c = { all: MILESTONES.length };
    for (const m of MILESTONES) {
      const key = FILTER_OF[m.category];
      c[key] = (c[key] ?? 0) + 1;
    }
    return c;
  }, []);

  const visible = useMemo(
    () =>
      filter === 'all'
        ? MILESTONES
        : MILESTONES.filter((m) => FILTER_OF[m.category] === filter),
    [filter]
  );

  const years = useMemo(() => groupByYear(visible), [visible]);

  const stats = useMemo(() => {
    const shipped = MILESTONES.filter(
      (m) => m.links?.live || m.links?.appStore
    ).length;
    const all = MILESTONES.map((m) => m.year);
    return {
      projects: MILESTONES.filter((m) => m.category !== 'studio').length,
      years: Math.max(...all) - Math.min(...all) + 1,
      shipped,
    };
  }, []);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">
            {t.about.journey}
          </p>
          <p className="text-sm font-light leading-relaxed text-gray-400">
            {t.about.journeyLead}
          </p>
        </div>

        <div className="flex gap-8">
          {[
            [stats.projects, t.about.journeyStatProjects],
            [stats.shipped, t.about.journeyStatShipped],
            [stats.years, t.about.journeyStatYears],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="text-3xl font-black tracking-tight text-white tabular-nums">
                {value}
              </div>
              <div className="text-[10px] font-black tracking-[0.2em] text-gray-600">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* kategori süzgeci */}
      <div className="mb-12 flex flex-wrap gap-2">
        {FILTERS.map((key) => {
          const active = filter === key;
          const count = counts[key] ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={active}
              data-cursor="soft"
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black tracking-[0.15em] transition-colors ${
                active
                  ? 'border-indigo-400/50 bg-indigo-500/15 text-white'
                  : 'border-white/10 bg-white/[0.02] text-gray-500 hover:border-white/25 hover:text-gray-300'
              }`}
            >
              {t.about.journeyFilters[key]}
              <span className={active ? 'text-indigo-300' : 'text-gray-600'}>{count}</span>
            </button>
          );
        })}
      </div>

      <div ref={railRef} className="relative">
        {/* şerit: sabit iz + scroll'a bağlı dolan katman */}
        <div className="absolute bottom-0 left-[13px] top-0 w-px bg-white/8 sm:left-[21px]" />
        <motion.div
          style={{ scaleY: reduce ? 1 : fill }}
          className="absolute bottom-0 left-[13px] top-0 w-px origin-top bg-gradient-to-b from-indigo-400 via-indigo-500 to-purple-600 sm:left-[21px]"
        />

        <div className="flex flex-col gap-10">
          {years.map((group) => (
            <div key={group.year}>
              <div className="relative mb-5 pl-12 sm:pl-16">
                <span
                  className="absolute left-[13px] top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/40 bg-[#05070F] sm:left-[21px]"
                  aria-hidden="true"
                />
                <span className="text-2xl font-black tracking-tight text-white/90 tabular-nums sm:text-3xl">
                  {group.year}
                </span>
              </div>

              <ul className="flex flex-col gap-4">
                {group.items.map((item) => (
                  <Milestone
                    key={item.id}
                    item={item}
                    words={t.about.journeyItems[item.id]}
                    months={t.about.months}
                    linkWords={t.about.journeyLinks}
                    badges={t.about.journeyBadges}
                    expandLabel={t.about.journeyExpand}
                    reduce={reduce}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
