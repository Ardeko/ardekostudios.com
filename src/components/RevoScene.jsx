import React from 'react';
import { motion } from 'framer-motion';

const REVO_CSS = `
@keyframes revoGridBlink{0%,100%{opacity:.04}50%{opacity:.11}}
@keyframes revoScan{0%{transform:translateY(-100%)}100%{transform:translateY(320%)}}
@keyframes revoPulseRing{0%{transform:scale(0.75);opacity:.55}70%{opacity:0}100%{transform:scale(2);opacity:0}}
@keyframes revoBarPulse{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
@keyframes revoDotBlink{0%,100%{opacity:.2;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}
@keyframes revoBubbleRise{0%{transform:translateY(0) scale(.5);opacity:0}18%{opacity:1;transform:translateY(-4px) scale(1)}100%{transform:translateY(-42px) scale(.85);opacity:0}}
@keyframes revoLivePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}

.revo-scene{position:relative;width:100%;height:210px;background:#0B0E13;overflow:hidden}
.revo-grid{position:absolute;inset:0;background-size:22px 22px;
  background-image:linear-gradient(to right,rgba(62,207,192,.06) 1px,transparent 1px),
  linear-gradient(to bottom,rgba(62,207,192,.06) 1px,transparent 1px);
  animation:revoGridBlink 6s infinite}
.revo-scanbar{position:absolute;left:0;right:0;height:70px;
  background:linear-gradient(to bottom,transparent,rgba(62,207,192,.06),transparent);
  animation:revoScan 5.5s linear infinite;pointer-events:none}
.revo-node{position:absolute;top:50%;width:46px;height:46px;margin-top:-23px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;z-index:3;backdrop-filter:blur(2px)}
.revo-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid;animation:revoPulseRing 2.6s ease-out infinite}
.revo-bar{position:absolute;bottom:0;width:3px;border-radius:2px;transform-origin:bottom;
  animation:revoBarPulse 1s ease-in-out infinite}
.revo-typedot{width:4px;height:4px;border-radius:50%;background:#E3A857;display:inline-block;
  animation:revoDotBlink 1.2s infinite}
`;

export default function RevoScene() {
  return (
    <div className="revo-scene">
      <style>{REVO_CSS}</style>

      {/* teknik zemin */}
      <div className="revo-grid" />
      <div className="revo-scanbar" />

      {/* merkez glow */}
      <div
        style={{
          position: 'absolute', left: '50%', top: '50%', width: 240, height: 130,
          background: 'radial-gradient(circle, rgba(62,207,192,.14), transparent 70%)',
          transform: 'translate(-50%,-50%)', pointerEvents: 'none',
        }}
      />

      {/* bağlantı hattı */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 210" preserveAspectRatio="none">
        <line x1="100" y1="105" x2="300" y2="105" stroke="#3ECFC0" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="5 7" />
      </svg>

      {/* iki yönlü akan veri paketi */}
      <motion.div
        style={{
          position: 'absolute', top: '50%', width: 8, height: 8, borderRadius: '50%',
          background: '#3ECFC0', boxShadow: '0 0 10px #3ECFC0', marginTop: -4, zIndex: 4,
        }}
        animate={{ left: ['25%', '75%', '25%'], opacity: [0, 1, 1, 1, 0] }}
        transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity }}
      />

      {/* NODE A — Sesli iletişim */}
      <div
        className="revo-node"
        style={{ left: '25%', marginLeft: -23, background: 'rgba(62,207,192,0.09)', border: '1px solid rgba(62,207,192,0.35)' }}
      >
        <div className="revo-ring" style={{ borderColor: 'rgba(62,207,192,0.5)' }} />
        <span style={{ fontSize: 17 }}>🎙️</span>
      </div>
      <div style={{ position: 'absolute', left: '25%', marginLeft: -34, bottom: 24, display: 'flex', gap: 3, alignItems: 'flex-end', height: 18 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="revo-bar"
            style={{ height: 6 + (i % 2 === 0 ? 12 : 18), background: '#3ECFC0', animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* NODE B — Yazılı iletişim */}
      <div
        className="revo-node"
        style={{ left: '75%', marginLeft: -23, background: 'rgba(227,168,87,0.09)', border: '1px solid rgba(227,168,87,0.35)' }}
      >
        <div className="revo-ring" style={{ borderColor: 'rgba(227,168,87,0.5)', animationDelay: '0.6s' }} />
        <span style={{ fontSize: 17 }}>💬</span>
      </div>
      <div style={{ position: 'absolute', left: '75%', marginLeft: -16, bottom: 24, display: 'flex', gap: 3 }}>
        <span className="revo-typedot" style={{ animationDelay: '0s' }} />
        <span className="revo-typedot" style={{ animationDelay: '0.2s' }} />
        <span className="revo-typedot" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* yükselen mesaj noktacıkları */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', left: `${70 + i * 5}%`, bottom: 56, width: 4, height: 4,
            borderRadius: '50%', background: '#E3A857',
          }}
          animate={{ opacity: [0, 1, 0], y: [0, -40] }}
          transition={{ duration: 2.6, delay: i * 0.9, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* üst etiket */}
      <div style={{ position: 'absolute', top: 14, left: 16, display: 'flex', alignItems: 'center', gap: 6, zIndex: 5 }}>
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: '#3ECFC0', boxShadow: '0 0 6px #3ECFC0', display: 'inline-block' }}
        />
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', color: '#6b7785', textTransform: 'uppercase' }}>
          SignalR · WebRTC
        </span>
      </div>
    </div>
  );
}
