import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import RevoScene from './RevoScene';
import { SplitWords } from './Reveal';
import Spotlight from './Spotlight';
import Folder from './Folder';
import StoreIcon from './StoreIcons';
import ScrambleText from './ScrambleText';
import { useLang } from '../lib/i18n';

// Gizli proje klasöründen çıkan üç "karartılmış belge". Metin YOK — ne
// yazsak uydurma olurdu; satırlar sadece belge dokusu. İlk satır indigo
// (başlık), gerisi soluk. Modül seviyesinde sabit: her render'da yeniden
// üretilmesinin anlamı yok.
const REDACTED_SHEETS = [
  ['70%', '92%', '55%'],
  ['85%', '60%', '78%'],
  ['66%', '84%', '48%'],
].map((widths, sheet) => (
  <div key={sheet} className="flex h-full w-full flex-col justify-center gap-[5px] p-2.5">
    {widths.map((w, line) => (
      <span
        key={line}
        className="h-[3px] rounded-full"
        style={{
          width: w,
          background: line === 0 ? 'rgba(129,140,248,0.5)' : 'rgba(255,255,255,0.13)',
        }}
      />
    ))}
  </div>
));

// Kartın imleç ışığı, o projenin kendi vurgu rengini alsın — REVO'nun
// teal'i, Decoy'un kırmızısı vs. Listede olmayan proje varsayılan indigoya
// düşer. Buradaki alfa bilerek düşük: ışık camsı zemini aydınlatmalı,
// kartı boyamamalı.
const SPOTLIGHT_COLORS = {
  revo: 'rgba(62, 207, 192, 0.42)',
  decoy: 'rgba(244, 63, 94, 0.38)',
  lore: 'rgba(167, 139, 250, 0.45)',
  // Oyunun "galeri sarısı" (--sari #f7bd3f) — gece galerisinin sodyum lambası.
  torpidodan: 'rgba(247, 189, 63, 0.38)',
  kafa: 'rgba(52, 211, 153, 0.42)',
  // Beyaz diğer renklerle aynı alfada gözü alıyor — koyu zeminde doygunluğu
  // olmayan tek renk o, bu yüzden bilerek daha kısık.
  rushville: 'rgba(255, 255, 255, 0.26)',
  apex: 'rgba(251, 191, 36, 0.40)',
};

// Kartın mağaza butonları bu sırayla dizilir; oyunda hangi alan varsa o
// buton çıkar. İlk çıkan beyaz dolgulu (birincil), gerisi çerçeveli.
// Etiketler marka adı, iki dilde aynı — bu yüzden i18n'de değil.
const STORES = [
  { key: 'appStore', label: 'App Store' },
  { key: 'googlePlay', label: 'Google Play' },
  { key: 'itch', label: 'itch.io' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, type: 'spring', bounce: 0.2 },
  },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------
   Sahneler ekran dışındayken dursun.

   Bu dosyada 85 adet CSS `infinite` animasyon var — on bir kartın her
   birinde elle çizilmiş, sürekli oynayan bir sahne. Hepsi aynı anda
   dönüyordu: sayfanın en altındaki kartın közleri, kullanıcı hero'ya
   bakarken de yanıyordu. Compositor işi olsa bile bedava değil ve
   `Journey.jsx`'te zaten "sürekli çalışan animasyon bilerek yok"
   kuralını koymuştuk (bkz. CLAUDE.md, "Görsel bütçesi").

   Çözüm tek CSS kuralı: kart görünür alandan çıkınca üstüne `gc-idle`
   geliyor ve altındaki bütün animasyonlar `paused` oluyor. Durdurmak
   sıfırlamak değil — kart geri geldiğinde sahne kaldığı yerden devam
   ediyor, yani bakarken hiçbir fark yok.

   framer-motion animasyonlarını etkilemez (bu dosyada sadece 4 tane var,
   hepsi tek seferlik/küçük). rootMargin payı sayesinde kart ekrana
   girmeden önce sahne çoktan oynuyor oluyor.
------------------------------------------------------------------- */
// `.gc-idle` kuralı artık index.css'te (About'un İstanbul döşemesi de kullanıyor).

function useSceneIdle() {
  const ref = useRef(null);
  // Varsayılan false: IntersectionObserver yoksa ya da ilk callback daha
  // gelmediyse sahneler oynasın. Durdurmak gözlemcinin işi.
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setIdle(!entry.isIntersecting), {
      rootMargin: '300px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, idle];
}

/* ------------------------------------------------------------------
   3B tilt KALDIRILDI (2026-09-23) — geri koyma.

   Kartlar imlece göre ±6° dönüyordu (`useTilt`). Sorun abartı değildi,
   değerler zaten ölçülüydü; sorun şuydu:

   · **Çerçeve, içindeki işi sallıyordu.** Kartların içinde stüdyonun
     asıl zanaatı var — elle çizilmiş sahneler. Tilt onların çerçevesini
     döndürünce izleyici sanat eserine değil kutuya bakıyordu.
   · **Tek imlece üç tepki.** Spotlight imleci takip ediyor, sahne kendi
     animasyonunu oynuyor, kart da dönüyordu.
   · **Jenerik.** Sayfadaki diğer her hareket bu stüdyoya ait (Viewport
     canvas'ı, sahneler, GooeyTabs). Tilt, herhangi bir portföy
     şablonundan kopyalanmış olabilecek tek parçaydı — üstelik en
     önemli içeriğin üstünde duruyordu.
   · Ayrıca implementasyon "lastik" hissi veriyordu: her mousemove'da
     `transition: transform .1s` yazıldığı için kart imleci TAKİP
     etmiyor, KOVALIYORDU.

   Yerine gelen: saf CSS hover — 4px kalkma, kenar bir tık aydınlanıyor,
   altına indigo bir glow düşüyor. Transform yok denecek kadar küçük,
   `will-change` kalıcı değil (eskiden 11 kart sayfa boyunca ayrı
   compositor katmanındaydı), reduced-motion'da 4px anında oluyor ki o
   da zararsız — 6°'lik anlık bir dönmenin aksine.
------------------------------------------------------------------- */

const TRAIN_CSS = `
@keyframes tMove1{0%{left:0%;transform:translateX(-100%) scaleX(-1)}100%{left:100%;transform:translateX(0%) scaleX(-1)}}
@keyframes tMove2{0%{left:0%;transform:translateX(-100%) scaleX(-1)}100%{left:100%;transform:translateX(0%) scaleX(-1)}}
@keyframes tMove3{0%{left:0%;transform:translateX(-100%) scaleX(-1)}100%{left:100%;transform:translateX(0%) scaleX(-1)}}
@keyframes tMove4{0%{left:0%;transform:translateX(-100%) scaleX(-1)}100%{left:100%;transform:translateX(0%) scaleX(-1)}}
@keyframes tMove5{0%{left:0%;transform:translateX(-100%) scaleX(-1)}100%{left:100%;transform:translateX(0%) scaleX(-1)}}
@keyframes tMove6{0%{left:0%;transform:translateX(-100%) scaleX(-1)}100%{left:100%;transform:translateX(0%) scaleX(-1)}}
@keyframes steamRise{0%{opacity:.85;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(14px,-22px) scale(2.6)}}
@keyframes flameFlick{0%,100%{transform:scaleY(1) scaleX(1);opacity:1}35%{transform:scaleY(1.4) scaleX(.75);opacity:.8}65%{transform:scaleY(.85) scaleX(1.25);opacity:1}}
@keyframes flameSide{0%,100%{transform:scaleX(1) translateX(0);opacity:.9}50%{transform:scaleX(1.5) translateX(5px);opacity:.55}}
@keyframes glowBlink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes cpPulse{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes speedBlur{0%{transform:translateX(0);opacity:.7}100%{transform:translateX(55px);opacity:0}}
@keyframes bubble{0%{opacity:.85;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-16px) scale(1.7)}}
@keyframes armorVib{0%,100%{transform:translateY(0)}33%{transform:translateY(-1.2px)}66%{transform:translateY(1.2px)}}
@keyframes windLine{0%{transform:translateX(0);opacity:.65}100%{transform:translateX(80px);opacity:0}}
@keyframes scanMove{0%{transform:translateY(0)}100%{transform:translateY(200px)}}
@keyframes exhaustPuff{0%{opacity:.7;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(12px,-20px) scale(2.2)}}
@keyframes gridBlink{0%,100%{opacity:.03}50%{opacity:.1}}
@keyframes cyberGlow{0%,100%{box-shadow:0 0 10px #bd00ff, 0 0 16px rgba(189,0,255,.6), inset 0 0 8px rgba(236,72,153,.3)}50%{box-shadow:0 0 14px #bd00ff, 0 0 20px rgba(189,0,255,.7), inset 0 0 10px rgba(236,72,153,.4)}}
@keyframes cyberNeonGlow{0%,100%{box-shadow:0 0 10px rgba(236,72,153,.9),0 0 18px rgba(236,72,153,.7)}50%{box-shadow:0 0 14px rgba(236,72,153,1),0 0 22px rgba(236,72,153,.8)}}

.ts { position:relative; width:100%; height:190px; background:#060810; border-radius:14px; overflow:hidden; }
.ts-scan { position:absolute;inset:0;background:repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,0,0,.1) 3px,rgba(0,0,0,.1) 4px);pointer-events:none;z-index:18 }
.ts-scanbar { position:absolute;left:0;right:0;height:36px;background:linear-gradient(to bottom,transparent,rgba(99,102,241,.04),transparent);animation:scanMove 3.5s linear infinite;pointer-events:none;z-index:19 }
.ts-grid { position:absolute;inset:0;background-size:10px 10px;background-image:linear-gradient(to right,rgba(0,229,255,.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,229,255,.05) 1px,transparent 1px);opacity:.05;animation:gridBlink 6s infinite;pointer-events:none }
.lane { position:absolute;left:0;right:0 }
.rail { position:absolute;left:0;right:0;height:2px;border-radius:1px }
.ties { position:absolute;left:0;right:0;height:6px }

.tw { position:absolute;left:0;display:flex;flex-direction:row-reverse;align-items:flex-end;gap:2px }
.loco { position:relative;flex-shrink:0;border-radius:3px 7px 2px 2px }
.lcab { position:absolute;top:0;left:0;border-radius:2px 5px 0 0 }
.lwin { position:absolute;border-radius:2px }
.lhd { position:absolute;border-radius:50% }
.car { position:relative;flex-shrink:0;border-radius:2px }
.cwin { position:absolute;border-radius:1px }

.tw1 { animation:tMove1 11s linear 0s infinite;bottom:6px }
.tw2 { animation:tMove2 10s linear 1.6s infinite;bottom:6px }
.tw3 { animation:tMove3 8.5s linear 3s infinite;bottom:6px }
.tw4 { animation:tMove4 3.8s linear .6s infinite;bottom:6px }
.tw5 { animation:tMove5 9s linear 4.2s infinite;bottom:6px }
.tw6 { animation:tMove6 14s linear 1s infinite;bottom:6px }

.steam { position:absolute;border-radius:50%;animation:steamRise 1s ease-out infinite }
.flame { position:absolute;bottom:0;border-radius:50% 50% 20% 20%;animation:flameFlick .28s ease-in-out infinite }
.fside { position:absolute;border-radius:0 50% 50% 0;animation:flameSide .3s ease-in-out infinite }
.bub { position:absolute;border-radius:50%;animation:bubble 1.5s ease-out infinite }
.spd { position:absolute;height:1px;background:rgba(255,255,255,.5);border-radius:1px;animation:speedBlur .22s linear infinite }
.wnd { position:absolute;height:1px;border-radius:1px;animation:windLine .35s linear infinite }
.exh { position:absolute;border-radius:50%;animation:exhaustPuff .9s ease-out infinite }
.neon-strip { position:absolute;height:1px;background:#ec4899;box-shadow:0 0 6px #ec4899;border-radius:1px }
.cyber-detail { position:absolute;background:rgba(0,229,255,.3);border:1px solid rgba(0,229,255,.5);border-radius:1px }
`;

function TrainScene() {
  return (
    <div className="relative h-[190px] overflow-hidden rounded-card border-b border-white/5" style={{background:'#060810'}}>
      <style>{TRAIN_CSS}</style>
      <div className="ts-scan" />
      <div className="ts-scanbar" />
      <div className="ts-grid" />

      <div
        style={{position:'absolute',width:'180px',height:'50px',borderRadius:'50%',background:'rgba(99,102,241,.07)',filter:'blur(14px)',bottom:'10px',left:'30%',pointerEvents:'none'}}
      />
      <div
        style={{position:'absolute',width:'100px',height:'30px',borderRadius:'50%',background:'rgba(20,184,166,.06)',filter:'blur(10px)',bottom:'40px',left:'62%',pointerEvents:'none'}}
      />

      <div className="lane" style={{bottom:'155px',height:'30px'}}>
        <div className="ties" style={{bottom:0,background:'repeating-linear-gradient(to right,transparent 0,transparent 9px,rgba(100,100,100,.14) 9px,rgba(100,100,100,.14) 13px)'}} />
        <div className="rail" style={{bottom:'4px',background:'rgba(100,100,100,.45)'}} />
        <div className="tw tw6" style={{gap:'2px'}}>
          {[0,1,2].map(i=>(
            <div key={i} className="car" style={{width:'44px',height:'22px',background:'#161616',border:'1px solid #444',animation:'armorVib .16s linear infinite'}}>
              <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(to right,transparent 0,transparent 10px,rgba(80,80,80,.15) 10px,rgba(80,80,80,.15) 11px)'}} />
              <div style={{position:'absolute',top:'2px',left:'2px',right:'2px',height:'7px',background:'#1e1e1e',border:'1px solid #505050'}} />
              <div style={{position:'absolute',top:'11px',left:'2px',right:'2px',height:'6px',background:'#1e1e1e',border:'1px solid #484848'}} />
              <div style={{position:'absolute',width:'3px',height:'3px',background:'#555',borderRadius:'50%',top:'3px',left:'4px'}} />
              <div style={{position:'absolute',width:'3px',height:'3px',background:'#555',borderRadius:'50%',top:'3px',right:'4px'}} />
            </div>
          ))}
          <div className="loco" style={{width:'68px',height:'28px',background:'#1a1a1a',border:'1px solid #555',boxShadow:'0 0 6px rgba(100,100,100,.3)',animation:'armorVib .16s linear infinite'}}>
            <div style={{position:'absolute',top:'-10px',right:'14px',width:'18px',height:'10px',background:'#1a1a1a',border:'1px solid #555',borderRadius:'2px 2px 0 0'}}>
              <div style={{position:'absolute',top:'2px',right:'-10px',width:'12px',height:'3px',background:'#444',border:'1px solid #666',borderRadius:'0 2px 2px 0'}} />
            </div>
            <div className="exh" style={{width:'7px',height:'6px',background:'rgba(120,120,120,.7)',top:'-6px',right:'18px',animationDelay:'0s'}} />
            <div className="exh" style={{width:'5px',height:'5px',background:'rgba(100,100,100,.6)',top:'-6px',right:'24px',animationDelay:'.35s'}} />
            <div className="exh" style={{width:'6px',height:'5px',background:'rgba(80,80,80,.5)',top:'-6px',right:'14px',animationDelay:'.7s'}} />
            <div style={{position:'absolute',top:'2px',left:'2px',right:'2px',height:'8px',background:'#222',border:'1px solid #606060'}} />
            <div style={{position:'absolute',top:'13px',left:'2px',right:'2px',height:'7px',background:'#1e1e1e',border:'1px solid #505050'}} />
            <div className="lwin" style={{width:'8px',height:'5px',background:'rgba(255,100,0,.4)',border:'1px solid rgba(255,120,0,.6)',top:'4px',right:'8px',boxShadow:'0 0 4px rgba(255,100,0,.5)',animation:'glowBlink 1.2s infinite'}} />
            <div className="lhd" style={{width:'5px',height:'5px',background:'#ff8800',boxShadow:'0 0 6px #ff8800',top:'50%',left:'4px',transform:'translateY(-50%)',borderRadius:'2px',animation:'cpPulse 2s infinite'}} />
          </div>
        </div>
      </div>

      <div className="lane" style={{bottom:'122px',height:'30px'}}>
        <div className="ties" style={{bottom:0,background:'repeating-linear-gradient(to right,transparent 0,transparent 9px,rgba(0,180,216,.12) 9px,rgba(0,180,216,.12) 13px)'}} />
        <div className="rail" style={{bottom:'4px',background:'rgba(0,180,216,.4)',boxShadow:'0 0 3px rgba(0,180,216,.4)'}} />
        <div className="tw tw5" style={{gap:'2px'}}>
          {[0,1,2].map(i=>(
            <div key={i} className="car" style={{width:'36px',height:'18px',background:'#021018',border:'1px solid #0096b4'}}>
              <div className="bub" style={{width:'4px',height:'4px',background:'rgba(0,200,240,.55)',border:'1px solid rgba(0,220,255,.7)',left:'6px',bottom:'18px',animationDelay:`${i*0.45}s`}} />
              <div className="bub" style={{width:'3px',height:'3px',background:'rgba(0,200,240,.45)',border:'1px solid rgba(0,220,255,.6)',left:'22px',bottom:'18px',animationDelay:`${i*0.45+0.6}s`}} />
              <div className="cwin" style={{width:'8px',height:'5px',background:'rgba(0,180,216,.3)',border:'1px solid rgba(0,180,216,.5)',top:'3px',left:'4px'}} />
              <div className="cwin" style={{width:'8px',height:'5px',background:'rgba(0,180,216,.3)',border:'1px solid rgba(0,180,216,.5)',top:'3px',left:'18px'}} />
            </div>
          ))}
          <div className="loco" style={{width:'56px',height:'24px',background:'#03111e',border:'1px solid #00b4d8',boxShadow:'0 0 8px rgba(0,180,216,.35)',borderRadius:'3px 8px 2px 2px'}}>
            <div className="bub" style={{width:'5px',height:'5px',background:'rgba(0,200,240,.6)',border:'1px solid rgba(0,220,255,.8)',left:'10px',bottom:'24px',animationDelay:'.2s'}} />
            <div className="bub" style={{width:'4px',height:'4px',background:'rgba(0,200,240,.5)',border:'1px solid rgba(0,220,255,.7)',left:'24px',bottom:'24px',animationDelay:'.75s'}} />
            <div className="bub" style={{width:'3px',height:'3px',background:'rgba(0,200,240,.4)',border:'1px solid rgba(0,220,255,.6)',left:'38px',bottom:'24px',animationDelay:'1.2s'}} />
            <div className="lcab" style={{width:'22px',height:'16px',background:'#020c16',border:'1px solid #00b4d8',top:0,left:0,borderRadius:'2px 0 0 0'}}>
              <div className="lwin" style={{width:'10px',height:'7px',background:'rgba(0,200,240,.45)',border:'1px solid #00b4d8',top:'3px',left:'6px'}} />
            </div>
            <div className="lhd" style={{width:'5px',height:'5px',background:'#00d4ff',boxShadow:'0 0 8px #00d4ff, 0 0 14px rgba(0,212,255,.6)',top:'50%',left:'4px',transform:'translateY(-50%)',animation:'glowBlink 2.5s infinite'}} />
          </div>
        </div>
      </div>

      <div className="lane" style={{bottom:'89px',height:'26px'}}>
        <div className="ties" style={{bottom:0,background:'repeating-linear-gradient(to right,transparent 0,transparent 9px,rgba(180,190,220,.14) 9px,rgba(180,190,220,.14) 13px)'}} />
        <div className="rail" style={{bottom:'4px',background:'rgba(180,190,240,.4)'}} />
        <div className="tw tw4" style={{gap:'1px'}}>
          {[0,1,2,3].map(i=>(
            <div key={i} className="car" style={{width:'42px',height:'17px',background:'#edf0ff',border:'1px solid #c0c8e8',borderRadius:'1px'}}>
              <div style={{position:'absolute',top:'5px',left:0,right:0,height:'3px',background:'#3b5bdb'}} />
              <div style={{position:'absolute',top:'10px',left:0,right:0,height:'1px',background:'#748ffc'}} />
              <div className="cwin" style={{width:'9px',height:'5px',background:'rgba(59,91,219,.12)',border:'1px solid rgba(59,91,219,.3)',top:'2px',left:'4px',borderRadius:'1px'}} />
              <div className="cwin" style={{width:'9px',height:'5px',background:'rgba(59,91,219,.12)',border:'1px solid rgba(59,91,219,.3)',top:'2px',left:'20px',borderRadius:'1px'}} />
              <div className="cwin" style={{width:'9px',height:'5px',background:'rgba(59,91,219,.12)',border:'1px solid rgba(59,91,219,.3)',top:'2px',left:'32px',borderRadius:'1px'}} />
              <div className="wnd" style={{width:'28px',background:'rgba(59,91,219,.35)',top:'6px',left:'-30px',animationDelay:`${i*0.08}s`}} />
              <div className="wnd" style={{width:'18px',background:'rgba(59,91,219,.2)',top:'12px',left:'-20px',animationDelay:`${i*0.08+0.05}s`}} />
            </div>
          ))}
          <div className="loco" style={{width:'72px',height:'20px',background:'#f0f4ff',border:'1px solid #c0c8e8',borderRadius:'12px 2px 2px 2px'}}>
            <div style={{position:'absolute',left:'-14px',top:0,bottom:0,width:'14px',background:'#e8eeff',borderRadius:'10px 0 0 10px',border:'1px solid #c0c8e8',borderRight:'none'}} />
            <div style={{position:'absolute',top:'6px',left:0,right:0,height:'3px',background:'#3b5bdb',borderRadius:'2px 0 0 2px'}} />
            <div style={{position:'absolute',top:'11px',left:0,right:0,height:'1px',background:'#748ffc'}} />
            <div className="spd" style={{width:'55px',top:'3px',left:'72px',animationDelay:'0s'}} />
            <div className="spd" style={{width:'38px',top:'9px',left:'72px',animationDelay:'.07s'}} />
            <div className="spd" style={{width:'46px',top:'15px',left:'72px',animationDelay:'.03s'}} />
            <div className="lwin" style={{width:'12px',height:'6px',background:'rgba(59,91,219,.15)',border:'1px solid rgba(59,91,219,.4)',top:'2px',right:'8px',borderRadius:'1px'}} />
            <div className="lhd" style={{width:'4px',height:'4px',background:'#fff',boxShadow:'0 0 8px #fff,0 0 20px rgba(255,255,255,.8)',top:'50%',left:'-10px',transform:'translateY(-50%)'}} />
          </div>
        </div>
      </div>

      <div className="lane" style={{bottom:'58px',height:'28px'}}>
        <div className="ties" style={{bottom:0,background:'repeating-linear-gradient(to right,transparent 0,transparent 9px,rgba(189,0,255,.15) 9px,rgba(189,0,255,.15) 13px)'}} />
        <div className="rail" style={{bottom:'4px',background:'rgba(189,0,255,.5)',boxShadow:'0 0 6px rgba(189,0,255,.6)'}} />
        <div className="tw tw3" style={{gap:'2px'}}>
          {[0,1,2,3].map(i=>(
            <div key={i} className="car" style={{width:'34px',height:'16px',background:'#0b0214',border:'1px solid #bd00ff',borderRadius:'2px',animation:'cyberGlow 4s infinite'}}>
              <div className="neon-strip" style={{left:'4px',top:'3px',width:'14px',background:'#ec4899',boxShadow:'0 0 6px #ec4899'}} />
              <div className="neon-strip" style={{left:'22px',top:'3px',width:'6px',background:'#ec4899',boxShadow:'0 0 6px #ec4899'}} />
              <div style={{position:'absolute',bottom:'4px',left:'3px',right:'3px',height:'3px',background:'repeating-linear-gradient(to right,transparent 0,transparent 2px,rgba(236,72,153,.5) 2px,rgba(236,72,153,.5) 4px)',opacity:.5}} />
              <div className="cwin" style={{width:'6px',height:'3px',background:'rgba(255,0,127,.4)',boxShadow:'0 0 4px rgba(255,0,127,.6)',top:'7px',left:'6px',animation:'cpPulse 1.5s infinite'}} />
              <div className="cwin" style={{width:'6px',height:'3px',background:'rgba(255,0,127,.4)',boxShadow:'0 0 4px rgba(255,0,127,.6)',top:'7px',left:'20px',animation:'cpPulse 1.5s infinite',animationDelay:'.3s'}} />
              <div className="wnd" style={{width:'22px',background:'rgba(189,0,255,.6)',boxShadow:'0 0 5px rgba(189,0,255,.5)',top:'11px',left:'-24px',animationDelay:`${i*0.1}s`}} />
            </div>
          ))}
          <div className="loco" style={{width:'58px',height:'22px',background:'#0f031c',border:'1px solid #bd00ff',boxShadow:'0 0 10px rgba(189,0,255,.4),inset 0 0 8px rgba(189,0,255,.1)',borderRadius:'2px 8px 2px 2px',animation:'cyberGlow 4s infinite',animationDelay:'.2s'}}>
            <div className="cyber-detail" style={{left:'2px',top:'2px',width:'10px',height:'4px',background:'rgba(0,255,102,.4)',borderColor:'#00ff66',animation:'cyberNeonGlow 3s infinite'}} />
            <div className="neon-strip" style={{left:'16px',top:'2px',width:'18px',background:'#ec4899',boxShadow:'0 0 6px #ec4899'}} />
            <div style={{position:'absolute',top:'8px',left:'16px',right:'8px',height:'2px',background:'rgba(236,72,153,.6)',borderRadius:'1px'}} />
            <div style={{position:'absolute',bottom:'4px',left:'16px',right:'8px',height:'3px',background:'repeating-linear-gradient(to right,transparent 0,transparent 2px,rgba(189,0,255,.5) 2px,rgba(189,0,255,.5) 4px)',opacity:.6}} />
            <div className="lcab" style={{width:'22px',height:'15px',background:'#0b0214',border:'1px solid #bd00ff',boxShadow:'0 0 8px rgba(189,0,255,.4)',top:'-1px',left:'-1px',borderRadius:'2px 0 0 0'}}>
              <div className="lwin" style={{width:'9px',height:'6px',background:'rgba(0,255,102,.5)',border:'1px solid #00ff66',top:'3px',left:'6px',boxShadow:'0 0 6px rgba(0,255,102,.8)',animation:'cpPulse 1.2s infinite'}} />
              <div className="neon-strip" style={{top:'-1px',left:'6px',width:'12px',height:'1.5px',background:'#ec4899'}} />
            </div>
            <div className="wnd" style={{width:'30px',background:'rgba(189,0,255,.7)',boxShadow:'0 0 6px rgba(189,0,255,.6)',top:'11px',right:'60px',animationDelay:'0s'}} />
            <div className="lhd" style={{width:'5px',height:'5px',background:'#00ff66',boxShadow:'0 0 10px #00ff66,0 0 20px rgba(0,255,102,.7)',top:'50%',left:'4px',transform:'translateY(-50%)',animation:'cpPulse .8s infinite'}} />
          </div>
        </div>
      </div>

      <div className="lane" style={{bottom:'24px',height:'32px'}}>
        <div className="ties" style={{bottom:0,background:'repeating-linear-gradient(to right,transparent 0,transparent 9px,rgba(255,60,0,.13) 9px,rgba(255,60,0,.13) 13px)'}} />
        <div className="rail" style={{bottom:'4px',background:'rgba(255,58,0,.5)',boxShadow:'0 0 4px rgba(255,58,0,.4)'}} />
        <div className="tw tw2" style={{gap:'2px'}}>
          {[0,1,2].map(i=>(
            <div key={i} className="car" style={{width:'38px',height:'20px',background:'#140300',border:'1px solid #cc2a00',boxShadow:'0 0 5px rgba(200,40,0,.3)'}}>
              <div style={{position:'absolute',top:'-14px',left:0,right:0,height:'14px',overflow:'visible'}}>
                <div className="flame" style={{width:'8px',height:'11px',background:'#ff4400',left:'4px',animationDelay:`${i*0.12}s`}} />
                <div className="flame" style={{width:'6px',height:'9px',background:'#ff7700',left:'14px',animationDelay:`${i*0.12+0.1}s`}} />
                <div className="flame" style={{width:'5px',height:'8px',background:'#ffaa00',left:'24px',animationDelay:`${i*0.12+0.2}s`}} />
                <div className="exh" style={{width:'6px',height:'5px',background:'rgba(60,20,0,.7)',left:'8px',bottom:'11px',animationDelay:`${i*0.3}s`}} />
                <div className="exh" style={{width:'5px',height:'4px',background:'rgba(40,10,0,.6)',left:'18px',bottom:'11px',animationDelay:`${i*0.3+0.4}s`}} />
              </div>
              <div className="cwin" style={{width:'8px',height:'5px',background:'rgba(255,60,0,.4)',border:'1px solid rgba(255,80,0,.6)',top:'4px',left:'4px',animation:'cpPulse .8s infinite'}} />
              <div className="cwin" style={{width:'8px',height:'5px',background:'rgba(255,60,0,.4)',border:'1px solid rgba(255,80,0,.6)',top:'4px',left:'18px',animation:'cpPulse .8s infinite',animationDelay:'.2s'}} />
            </div>
          ))}
          <div className="loco" style={{width:'62px',height:'26px',background:'#1a0500',border:'1px solid #ff3a00',boxShadow:'0 0 10px rgba(255,58,0,.5)'}}>
            <div style={{position:'absolute',top:'-18px',left:0,right:0,height:'18px',overflow:'visible'}}>
              <div className="flame" style={{width:'11px',height:'16px',background:'#ff2200',left:'6px',animationDelay:'0s'}} />
              <div className="flame" style={{width:'9px',height:'14px',background:'#ff5500',left:'16px',animationDelay:'.08s'}} />
              <div className="flame" style={{width:'8px',height:'12px',background:'#ff8800',left:'26px',animationDelay:'.16s'}} />
              <div className="flame" style={{width:'7px',height:'10px',background:'#ffcc00',left:'38px',animationDelay:'.06s'}} />
              <div className="exh" style={{width:'8px',height:'7px',background:'rgba(80,20,0,.8)',left:'8px',bottom:'16px',animationDelay:'0s'}} />
              <div className="exh" style={{width:'7px',height:'6px',background:'rgba(60,15,0,.7)',left:'20px',bottom:'16px',animationDelay:'.3s'}} />
              <div className="exh" style={{width:'6px',height:'5px',background:'rgba(50,10,0,.6)',left:'34px',bottom:'16px',animationDelay:'.6s'}} />
            </div>
            <div style={{position:'absolute',left:'-10px',top:'50%',transform:'translateY(-50%)',borderRight:'10px solid rgba(255,58,0,.8)',borderTop:'6px solid transparent',borderBottom:'6px solid transparent'}} />
            <div className="lcab" style={{width:'26px',height:'18px',background:'#120300',border:'1px solid #ff3a00',top:0,left:0,borderRadius:'2px 0 0 0'}}>
              <div className="lwin" style={{width:'10px',height:'7px',background:'rgba(255,80,0,.6)',border:'1px solid #ff6020',top:'3px',left:'8px',boxShadow:'0 0 4px rgba(255,80,0,.8)',animation:'cpPulse .6s infinite'}} />
            </div>
            <div className="lhd" style={{width:'6px',height:'6px',background:'#ff4400',boxShadow:'0 0 8px #ff4400,0 0 16px rgba(255,68,0,.7)',top:'50%',left:'4px',transform:'translateY(-50%)',animation:'glowBlink .5s infinite'}} />
          </div>
        </div>
      </div>

      <div className="lane" style={{bottom:'0px',height:'22px'}}>
        <div className="ties" style={{bottom:0,background:'repeating-linear-gradient(to right,transparent 0,transparent 9px,rgba(139,105,20,.14) 9px,rgba(139,105,20,.14) 13px)'}} />
        <div className="rail" style={{bottom:'3px',background:'rgba(139,105,20,.5)'}} />
        <div className="tw tw1" style={{gap:'2px'}}>
          {[0,1,2].map(i=>(
            <div key={i} className="car" style={{width:'36px',height:'18px',background:'#251a0e',border:'1px solid #6b4f10'}}>
              <div className="cwin" style={{width:'8px',height:'5px',background:'rgba(255,200,60,.2)',border:'1px solid rgba(255,200,60,.4)',top:'3px',left:'4px'}} />
              <div className="cwin" style={{width:'8px',height:'5px',background:'rgba(255,200,60,.2)',border:'1px solid rgba(255,200,60,.4)',top:'3px',left:'18px'}} />
            </div>
          ))}
          <div className="loco" style={{width:'58px',height:'24px',background:'#2a1f14',border:'1px solid #8B6914',boxShadow:'0 0 6px rgba(139,105,20,.3)'}}>
            <div style={{position:'absolute',width:'6px',height:'10px',background:'#1e160d',border:'1px solid #8B6914',borderBottom:'none',top:'-10px',right:'12px',borderRadius:'2px 2px 0 0'}}>
              <div className="steam" style={{width:'5px',height:'4px',background:'rgba(200,180,140,.75)',left:'0px',top:'-4px',animationDelay:'0s'}} />
              <div className="steam" style={{width:'7px',height:'5px',background:'rgba(200,180,140,.55)',left:'-2px',top:'-4px',animationDelay:'.38s'}} />
              <div className="steam" style={{width:'6px',height:'5px',background:'rgba(200,180,140,.65)',left:'1px',top:'-4px',animationDelay:'.76s'}} />
            </div>
            <div className="lcab" style={{width:'24px',height:'16px',background:'#1e160d',border:'1px solid #8B6914',top:0,left:0,borderRadius:'2px 0 0 0'}}>
              <div className="lwin" style={{width:'10px',height:'7px',background:'rgba(255,220,100,.3)',border:'1px solid rgba(255,220,100,.5)',top:'3px',left:'8px'}} />
            </div>
            <div className="lhd" style={{width:'5px',height:'5px',background:'#ffdc64',boxShadow:'0 0 6px #ffdc64,0 0 12px rgba(255,220,100,.6)',top:'50%',left:'4px',transform:'translateY(-50%)',animation:'glowBlink 1.8s infinite'}} />
          </div>
        </div>
      </div>

    </div>
  );
}

const KK_CSS = `
@keyframes kkBall{0%{left:26%;bottom:30%}14%{left:38%;bottom:62%}28%{left:50%;bottom:34%}42%{left:64%;bottom:62%}50%{left:72%;bottom:42%}64%{left:58%;bottom:64%}78%{left:44%;bottom:34%}92%{left:32%;bottom:60%}100%{left:26%;bottom:30%}}
@keyframes kkSpin{0%{transform:translate(-50%,-50%) rotate(0)}100%{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes kkBobA{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes kkBobB{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes kkSh{0%,100%{opacity:.3;transform:translateX(-50%) scaleX(1)}50%{opacity:.16;transform:translateX(-50%) scaleX(.7)}}
@keyframes kkShine{0%{transform:translateX(-120%)}100%{transform:translateX(360%)}}

.kk { position:relative; width:100%; height:190px; border-radius:14px; overflow:hidden; background:linear-gradient(180deg,#2aa24a,#1c8038); }
.kk-stripes { position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0,rgba(255,255,255,.06) 38px,rgba(0,0,0,.05) 38px,rgba(0,0,0,.05) 76px) }
.kk-vign { position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,transparent 52%,rgba(0,0,0,.28));pointer-events:none }
.kk-mid { position:absolute;left:50%;top:0;bottom:0;width:2px;background:rgba(255,255,255,.32);transform:translateX(-50%) }
.kk-circle { position:absolute;left:50%;top:50%;width:76px;height:76px;border:2px solid rgba(255,255,255,.32);border-radius:50%;transform:translate(-50%,-50%) }
.kk-spot { position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.55);transform:translate(-50%,-50%) }
.kk-goal { position:absolute;top:50%;width:22px;height:84px;transform:translateY(-50%) }
.kk-net { position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(255,255,255,.32) 1px,transparent 1px),linear-gradient(0deg,rgba(255,255,255,.32) 1px,transparent 1px);background-size:6px 6px }
.kk-post { position:absolute;top:0;bottom:0;width:4px;background:#fff;border-radius:2px;box-shadow:0 0 5px rgba(255,255,255,.5) }
.kk-bar { position:absolute;left:0;right:0;height:4px;background:#fff;border-radius:2px;box-shadow:0 0 5px rgba(255,255,255,.5) }
.kk-sh { position:absolute;width:36px;height:9px;border-radius:50%;background:rgba(0,0,0,.42) }
.kk-head { position:absolute;width:40px;height:33px;border-radius:50%;border:3px solid #14233b;box-sizing:border-box }
.kk-eye { position:absolute;top:9px;width:5px;height:6px;border-radius:50%;background:#14233b }
.kk-mouth { position:absolute;bottom:8px;left:50%;width:13px;height:2px;border-radius:2px;background:#14233b;transform:translateX(-50%) }
.kk-ball { position:absolute;width:15px;height:15px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.35);animation:kkBall 4.6s ease-in-out infinite;z-index:7 }
.kk-ball::before { content:'';position:absolute;left:50%;top:50%;width:7px;height:7px;background:#14233b;clip-path:polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%);animation:kkSpin .6s linear infinite }
.kk-ball::after { content:'';position:absolute;inset:0;border-radius:50%;border:1px solid rgba(0,0,0,.22) }
.kk-charge { position:absolute;left:50%;bottom:13px;width:54%;transform:translateX(-50%);text-align:center }
.kk-charge-txt { font-size:7px;font-weight:900;letter-spacing:1.5px;color:#ffd23f;text-shadow:0 1px 2px rgba(0,0,0,.5);margin-bottom:3px }
.kk-charge-bar { position:relative;height:6px;border-radius:3px;background:rgba(0,0,0,.32);overflow:hidden }
.kk-charge-fill { position:absolute;inset:0;background:linear-gradient(90deg,#f59e0b,#ffe066,#f59e0b) }
.kk-charge-shine { position:absolute;top:0;bottom:0;width:26%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);animation:kkShine 2s linear infinite }
`;

function KafaKafayaScene() {
  return (
    <div className="kk">
      <style>{KK_CSS}</style>
      <div className="kk-stripes" />
      <div className="kk-circle" />
      <div className="kk-mid" />
      <div className="kk-spot" />
      <div className="kk-vign" />

      <div className="kk-goal" style={{ left: '0px' }}>
        <div className="kk-net" />
        <div className="kk-bar" style={{ top: '0px' }} />
        <div className="kk-bar" style={{ bottom: '0px' }} />
        <div className="kk-post" style={{ right: '0px' }} />
      </div>
      <div className="kk-goal" style={{ right: '0px' }}>
        <div className="kk-net" />
        <div className="kk-bar" style={{ top: '0px' }} />
        <div className="kk-bar" style={{ bottom: '0px' }} />
        <div className="kk-post" style={{ left: '0px' }} />
      </div>

      <div className="kk-sh" style={{ left: 'calc(15% + 20px)', bottom: '36px', animation: 'kkSh 1.5s ease-in-out infinite' }} />
      <div className="kk-sh" style={{ left: 'calc(83% - 20px)', bottom: '52px', animation: 'kkSh 1.7s ease-in-out infinite .3s' }} />

      <div className="kk-head" style={{ left: '15%', bottom: '40px', background: 'radial-gradient(circle at 42% 34%,#ffe066,#f5b400)', animation: 'kkBobA 1.5s ease-in-out infinite' }}>
        <div className="kk-eye" style={{ left: '9px' }} />
        <div className="kk-eye" style={{ right: '9px' }} />
        <div className="kk-mouth" />
      </div>
      <div className="kk-head" style={{ right: '17%', bottom: '56px', background: 'radial-gradient(circle at 58% 34%,#7fc4ff,#2f7fd6)', animation: 'kkBobB 1.7s ease-in-out infinite .3s' }}>
        <div className="kk-eye" style={{ left: '9px' }} />
        <div className="kk-eye" style={{ right: '9px' }} />
        <div className="kk-mouth" />
      </div>

      <div className="kk-ball" />

      <div className="kk-charge">
        <div className="kk-charge-txt">SÜPER ŞUT HAZIR!</div>
        <div className="kk-charge-bar">
          <div className="kk-charge-fill" />
          <div className="kk-charge-shine" />
        </div>
      </div>
    </div>
  );
}

const RV_CSS = `
@keyframes rvDrive{from{left:var(--x1)}to{left:var(--x2)}}
@keyframes rvDriveRev{from{left:var(--x2)}to{left:var(--x1)}}
@keyframes rvPip{0%,100%{opacity:.5}50%{opacity:.85}}

.rv { position:relative; width:100%; height:190px; border-radius:14px; overflow:hidden; background:#ece7dc; }
.rv-grid { position:absolute;inset:0;background-color:#e1dacb;background-image:linear-gradient(90deg,#f3efe7 26px,transparent 26px),linear-gradient(#f3efe7 26px,transparent 26px);background-size:30px 30px;background-position:8px 10px }
.rv-road { position:absolute;background:#3c3a45;border-radius:7px }
.rv-car { position:absolute;width:16px;height:8px;border-radius:2px;transform:translateY(-50%);box-shadow:0 1px 1px rgba(0,0,0,.22);z-index:4 }
.rv-car::after { content:'';position:absolute;top:1px;bottom:1px;left:2px;width:4px;background:rgba(255,255,255,.55);border-radius:1px }
.rv-tile { position:absolute;width:21px;height:21px;border-radius:5px;box-shadow:0 1px 2px rgba(0,0,0,.16);z-index:5 }
.rv-pip { position:absolute;width:3px;height:3px;border-radius:50%;animation:rvPip 2.6s ease-in-out infinite }
.rv-house { position:absolute;width:21px;height:21px;border-radius:5px;box-shadow:0 1px 2px rgba(0,0,0,.18);z-index:5 }
.rv-stud { position:absolute;top:-3px;width:2.5px;height:2.5px;border-radius:50%;background:currentColor }
.rv-door { position:absolute;bottom:2px;left:50%;width:8px;height:8px;border-radius:3px 3px 0 0;transform:translateX(-50%);background:rgba(255,255,255,.6) }
`;

function RushvilleScene() {
  const cars = [
    { top: 103, c: '#45b3a0', x1: '8%', x2: '50%', anim: 'rvDrive', dur: 6, d: '0s' },
    { top: 103, c: '#e2683e', x1: '8%', x2: '50%', anim: 'rvDriveRev', dur: 7, d: '1.2s' },
    { top: 147, c: '#8fbf5a', x1: '34%', x2: '86%', anim: 'rvDrive', dur: 5.5, d: '.4s' },
    { top: 147, c: '#e0a82e', x1: '34%', x2: '86%', anim: 'rvDriveRev', dur: 6.5, d: '2.2s' },
  ];
  const tiles = [
    { right: '6%', top: '50px', c: '#8fbf5a', pip: '#5c8a37', p: 'tri' },
    { left: '34%', top: '100px', c: '#8fbf5a', pip: '#5c8a37', p: 'tri' },
    { left: '49%', top: '74px', c: '#e2683e', pip: '#9e4421', p: 'col' },
    { left: '50%', top: '108px', c: '#e0a82e', pip: '#9c7416', p: 'col' },
    { right: '7%', top: '106px', c: '#3fb5a0', pip: '#247063', p: 'col' },
    { left: '20%', top: '150px', c: '#8fbf5a', pip: '#5c8a37', p: 'tri' },
    { left: '60%', top: '146px', c: '#e0a82e', pip: '#9c7416', p: 'col' },
  ];
  const houses = [
    { left: '11%', top: '108px', c: '#45b3a0' },
    { right: '8%', top: '150px', c: '#e2683e' },
  ];
  const tri = [[8, 4], [4, 12], [12, 12]];
  const col = [[9, 4], [9, 9], [9, 14]];
  return (
    <div className="rv">
      <style>{RV_CSS}</style>
      <div className="rv-grid" />

      <div className="rv-road" style={{ top: '96px', left: '7%', width: '52%', height: '14px' }} />
      <div className="rv-road" style={{ top: '140px', left: '32%', width: '60%', height: '14px' }} />
      <div className="rv-road" style={{ top: '52px', left: '46%', width: '30%', height: '13px' }} />
      <div className="rv-road" style={{ top: '52px', left: '74%', width: '13px', height: '54px' }} />
      <div className="rv-road" style={{ top: '60px', left: '9%', width: '13px', height: '48px' }} />

      {cars.map((c, i) => (
        <div key={i} className="rv-car" style={{ top: `${c.top}px`, background: c.c, '--x1': c.x1, '--x2': c.x2, animation: `${c.anim} ${c.dur}s linear ${c.d} infinite` }} />
      ))}

      {tiles.map((t, i) => {
        const pts = t.p === 'col' ? col : tri;
        return (
          <div key={i} className="rv-tile" style={{ left: t.left, right: t.right, top: t.top, background: t.c }}>
            {pts.map(([x, y], j) => (
              <div key={j} className="rv-pip" style={{ left: `${x}px`, top: `${y}px`, background: t.pip, animationDelay: `${(i + j) * 0.3}s` }} />
            ))}
          </div>
        );
      })}

      {houses.map((h, i) => (
        <div key={i} className="rv-house" style={{ left: h.left, right: h.right, top: h.top, background: h.c, color: h.c }}>
          <div className="rv-stud" style={{ left: '5px' }} />
          <div className="rv-stud" style={{ left: '9.5px' }} />
          <div className="rv-stud" style={{ left: '14px' }} />
          <div className="rv-door" />
        </div>
      ))}
    </div>
  );
}

const SS_CSS = `
@keyframes ssSwing{0%{transform:rotate(-32deg)}50%{transform:rotate(34deg)}100%{transform:rotate(-32deg)}}
@keyframes ssDrift{0%,100%{left:26%}50%{left:62%}}
@keyframes ssWin{0%,100%{opacity:.5}50%{opacity:.95}}
@keyframes ssStar{0%,100%{opacity:.2}50%{opacity:.9}}
@keyframes ssMoon{0%,100%{box-shadow:0 0 18px rgba(255,236,200,.4)}50%{box-shadow:0 0 26px rgba(255,236,200,.55)}}

.ss { position:relative; width:100%; height:190px; background:linear-gradient(to bottom,#150f2b 0%,#0d0a1e 45%,#060810 100%); border-radius:14px; overflow:hidden; }
.ss-moon { position:absolute;top:22px;right:34px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 35%,#fff7e6,#ffd9a0);animation:ssMoon 5s ease-in-out infinite }
.ss-star { position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:ssStar 3s ease-in-out infinite }
.ss-haze { position:absolute;left:0;right:0;bottom:0;height:60%;background:radial-gradient(ellipse at 50% 130%,rgba(124,58,237,.18),transparent 70%) }
.ss-bld { position:absolute;bottom:0;border-radius:2px 2px 0 0 }
.ss-bwin { position:absolute;width:3px;height:4px;border-radius:1px;animation:ssWin 2.6s ease-in-out infinite }
.ss-rig { position:absolute;top:-6px;transform-origin:top center;animation:ssSwing 2.6s ease-in-out infinite, ssDrift 5.2s ease-in-out infinite;z-index:6 }
.ss-pivot { width:6px;height:6px;border-radius:50%;background:#00e5ff;box-shadow:0 0 8px #00e5ff;margin:0 auto -2px;position:relative }
.ss-web { width:2px;height:118px;margin:0 auto;background:linear-gradient(to bottom,rgba(0,229,255,.7),rgba(0,229,255,.15));box-shadow:0 0 5px rgba(0,229,255,.5) }
.ss-hero { width:18px;height:22px;margin:-2px auto 0;border-radius:8px 8px 7px 7px;background:linear-gradient(to bottom,#16213e,#0b1228);border:1px solid rgba(0,229,255,.5);box-shadow:0 0 8px rgba(0,229,255,.35);position:relative }
.ss-lens { position:absolute;top:5px;width:5px;height:3px;border-radius:60% 60% 40% 40%;background:rgba(0,229,255,.9);box-shadow:0 0 4px rgba(0,229,255,.8) }
`;

function SkylineSwingerScene() {
  const buildings = [
    { left: 0, w: 34, h: 70, c: '#0e1430' },
    { left: 30, w: 28, h: 96, c: '#10183a' },
    { left: 64, w: 38, h: 58, c: '#0c1230' },
    { left: 150, w: 30, h: 104, c: '#111a3e' },
    { left: 210, w: 44, h: 76, c: '#0e1636' },
    { left: 300, w: 26, h: 120, c: '#121c44' },
    { left: 360, w: 40, h: 64, c: '#0d1432' },
  ];
  const stars = [[20, 30], [70, 18], [130, 40], [200, 24], [260, 46], [330, 20], [390, 38]];
  return (
    <div className="ss">
      <style>{SS_CSS}</style>
      {stars.map(([l, t], i) => (<div key={i} className="ss-star" style={{ left: `${l}px`, top: `${t}px`, animationDelay: `${i * 0.4}s` }} />))}
      <div className="ss-moon" />
      <div className="ss-haze" />

      {buildings.map((b, i) => (
        <div key={i} className="ss-bld" style={{ left: `${b.left}px`, width: `${b.w}px`, height: `${b.h}px`, background: `linear-gradient(to top,${b.c},#0a0f24)`, boxShadow: 'inset 0 0 0 1px rgba(124,58,237,.10)' }}>
          {Array.from({ length: Math.min(4, Math.floor(b.h / 26)) }).flatMap((_, r) =>
            [0, 1].map((c) => {
              const lit = (i + r + c) % 4 !== 0;
              return (
                <div key={`${r}-${c}`} className="ss-bwin" style={{
                  left: `${5 + c * (b.w - 13)}px`,
                  top: `${9 + r * 14}px`,
                  background: lit ? 'rgba(255,200,120,.7)' : 'rgba(255,200,120,.12)',
                  boxShadow: lit ? '0 0 3px rgba(255,200,120,.5)' : 'none',
                  animationDelay: `${(i + r + c) * 0.25}s`,
                }} />
              );
            })
          )}
        </div>
      ))}

      <div className="ss-rig">
        <div className="ss-pivot" />
        <div className="ss-web" />
        <div className="ss-hero">
          <div className="ss-lens" style={{ left: '3px' }} />
          <div className="ss-lens" style={{ right: '3px' }} />
        </div>
      </div>
    </div>
  );
}

const FS_CSS = `
@keyframes fsOrbit{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
@keyframes fsOrbitR{0%{transform:rotate(0)}100%{transform:rotate(-360deg)}}
@keyframes fsRing{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(1.05);opacity:.9}}
@keyframes fsLaunch{0%{transform:translate(0,0);opacity:0}10%{opacity:1}55%{opacity:1}70%{transform:translate(var(--lx),var(--ly));opacity:0}100%{transform:translate(var(--lx),var(--ly));opacity:0}}
@keyframes fsPerfect{0%,58%{transform:scale(0);opacity:0}66%{transform:scale(1.3);opacity:1}82%{transform:scale(1);opacity:.9}100%{transform:scale(1.4);opacity:0}}
@keyframes fsStar{0%,100%{opacity:.15}50%{opacity:.8}}

.fs { position:relative; width:100%; height:190px; background:radial-gradient(ellipse at 50% 50%, rgba(0,229,255,.06), #060810 70%); border-radius:14px; overflow:hidden; }
.fs-star { position:absolute;width:2px;height:2px;background:#cdeffd;border-radius:50%;animation:fsStar 3s ease-in-out infinite }
.fs-ring { position:absolute;border-radius:50%;border:2px solid;animation:fsRing 3s ease-in-out infinite }
.fs-orbit { position:absolute;width:0;height:0 }
.fs-dot { position:absolute;border-radius:50% }
.fs-launch { position:absolute;width:9px;height:9px;border-radius:50%;animation:fsLaunch 3.4s ease-in-out infinite }
.fs-perfect { position:absolute;font-weight:900;font-size:13px;letter-spacing:1px;animation:fsPerfect 3.4s ease-in-out infinite }
`;

function ForzaShiftScene() {
  const rings = [
    { left: '26%', top: 96, r: 24, color: '#00E5FF', dur: '4s', rev: false },
    { left: '52%', top: 70, r: 18, color: '#FF00E5', dur: '3s', rev: true },
    { left: '76%', top: 112, r: 28, color: '#FF6600', dur: '5s', rev: false },
  ];
  const stars = [[30, 28], [90, 120], [150, 40], [210, 150], [300, 30], [360, 130], [420, 60]];
  return (
    <div className="fs">
      <style>{FS_CSS}</style>
      {stars.map(([l, t], i) => (<div key={i} className="fs-star" style={{ left: `${l}px`, top: `${t}px`, animationDelay: `${i * 0.45}s` }} />))}

      {rings.map((rg, i) => (
        <div key={i}>
          <div className="fs-ring" style={{ left: rg.left, top: `${rg.top}px`, width: `${rg.r * 2}px`, height: `${rg.r * 2}px`, marginLeft: `-${rg.r}px`, marginTop: `-${rg.r}px`, borderColor: rg.color, boxShadow: `0 0 10px ${rg.color}55, inset 0 0 8px ${rg.color}33`, animationDelay: `${i * 0.5}s` }} />
          <div className="fs-orbit" style={{ left: rg.left, top: `${rg.top}px`, animation: `${rg.rev ? 'fsOrbitR' : 'fsOrbit'} ${rg.dur} linear infinite` }}>
            <div className="fs-dot" style={{ left: '0', top: '0', width: '8px', height: '8px', margin: '-4px 0 0 -4px', transform: `translateX(${rg.r}px)`, background: rg.color, boxShadow: `0 0 8px ${rg.color}, 0 0 14px ${rg.color}aa` }} />
          </div>
        </div>
      ))}

      <div style={{ position: 'absolute', left: '50%', top: '72px' }}>
        <div className="fs-launch" style={{ left: '-4px', top: '-4px', background: '#FF00E5', boxShadow: '0 0 8px #FF00E5, 0 0 16px #FF00E5', '--lx': '78px', '--ly': '40px' }} />
        <div className="fs-perfect" style={{ left: '66px', top: '32px', color: '#FF6600', textShadow: '0 0 8px #FF6600' }}>PERFECT</div>
      </div>
    </div>
  );
}

const AS_CSS = `
@keyframes asFloodPulse { 0%,100% { opacity:.5; } 50% { opacity:.85; } }
@keyframes asPoleTwinkle { 0%,100% { opacity:.5; } 50% { opacity:1; } }
@keyframes asSmokePuff { 0% { opacity:.5; transform:translate(0,0) scale(.35); } 60% { opacity:.24; } 100% { opacity:0; transform:translate(-11px,-10px) scale(2.2); } }
@keyframes asFlameFlicker { 0%,100% { opacity:.9; transform:scaleX(1) scaleY(1); } 30% { opacity:.5; transform:scaleX(.6) scaleY(1.25); } 55% { opacity:1; transform:scaleX(1.25) scaleY(.75); } 80% { opacity:.65; transform:scaleX(.8) scaleY(1.1); } }

.as { position:relative; width:100%; height:190px; background:#06070a; border-radius:14px; overflow:hidden; }
.as-svg { position:absolute; inset:0; width:100%; height:100%; display:block; }
.as-vignette { position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse at 50% 46%, transparent 40%, rgba(2,3,6,.62) 100%); }
.as-flood-a { animation:asFloodPulse 5.4s ease-in-out infinite; }
.as-flood-b { animation:asFloodPulse 6.6s ease-in-out infinite 1.3s; }
.as-pole { animation:asPoleTwinkle 3s ease-in-out infinite; }
.as-smoke1 { animation:asSmokePuff 2.3s ease-out infinite; }
.as-smoke2 { animation:asSmokePuff 2.3s ease-out infinite .6s; }
.as-smoke3 { animation:asSmokePuff 2.3s ease-out infinite 1.2s; }
.as-flame { animation:asFlameFlicker .2s ease-in-out infinite; transform-origin:center; }
`;

function ApexShiftScene() {
  return (
    <div className="as">
      <style>{AS_CSS}</style>
      <svg
        className="as-svg"
        viewBox="0 0 800 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="asAsphalt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34373f" />
            <stop offset="55%" stopColor="#22242a" />
            <stop offset="100%" stopColor="#131418" />
          </linearGradient>
          <radialGradient id="asInfield" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#142018" />
            <stop offset="100%" stopColor="#080b09" />
          </radialGradient>
          <radialGradient id="asFloodGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(226,236,255,.55)" />
            <stop offset="100%" stopColor="rgba(226,236,255,0)" />
          </radialGradient>
          <radialGradient id="asSmokeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(214,216,220,.8)" />
            <stop offset="100%" stopColor="rgba(214,216,220,0)" />
          </radialGradient>
          <radialGradient id="asPoleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6da" />
            <stop offset="100%" stopColor="rgba(255,246,218,0)" />
          </radialGradient>
          <radialGradient id="asFlameGrad" cx="35%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#ffe38a" />
            <stop offset="45%" stopColor="#ff8a2b" />
            <stop offset="100%" stopColor="#5aa8ff" />
          </radialGradient>
          <pattern id="asChecker" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#0b0b0d" />
            <rect width="4" height="4" fill="#f5f5f5" />
            <rect x="4" y="4" width="4" height="4" fill="#f5f5f5" />
          </pattern>
          {/* Buradaki <filter id="asGrain"> (feTurbulence) kaldırıldı — pist
              üstünde %5 alfayla neredeyse görünmüyordu ama WebKit turbulence'ı
              CPU'da rasterize ettiği için mount anında bedelini ödüyorduk.
              Grain gerekiyorsa App.jsx'teki /noise.png katmanı zaten var. */}
          <clipPath id="asTrackClip">
            <path
              d="M155,20 L645,20 A130,130 0 1 1 645,280 L155,280 A130,130 0 1 1 155,20 Z M245,80 L555,80 A70,70 0 1 1 555,220 L245,220 A70,70 0 1 1 245,80 Z"
              clipRule="evenodd"
            />
          </clipPath>
          <symbol id="asCarBody" viewBox="-18 -8 36 16">
            <rect x="-16" y="-6.4" width="30" height="12.8" rx="5.4" fill="currentColor" stroke="rgba(0,0,0,.55)" strokeWidth="0.6" />
            <rect x="-18" y="-7.4" width="3" height="14.8" rx="1" fill="#111318" />
            <rect x="15" y="-7" width="4" height="14" rx="1.2" fill="#111318" />
            <rect x="-2.5" y="-4.4" width="10" height="8.8" rx="2.8" fill="#0a0a10" opacity="0.9" />
            <rect x="-16" y="-1" width="29" height="2" fill="rgba(255,255,255,.32)" />
            <rect x="-11.5" y="-8" width="6" height="2.2" rx="1" fill="#0d0e12" />
            <rect x="-11.5" y="5.8" width="6" height="2.2" rx="1" fill="#0d0e12" />
            <rect x="6" y="-8" width="6" height="2.2" rx="1" fill="#0d0e12" />
            <rect x="6" y="5.8" width="6" height="2.2" rx="1" fill="#0d0e12" />
            <ellipse cx="15.6" cy="-4" rx="1.5" ry="1" fill="#fff6da" />
            <ellipse cx="15.6" cy="4" rx="1.5" ry="1" fill="#fff6da" />
            <rect x="-17.4" y="-5" width="1.8" height="2" fill="#ff2d2d" />
            <rect x="-17.4" y="3" width="1.8" height="2" fill="#ff2d2d" />
          </symbol>
        </defs>

        <rect x="0" y="0" width="800" height="300" fill="#06070a" />

        <ellipse className="as-flood-a" cx="230" cy="70" rx="190" ry="90" fill="url(#asFloodGrad)" />
        <ellipse className="as-flood-b" cx="560" cy="230" rx="190" ry="90" fill="url(#asFloodGrad)" />

        <path d="M245,80 L555,80 A70,70 0 1 1 555,220 L245,220 A70,70 0 1 1 245,80 Z" fill="url(#asInfield)" />

        <path d="M155,5 L645,5 A145,145 0 1 1 645,295 L155,295 A145,145 0 1 1 155,5 Z"
          fill="none" stroke="#3c3f46" strokeWidth="7" />
        <path d="M155,5 L645,5 A145,145 0 1 1 645,295 L155,295 A145,145 0 1 1 155,5 Z"
          fill="none" stroke="#8b8f97" strokeWidth="1.2" strokeDasharray="3 9" opacity=".5" />

        <path
          d="M155,20 L645,20 A130,130 0 1 1 645,280 L155,280 A130,130 0 1 1 155,20 Z M245,80 L555,80 A70,70 0 1 1 555,220 L245,220 A70,70 0 1 1 245,80 Z"
          fillRule="evenodd"
          fill="url(#asAsphalt)"
        />

        <path d="M555,80 A70,70 0 1 1 555,220" fill="none" stroke="#f2f2f0" strokeWidth="9" />
        <path d="M555,80 A70,70 0 1 1 555,220" fill="none" stroke="#d81e2c" strokeWidth="9" strokeDasharray="13 13" />
        <path d="M245,220 A70,70 0 1 1 245,80" fill="none" stroke="#f2f2f0" strokeWidth="9" />
        <path d="M245,220 A70,70 0 1 1 245,80" fill="none" stroke="#d81e2c" strokeWidth="9" strokeDasharray="13 13" />
        <path d="M645,20 A130,130 0 1 1 645,280" fill="none" stroke="#f2f2f0" strokeWidth="7" opacity=".85" />
        <path d="M645,20 A130,130 0 1 1 645,280" fill="none" stroke="#d81e2c" strokeWidth="7" strokeDasharray="11 11" opacity=".85" />
        <path d="M155,280 A130,130 0 1 1 155,20" fill="none" stroke="#f2f2f0" strokeWidth="7" opacity=".85" />
        <path d="M155,280 A130,130 0 1 1 155,20" fill="none" stroke="#d81e2c" strokeWidth="7" strokeDasharray="11 11" opacity=".85" />

        <path d="M560,95 Q600,80 615,110" stroke="#000" strokeWidth="3" strokeLinecap="round" opacity=".2" fill="none" />
        <path d="M560,205 Q600,220 615,190" stroke="#000" strokeWidth="3" strokeLinecap="round" opacity=".16" fill="none" />
        <path d="M240,95 Q200,80 185,110" stroke="#000" strokeWidth="3" strokeLinecap="round" opacity=".2" fill="none" />
        <path d="M240,205 Q200,220 185,190" stroke="#000" strokeWidth="3" strokeLinecap="round" opacity=".16" fill="none" />

        <path id="apexLaneB" d="M200,50 L600,50 A100,100 0 1 1 600,250 L200,250 A100,100 0 1 1 200,50 Z"
          fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.4" strokeDasharray="6 9" />
        <path id="apexLaneA" d="M173,32 L627,32 A118,118 0 1 1 627,268 L173,268 A118,118 0 1 1 173,32 Z" fill="none" stroke="none" />
        <path id="apexLaneC" d="M227,68 L573,68 A82,82 0 1 1 573,232 L227,232 A82,82 0 1 1 227,68 Z" fill="none" stroke="none" />

        <rect x="389" y="20" width="2" height="60" fill="rgba(255,255,255,.85)" />
        <rect x="393" y="20" width="14" height="60" fill="url(#asChecker)" />
        <rect x="409" y="20" width="2" height="60" fill="rgba(255,255,255,.85)" />

        {[[155,5],[400,5],[645,5],[155,295],[400,295],[645,295],[10,150],[790,150]].map(([x,y],i) => (
          <circle key={i} className="as-pole" cx={x} cy={y} r="9" fill="url(#asPoleGlow)" style={{ animationDelay: `${i * 0.35}s` }} />
        ))}

        {[[605,92],[605,208],[195,92],[195,208]].map(([x,y], gi) => (
          <g key={gi}>
            <circle className="as-smoke1" cx={x} cy={y} r="6" fill="url(#asSmokeGrad)" />
            <circle className="as-smoke2" cx={x + 3} cy={y - 2} r="5" fill="url(#asSmokeGrad)" />
            <circle className="as-smoke3" cx={x - 2} cy={y + 3} r="4.5" fill="url(#asSmokeGrad)" />
          </g>
        ))}

        <g>
          <animateMotion dur="5.6s" begin="0s" repeatCount="indefinite" rotate="auto">
            <mpath href="#apexLaneA" xlinkHref="#apexLaneA" />
          </animateMotion>
          <ellipse className="as-flame" cx="-20.5" cy="-1.6" rx="2.3" ry="1" fill="url(#asFlameGrad)" />
          <use href="#asCarBody" xlinkHref="#asCarBody" x="-18" y="-8" width="36" height="16" style={{ color: '#c8202a' }} />
        </g>
        <g>
          <animateMotion dur="6.2s" begin="-2.1s" repeatCount="indefinite" rotate="auto">
            <mpath href="#apexLaneB" xlinkHref="#apexLaneB" />
          </animateMotion>
          <ellipse className="as-flame" cx="-20.5" cy="-1.6" rx="2.3" ry="1" fill="url(#asFlameGrad)" style={{ animationDelay: '.07s' }} />
          <use href="#asCarBody" xlinkHref="#asCarBody" x="-18" y="-8" width="36" height="16" style={{ color: '#cfd3d8' }} />
        </g>
        <g>
          <animateMotion dur="4.9s" begin="-3.4s" repeatCount="indefinite" rotate="auto">
            <mpath href="#apexLaneC" xlinkHref="#apexLaneC" />
          </animateMotion>
          <ellipse className="as-flame" cx="-20.5" cy="-1.6" rx="2.3" ry="1" fill="url(#asFlameGrad)" style={{ animationDelay: '.13s' }} />
          <use href="#asCarBody" xlinkHref="#asCarBody" x="-18" y="-8" width="36" height="16" style={{ color: '#2a63d6' }} />
        </g>
      </svg>
      <div className="as-vignette" />
    </div>
  );
}

const DC_CSS = `
@keyframes dcSiege{0%{transform:scale(.5);opacity:0}20%{opacity:.85}100%{transform:scale(1.75);opacity:0}}
@keyframes dcMarch{0%{transform:rotate(var(--rot)) translateY(0) scale(.6);opacity:0}18%{opacity:1}72%{opacity:1}100%{transform:rotate(var(--rot)) translateY(var(--dist)) scale(1);opacity:0}}
@keyframes dcBreathe{0%,100%{opacity:.82}50%{opacity:1}}
@keyframes dcLie{0%,60%{opacity:1}64%,86%{opacity:0}90%,100%{opacity:1}}
@keyframes dcTruth{0%,60%{opacity:0}66%,84%{opacity:1}90%,100%{opacity:0}}
@keyframes dcGlitch{0%,59%{transform:translateX(-50%)}62%{transform:translate(-50%) translateX(-2px)}65%{transform:translate(-50%) translateX(2px)}68%,100%{transform:translateX(-50%)}}
@keyframes dcScan{0%{transform:translateY(-40px)}100%{transform:translateY(220px)}}

@media (prefers-reduced-motion: reduce) { .dc * { animation: none !important } }

.dc { position:relative;width:100%;height:190px;border-radius:14px;overflow:hidden;background:radial-gradient(ellipse at 50% 42%,#141b36,#070a16 74%) }
.dc-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.06) 1px,transparent 1px);background-size:24px 24px }
.dc-scan { position:absolute;left:0;right:0;height:30px;background:linear-gradient(180deg,transparent,rgba(129,140,248,.09),transparent);animation:dcScan 6s linear infinite }
.dc-vign { position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 46%,rgba(0,0,0,.5));pointer-events:none }

.dc-hex { position:absolute;width:52px;height:46px;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);display:flex;align-items:center;justify-content:center;animation:dcBreathe 3.6s ease-in-out infinite;z-index:4 }
.dc-core { position:absolute;left:3px;top:2.5px;width:46px;height:41px;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);background:#080c1b }
.dc-num { position:relative;z-index:2;font-size:11px;font-weight:900;letter-spacing:.5px;line-height:1 }
.dc-stack { position:relative;z-index:2;width:24px;height:12px }
.dc-stack span { position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;line-height:1 }

.dc-ring { position:absolute;width:66px;height:58px;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);background:rgba(244,63,94,.45);animation:dcSiege 2.6s ease-out infinite;z-index:3 }
.dc-arrow { position:absolute;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:9px solid #f43f5e;filter:drop-shadow(0 0 4px rgba(244,63,94,.85));animation:dcMarch 2.6s ease-in-out infinite;z-index:6 }

.dc-tag { position:absolute;bottom:9px;left:50%;display:flex;align-items:center;gap:7px;padding:3px 9px;border-radius:999px;background:rgba(5,7,15,.82);border:1px solid rgba(255,255,255,.09);transform:translateX(-50%);animation:dcGlitch 4.6s steps(1,end) infinite;z-index:8 }
.dc-tag-lbl { position:relative;width:62px;height:9px }
.dc-tag-lbl span { position:absolute;left:0;top:0;font-size:7px;font-weight:900;letter-spacing:1.6px;line-height:9px;white-space:nowrap }
.dc-tag-val { position:relative;width:20px;height:11px }
.dc-tag-val span { position:absolute;right:0;top:0;font-size:11px;font-weight:900;line-height:11px }
/* Animasyon kapalıyken (reduced-motion) iki katman üst üste binmesin: yalan görünür, gerçek gizli. */
.dc-lie { opacity:1 }
.dc-truth { opacity:0 }
`;

function DecoyScene() {
  const { t } = useLang();
  const words = t.games.scenes.decoy;
  // Bal peteği: merkez + 6 komşu. Yatay adım 39px (52 * .75), dikey 23px (46 / 2).
  const hexes = [
    { dx: 0, dy: -46, c: '#22d3ee', n: '9' },
    { dx: -39, dy: -23, c: '#818cf8', n: '14' },
    { dx: 39, dy: -23, c: '#c084fc', n: '11' },
    { dx: -39, dy: 23, c: '#34d399', n: '18' },
    { dx: 39, dy: 23, c: '#fbbf24', n: '7' },
    { dx: 0, dy: 46, c: '#fb7185', n: '13' },
  ];
  // Kuşatma: üç komşudan merkeze aynı anda yürüyen kuvvet.
  // rot 0deg = ucu yukarı; ok kendi ucuna doğru ilerlesin diye dist negatif.
  const marchers = [
    { dx: -39, dy: -23, rot: 120, d: '0s' },
    { dx: 39, dy: -23, rot: -120, d: '.35s' },
    { dx: 0, dy: -46, rot: 180, d: '.7s' },
  ];
  return (
    <div className="dc">
      <style>{DC_CSS}</style>
      <div className="dc-grid" />
      <div className="dc-scan" />

      {hexes.map((h, i) => (
        <div
          key={i}
          className="dc-hex"
          style={{ left: `calc(50% - 26px + ${h.dx}px)`, top: `${72 + h.dy}px`, background: h.c, animationDelay: `${i * 0.3}s` }}
        >
          <div className="dc-core" />
          <span className="dc-num" style={{ color: h.c }}>{h.n}</span>
        </div>
      ))}

      {/* Kuşatılan bölge: yayınladığı güç 27, gerçekte 12 */}
      <div className="dc-ring" style={{ left: 'calc(50% - 33px)', top: '66px' }} />
      <div className="dc-hex" style={{ left: 'calc(50% - 26px)', top: '72px', background: '#f43f5e', animation: 'none' }}>
        <div className="dc-core" />
        <div className="dc-stack">
          <span className="dc-lie" style={{ color: '#fda4af', animation: 'dcLie 4.6s steps(1,end) infinite' }}>27</span>
          <span className="dc-truth" style={{ color: '#f43f5e', animation: 'dcTruth 4.6s steps(1,end) infinite' }}>12</span>
        </div>
      </div>

      {marchers.map((m, i) => (
        <div
          key={i}
          className="dc-arrow"
          style={{
            left: `calc(50% - 5px + ${m.dx}px)`,
            top: `${89 + m.dy}px`,
            '--rot': `${m.rot}deg`,
            '--dist': '-34px',
            animationDelay: m.d,
          }}
        />
      ))}

      <div className="dc-vign" />

      <div className="dc-tag">
        <div className="dc-tag-lbl">
          <span className="dc-lie" style={{ color: '#94a3b8', animation: 'dcLie 4.6s steps(1,end) infinite' }}>{words.broadcast}</span>
          <span className="dc-truth" style={{ color: '#f43f5e', animation: 'dcTruth 4.6s steps(1,end) infinite' }}>{words.real}</span>
        </div>
        <div className="dc-tag-val">
          <span className="dc-lie" style={{ color: '#e2e8f0', animation: 'dcLie 4.6s steps(1,end) infinite' }}>27</span>
          <span className="dc-truth" style={{ color: '#f43f5e', animation: 'dcTruth 4.6s steps(1,end) infinite' }}>12</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Torpidodan — gece galerisinde ekspertiz (2026-09-27).

   Oyun (~/Desktop/projects/torpidodan) koyu "gece galerisi" + galeri
   sarısı + TR evrak estetiği kullanıyor ve tek cümlesi şu: gerçek değeri
   asla göremezsin, ekspertize para verdikçe tahminin belirsizlik bandı
   daralır. Sahne o döngünün 12 sn'lik hâli; her tur başka bir ilan:

     göz kararı (±%51) → tarama → temel (±%22) → tarama → tam (±%7)
     → gizli kusur → "pahalı duruyor" → pazarlık → el sıkışma
     → ışıklar söner, galeriye sıradaki araç gelir

   · Renkler oyunun `src/styles/tokens.css`'inden birebir: ink zemin,
     --sari #f7bd3f, plaka mavisi, kaporta skalası (orijinal/lokal/
     boyalı/değişen), --kar, --zarar, --amber.
   · Araçlar oyunun kendi çizimleri (`public/arac/*.webp`, 640×427,
     şeffaf) → `public/games/torpidodan/`. Kullanıcının isteğiyle üç
     grup: Klior gibiler, Fulanya gibiler, Porsen gibiler. Klior'un
     kırmızısı mercan turuncuya, Fulanya'nın gümüşü beyaza çevrildi
     (yalnız bu sitedeki kopyalar; oyunun dosyaları aynı).
   · SAYILAR UYDURMA DEĞİL. Her araç, oyunun domain koduyla üretilmiş
     gerçek bir ilan: `generateListing` + üç seviyede `inspect()` +
     `estimateHint()`, bütün beceriler 0. Pazarlık da oyunun
     `openNegotiation` + `makeOffer`'ıyla oynandı: oyuncu tam ekspertiz
     tahmininin %3 altından yuvarlak bir teklif veriyor, satıcı kabul
     ediyor (teklif gerçek değere bağlı gizli tabanın üstünde). Klior
     2020, Fulanya 2012 ve beyaz olacak şekilde arandı. `seed` alanı
     `createRng` tohumu — tekrar üretmek için bkz. src/CLAUDE.md.
   · Bant oyundaki `UncertaintyBar`/`NegoEstimate` ile aynı: eksen sabit
     (göz kararı bandı), altın iğne tahmin, mavi iğne masadaki fiyat.
     `mark` = `estimateHint().priceMark` (son eleman anlaşılan fiyat),
     `delta` = (fiyat − tahmin) / tahmin → alt yazılardaki yüzdeler.
   · Hasar lekeleri oyundaki `ArtWear` dili (dolgu .36, çerçeve, 38°
     tarama, harf) ama kutu değil, her görselin panellerine elle
     oturtulmuş çokgenler (640×427 görsel koordinatı). Tarama çizgisi
     geçerken boyanıyorlar: boyalı/lokal birinci taramada (temel),
     değişen ikincide (tam). Hangi parçanın ne olduğu simülasyondan;
     iki kapılılarda (Porsen, M8.5) arka kapısı hasarsız ilan seçildi.
   · Görselin üstündeki rozet oyundaki `art__marks` kuralıyla: boyalı
     varsa B, değişen bulununca D. Lokal boya B saymaz (`isRepainted`).

   Zaman çizelgesi CSS'te (tek 12 sn'lik döngü, yalnız transform/
   opacity). Araç değişimi React'te: `tdDim` her tur bittiğinde
   `animationiteration` atıyor, o an ışık tamamen sönük ve bütün yazılar
   gizli — değişim görünmüyor. Ekran dışında `.gc-idle` animasyonu
   durdurduğu için tur da ilerlemiyor. Hareket azaltmada animasyon
   kalkar, ilk araç ve TABAN stiller (el sıkışma karesi) kalır; yeni bir
   öğe eklerken taban stilini de "anlaşma" hâline göre yaz.
------------------------------------------------------------------- */
const TD_DIR = '/games/torpidodan/';

// panels: [durum, çokgen, harfX, harfY] — koordinatlar 640×427 görselde.
const TD_CARS = [
  {
    img: 'klior', brand: 'Renohut', model: 'Klior', year: 2020, km: 119110, seed: 1404595,
    ask: 552233, deal: 454000, delta: [0.0821, 0.1839, 0.1792], mark: [0.581, 0.68, 0.676, 0.47],
    flag: 'tramerHidden', tramer: 115470,
    panels: [
      ['degisen', 'M157 140L343 152L338 170L320 183L297 191L243 207L173 227L90 215L42 206L42 192L60 173L103 152Z', 185, 192],
      ['boyali', 'M297 191L320 183L338 170L343 153L378 158L382 200L385 245L384 270L372 256L356 244L336 237L314 237L294 243L278 254L266 268L256 262L262 240L280 214Z', 334, 224],
    ],
  },
  {
    img: 'fulanya', brand: 'Renohut', model: 'Fulanya', year: 2012, km: 269819, seed: 1241903,
    ask: 151783, deal: 123000, delta: [0.3572, 0.1714, 0.192], mark: [0.85, 0.668, 0.688, 0.467],
    flag: 'tramerHidden', tramer: 112796,
    panels: [
      ['boyali', 'M165 150L350 161L325 180L300 201L235 214L172 226L110 219L52 209L50 197L90 176L125 160Z', 193, 199],
      ['degisen', 'M300 202L325 180L347 162L372 168L376 210L378 250L377 283L370 252L356 236L331 230L302 236L282 248L284 232L291 218Z', 340, 221],
      ['lokalBoyali', 'M374 173L486 161L487 220L483 279L381 292L377 232Z', 431, 237],
    ],
  },
  {
    img: 'porsen', brand: 'Porsen', model: 'Dokuzbirlik', year: 2012, km: 291986, seed: 1845784,
    ask: 1757282, deal: 1293000, delta: [0.2134, 0.0564, 0.3175], mark: [0.709, 0.555, 0.811, 0.47],
    flag: 'tramerHidden', tramer: 958932,
    panels: [
      ['degisen', 'M228 222L236 196L282 174L322 165L380 163L402 170L405 225L406 282L398 262L386 240L368 227L350 220L330 221L312 228L302 238L266 245L231 240Z', 324, 217],
      ['boyali', 'M406 173L525 155L531 190L529 235L524 268L408 293L405 230Z', 467, 234],
    ],
  },
  {
    img: 'yarisir', brand: 'Yota', model: 'Yarışır', year: 2010, km: 239205, seed: 228680,
    ask: 328964, deal: 240000, delta: [0.2565, 0.1526, 0.3248], mark: [0.751, 0.65, 0.818, 0.467],
    flag: 'tramerHidden', tramer: 160390,
    panels: [
      ['degisen', 'M380 191L500 166L502 230L500 296L396 315L388 250Z', 445, 252],
      ['boyali', 'M502 166L575 146L583 180L576 213L558 235L545 265L541 288L502 296Z', 536, 226],
      ['lokalBoyali', 'M578 146L598 149L603 180L620 195L623 215L618 235L600 223L580 220L560 231L576 213L583 180Z', 597, 207],
    ],
  },
  {
    img: 'degea', brand: 'Fiyat', model: 'DeGea', year: 2018, km: 107647, seed: 16730,
    ask: 512101, deal: 433000, delta: [-0.1566, 0.0936, 0.1455], mark: [0.346, 0.592, 0.643, 0.469],
    flag: 'tramerHidden', tramer: 108520,
    panels: [
      ['degisen', 'M500 154L580 138L586 165L581 199L566 220L555 241L550 265L498 278L499 215Z', 537, 214],
      ['boyali', 'M581 138L608 143L611 170L629 185L634 210L631 234L615 225L595 222L570 226L566 220L581 199L586 165Z', 603, 204],
    ],
  },
  {
    img: 'm85', brand: 'BMB', model: 'M8.5', year: 2020, km: 90822, seed: 1695625,
    ask: 2564126, deal: 1967000, delta: [-0.086, 0.0149, 0.2639], mark: [0.416, 0.515, 0.759, 0.47],
    flag: 'kmRollback', tramer: 0,
    panels: [
      ['degisen', 'M334 203L370 185L415 168L429 168L431 210L433 260L425 235L408 215L380 208L350 210L328 225L323 223L330 213Z', 394, 212],
      ['boyali', 'M433 161L540 150L546 190L543 235L538 245L434 261L431 210Z', 487, 216],
    ],
  },
  {
    img: 'kroket', brand: 'DasVolk', model: 'Kroket', year: 2025, km: 8817, seed: 57705,
    ask: 1923628, deal: 1544000, delta: [0.463, 0.2091, 0.2084], mark: [0.954, 0.705, 0.704, 0.471],
    flag: 'tramerHidden', tramer: 167019,
    panels: [
      ['degisen', 'M503 161L580 153L585 180L580 210L566 234L556 260L551 279L508 286L505 225Z', 539, 225],
      ['lokalBoyali', 'M581 153L616 158L620 185L631 198L633 220L629 238L613 228L598 223L580 225L566 234L580 210L585 180Z', 604, 208],
    ],
  },
  {
    img: 'kolalara', brand: 'Yota', model: 'Kolalara', year: 2017, km: 215909, seed: 143893,
    ask: 763789, deal: 667000, delta: [0.3628, 0.1304, 0.1101], mark: [0.856, 0.628, 0.608, 0.47],
    flag: 'tramerHidden', tramer: 107237,
    panels: [
      ['degisen', 'M155 158L345 168L335 183L313 206L250 219L185 230L128 225L73 219L55 203L85 180L120 166Z', 196, 205],
      ['boyali', 'M313 206L335 183L345 168L395 176L398 240L400 298L392 265L376 245L350 236L322 238L300 250L287 268L293 240L304 221Z', 356, 227],
      ['lokalBoyali', 'M500 165L580 150L588 180L583 210L568 233L556 260L550 280L505 289L502 230Z', 539, 226],
    ],
  },
  {
    img: 'sivil-r', brand: 'Honto', model: 'Sivil R', year: 2017, km: 122080, seed: 138673,
    ask: 1192829, deal: 1041000, delta: [0.3094, 0.104, 0.1105], mark: [0.803, 0.602, 0.608, 0.47],
    flag: 'tramerHidden', tramer: 150674,
    panels: [
      ['degisen', 'M175 150L362 161L345 178L305 199L250 210L203 220L136 215L70 210L55 197L85 170L128 157Z', 200, 196],
      ['boyali', 'M305 199L345 178L362 161L392 165L396 230L400 293L395 262L382 240L360 228L335 227L315 236L302 250L300 228Z', 356, 219],
    ],
  },
];

const TD_HARF = { boyali: 'B', lokalBoyali: 'L', degisen: 'D' };

/** Oyundaki NegoEstimate alt yazısının aynısı, simülasyonun sayılarıyla. */
function tdCaptions(car, w, fmt) {
  const tl = (n) => `${fmt.format(n)} TL`;
  const pct = (d) => w.pct.replace('{n}', Math.abs(Math.round(d * 100)));
  const inside = (d) =>
    Math.round(d * 100) === 0 ? w.same : w.inside.replace('{p}', pct(d)).replace('{dir}', d > 0 ? w.up : w.down);
  return [
    inside(car.delta[0]),
    inside(car.delta[1]),
    w.flags[car.flag].replace('{tl}', tl(car.tramer)),
    w.above.replace('{p}', pct(car.delta[2])),
    w.dealLine.replace('{tl}', tl(car.deal)),
  ];
}

const TD_CSS = `
/* Zaman çizelgesi (12 sn, %1 = 0,12 sn):
   0–3      ışık titreyip yanar, yazılar belirir | 20,5–29,5  1. tarama (boyalı, lokal)
   30       TEMEL: bant ±%22                     | 43,5–52,5  2. tarama (değişen)
   53       TAM: bant ±%7, gizli kusur           | 63         "pahalı duruyor", iğne yanıp söner
   73,5–76  pazarlık: iğne banda girer           | 95,5–100   yazılar söner, ışık titreyip kararır
   100 = 0  React sıradaki aracı koyar (tdDim'in animationiteration'ı) */
@keyframes tdBar{0%{opacity:.15}1.2%{opacity:1}2%{opacity:.4}3.2%,95.4%{opacity:1}96.2%{opacity:.3}97%{opacity:.9}97.8%{opacity:.2}98.6%,100%{opacity:.15}}
@keyframes tdDim{0%{opacity:.82}1.2%{opacity:.45}2%{opacity:.7}3.2%,95.4%{opacity:0}96.2%{opacity:.5}97%{opacity:.2}97.8%{opacity:.6}98.6%,100%{opacity:.82}}
@keyframes tdHold{0%,.6%{opacity:0}3%,95.4%{opacity:1}96.8%,100%{opacity:0}}
@keyframes tdScan{0%,20%{transform:translateX(-6%);opacity:0}20.8%,29.2%{opacity:1}30%{transform:translateX(106%);opacity:0}30.1%,43%{transform:translateX(-6%);opacity:0}43.8%,52.2%{opacity:1}53%,100%{transform:translateX(106%);opacity:0}}
@keyframes tdWipeA{0%,20.54%{transform:translateX(-100%)}29.46%,97%{transform:translateX(0)}97.5%,100%{transform:translateX(-100%)}}
@keyframes tdWipeAIn{0%,20.54%{transform:translateX(100%)}29.46%,97%{transform:translateX(0)}97.5%,100%{transform:translateX(100%)}}
@keyframes tdWipeB{0%,43.54%{transform:translateX(-100%)}52.46%,97%{transform:translateX(0)}97.5%,100%{transform:translateX(-100%)}}
@keyframes tdWipeBIn{0%,43.54%{transform:translateX(100%)}52.46%,97%{transform:translateX(0)}97.5%,100%{transform:translateX(100%)}}
@keyframes tdMarkB{0%,29.4%{opacity:0;transform:scale(.5)}30.2%{opacity:1;transform:scale(1.18)}31%,52.6%{opacity:1;transform:scale(1)}53.2%,100%{opacity:0;transform:scale(1)}}
@keyframes tdMarkD{0%,52.4%{opacity:0;transform:scale(.5)}53.2%{opacity:1;transform:scale(1.18)}54%,100%{opacity:1;transform:scale(1)}}
@keyframes tdPip2{0%,29.8%{opacity:0;transform:scale(.4)}30.6%{opacity:1;transform:scale(1.35)}31.4%,100%{opacity:1;transform:scale(1)}}
@keyframes tdPip3{0%,52.8%{opacity:0;transform:scale(.4)}53.6%{opacity:1;transform:scale(1.35)}54.4%,100%{opacity:1;transform:scale(1)}}
@keyframes tdT1{0%,29.8%{opacity:1;transform:translateY(0)}30.6%,100%{opacity:0;transform:translateY(-3px)}}
@keyframes tdT2{0%,29.8%{opacity:0;transform:translateY(3px)}30.6%,52.8%{opacity:1;transform:translateY(0)}53.6%,100%{opacity:0;transform:translateY(-3px)}}
@keyframes tdT3{0%,52.8%{opacity:0;transform:translateY(3px)}53.6%,100%{opacity:1;transform:translateY(0)}}
@keyframes tdC3{0%,52.8%{opacity:0;transform:translateY(3px)}53.6%,62.8%{opacity:1;transform:translateY(0)}63.6%,100%{opacity:0;transform:translateY(-3px)}}
@keyframes tdC4{0%,62.8%{opacity:0;transform:translateY(3px)}63.6%,72.8%{opacity:1;transform:translateY(0)}73.6%,100%{opacity:0;transform:translateY(-3px)}}
@keyframes tdC5{0%,73.4%{opacity:0;transform:translateY(3px)}74.4%,100%{opacity:1;transform:translateY(0)}}
@keyframes tdZone{0%{transform:scaleX(1)}7%{transform:scaleX(.965)}14%{transform:scaleX(1)}21%{transform:scaleX(.965)}29.8%{transform:scaleX(1);animation-timing-function:cubic-bezier(.22,1.15,.36,1)}33%{transform:scaleX(.4235)}52.8%{transform:scaleX(.4235);animation-timing-function:cubic-bezier(.22,1.15,.36,1)}56%,100%{transform:scaleX(.1353)}}
@keyframes tdAsk{0%,29.8%{transform:translateX(var(--td-m0));animation-timing-function:cubic-bezier(.22,1.15,.36,1)}33%{transform:translateX(var(--td-m1))}52.8%{transform:translateX(var(--td-m1));animation-timing-function:cubic-bezier(.22,1.15,.36,1)}56%{transform:translateX(var(--td-m2))}73.4%{transform:translateX(var(--td-m2));animation-timing-function:cubic-bezier(.65,0,.35,1)}76.4%,100%{transform:translateX(var(--td-m3))}}
@keyframes tdBlink{0%,63.6%{opacity:1}65%{opacity:.25}66.4%{opacity:1}67.8%{opacity:.25}69.2%{opacity:1}70.6%{opacity:.25}72%,100%{opacity:1}}
@keyframes tdV1{0%,73.6%{opacity:1;transform:translateY(0)}74.6%,100%{opacity:0;transform:translateY(-7px)}}
@keyframes tdV2{0%,73.8%{opacity:0;transform:translateY(7px)}74.8%,100%{opacity:1;transform:translateY(0)}}
@keyframes tdOld{0%,74.6%{opacity:0;transform:translateY(-3px)}75.8%,100%{opacity:1;transform:translateY(0)}}
@keyframes tdDeal{0%,73.8%{opacity:0}74.8%{opacity:1}80%,95.4%{opacity:.45}96.8%,100%{opacity:0}}

/* Sahne: oyunun gece galerisi — ink rampası, tavandan sodyum ışığı. */
.td { position:relative;width:100%;height:190px;border-radius:14px;overflow:hidden;isolation:isolate;container-type:inline-size;
  background:radial-gradient(58% 70% at 50% -6%,rgba(247,189,63,.16),transparent 72%),linear-gradient(180deg,#111821 0%,#0d131a 58%,#090d12 100%) }
.td-mono { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-variant-numeric:tabular-nums }
/* Tek araçlık içerik: tur sonunda söner, yeni araçla belirir. */
.td-hold { animation:tdHold 12s linear infinite }

/* Tavandaki LED çubuğu + ışık konisi: oyunun menü görselindeki showroom. */
.td-bar { position:absolute;left:33%;right:33%;top:4px;height:2px;border-radius:2px;
  background:linear-gradient(90deg,transparent,#ffd166 18%,#fff0c4 50%,#ffd166 82%,transparent);
  box-shadow:0 0 10px rgba(247,189,63,.7),0 0 22px rgba(247,189,63,.35);animation:tdBar 12s linear infinite }
.td-cone { position:absolute;left:11%;right:11%;top:5px;height:118px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,209,102,.12),rgba(247,189,63,.035) 60%,transparent);
  clip-path:polygon(28% 0,72% 0,100% 100%,0 100%) }
.td-floor { position:absolute;left:0;right:0;top:86px;bottom:0;pointer-events:none;
  background:repeating-linear-gradient(90deg,transparent 0 22px,rgba(255,255,255,.03) 22px 23px);
  -webkit-mask-image:linear-gradient(180deg,transparent,#000 30%,transparent 90%);mask-image:linear-gradient(180deg,transparent,#000 30%,transparent 90%) }
.td-pool { position:absolute;left:50%;top:92px;width:250px;height:34px;margin-left:-125px;pointer-events:none;
  background:radial-gradient(closest-side,rgba(247,189,63,.2),rgba(247,189,63,.06) 60%,transparent) }
.td-shadow { position:absolute;left:50%;top:104px;width:176px;height:12px;margin-left:-88px;pointer-events:none;
  background:radial-gradient(closest-side,rgba(0,0,0,.6),transparent) }
/* Islak beton yansıması: aynı görsel, lastik hizasından ters çevrilmiş. */
.td-refl { position:absolute;left:50%;top:94px;width:174px;height:116px;margin-left:-87px;opacity:.13;transform:scaleY(-1);pointer-events:none;
  -webkit-mask-image:linear-gradient(to top,#000,transparent 32%);mask-image:linear-gradient(to top,#000,transparent 32%) }

/* Araç kutusu görselin oranında (640×427); çokgenler aynı koordinatta. */
.td-car { position:absolute;left:50%;top:12px;width:174px;height:116px;margin-left:-87px }
.td-img { position:absolute;inset:0;width:100%;height:100%;z-index:2 }

/* Hasar lekeleri — oyundaki ArtWear dili. Tarama çizgisiyle birlikte
   soldan sağa "boyanır": dış kutu açılırken iç kutu ters yönde kayıyor,
   içerik yerinde duruyor (yalnız transform, kompozitörde). */
.td-wear-all { position:absolute;inset:0;z-index:3;pointer-events:none }
.td-wipe { position:absolute;inset:0;overflow:hidden }
.td-wipe > div { position:absolute;inset:0 }
.td-wipe--a { animation:tdWipeA 12s linear infinite }
.td-wipe--a > div { animation:tdWipeAIn 12s linear infinite }
.td-wipe--b { animation:tdWipeB 12s linear infinite }
.td-wipe--b > div { animation:tdWipeBIn 12s linear infinite }
.td-wear { position:absolute;inset:0;width:100%;height:100%;overflow:visible }
.td-p .td-p-fill { fill-opacity:.36;stroke-opacity:.9;stroke-width:2.4;stroke-linejoin:round }
.td-p--boyali { fill:#e8b13c;stroke:#e8b13c }
.td-p--degisen { fill:#d8503f;stroke:#d8503f }
.td-p--lokalBoyali { fill:#4a90d9;stroke:#4a90d9 }
.td-hatch { fill:none;stroke:#090d12;stroke-opacity:.42;stroke-width:5 }
.td-harf { fill:#090d12;stroke:#eef1f3;stroke-width:7px;stroke-linejoin:round;paint-order:stroke;font-size:34px;font-weight:800 }

/* Tarama: gövdeye maskelenmiş ışık şeridi + üstünde ince ışın.
   Maske görseli satır içi stilden (araca göre değişiyor). */
.td-sheen { position:absolute;inset:0;z-index:4;pointer-events:none;
  -webkit-mask-position:0 0;-webkit-mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-position:0 0;mask-size:100% 100%;mask-repeat:no-repeat }
.td-sweep { position:absolute;inset:0;z-index:4;pointer-events:none;opacity:0;animation:tdScan 12s linear infinite }
.td-sheen .td-sweep i { position:absolute;top:0;bottom:0;left:-40px;width:42px;
  background:linear-gradient(90deg,transparent,rgba(255,240,196,.12) 55%,rgba(255,240,196,.55) 92%,rgba(255,255,255,.85)) }
.td-beam i { position:absolute;top:-4px;bottom:-8px;left:-1px;width:2px;border-radius:2px;
  background:linear-gradient(180deg,transparent,#fff0c4 18%,#f7bd3f 50%,#fff0c4 82%,transparent);
  box-shadow:0 0 8px rgba(247,189,63,.85),0 0 18px rgba(247,189,63,.4) }

/* Işık titremesi — araç değişimi bunun altında oluyor. */
.td-dim { position:absolute;inset:0;z-index:5;background:#090d12;opacity:0;pointer-events:none;animation:tdDim 12s linear infinite }

/* Görselin üstündeki durum işareti (oyundaki art__marks): boyalı varsa
   önce B, değişen bulununca yerini D alır — oyundaki kural da bu. Tarama
   bitip rapor çıktığı an belirir (seviye değiştiği an); panelin nerede
   olduğundan bağımsız, her araçta aynı zamanlama. */
.td-marks { position:absolute;left:20px;top:32px;z-index:6;width:14px;height:14px }
.td-mark { position:absolute;inset:0;display:grid;place-items:center;border-radius:4px;font-size:8.5px;font-weight:800;line-height:1;color:#090d12;box-shadow:0 2px 6px rgba(0,0,0,.45) }
.td-mark--b { background:#e8b13c;opacity:0;animation:tdMarkB 12s linear infinite }
.td-mark--d { background:#d8503f;animation:tdMarkD 12s linear infinite }

/* Plaka — oyundaki TR plakası: mavi şerit, açık yüz, mono rakam. Altında
   ilanın adı, yılı ve kilometresi (oyundaki pazarlık başlığı gibi). */
.td-plate { position:absolute;left:10px;top:10px;z-index:7;display:flex;height:16px;border-radius:3px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.45) }
.td-plate-tr { display:grid;place-items:center;width:12px;background:#1450a8;color:#fff;font-size:5.5px;font-weight:800 }
.td-plate-no { display:flex;align-items:center;padding:0 5px;background:#eceff1;color:#14181c;font-size:9.5px;font-weight:700;letter-spacing:.06em;white-space:nowrap }
.td-info { position:absolute;left:10px;top:30px;z-index:7;text-shadow:0 1px 4px rgba(0,0,0,.7) }
.td-info b { display:block;font-size:8.5px;line-height:10px;font-weight:800;color:#eef1f3;white-space:nowrap }
.td-info span { display:block;margin-top:2px;font-size:7.5px;line-height:9px;color:#8d9aa6;white-space:nowrap }

/* Masadaki fiyat — galeri sarısı mono rakam; anlaşınca yuvarlanıp değişir. */
.td-price { position:absolute;right:10px;top:7px;z-index:7;text-align:right }
.td-price-lbl { display:block;font-size:6.5px;line-height:8px;font-weight:800;letter-spacing:.12em;color:#6fa8ff;white-space:nowrap }
.td-price-val { position:relative;display:block;height:15px;margin-top:1px;overflow:hidden }
.td-price-val span { display:block;font-size:12.5px;line-height:15px;font-weight:700;color:#f7bd3f;white-space:nowrap;text-shadow:0 0 12px rgba(247,189,63,.3) }
/* v1 akışta kalıp kutunun genişliğini verir; v2 üstüne biner. İkisi de
   mutlak olsaydı kutu etiket kadar daralır, rakamın solu kırpılırdı.
   İstenen ve anlaşılan fiyat aynı uzunlukta değilse kutu v1'e göre. */
.td-v1 { opacity:0;animation:tdV1 12s linear infinite }
.td-v2 { position:absolute;right:0;top:0;animation:tdV2 12s linear infinite }
.td-price-old { display:block;margin-top:1px;font-size:7.5px;line-height:9px;color:#63707c;text-decoration:line-through;animation:tdOld 12s linear infinite }

/* Tahmin paneli — oyundaki NegoEstimate'in küçük hâli: pip + seviye + ±%,
   belirsizlik bandı, alt satırda karar. */
.td-hud { position:absolute;left:10px;right:10px;bottom:8px;z-index:7;padding:7px 10px;border-radius:11px;border:1px solid #1d2833;
  background:radial-gradient(120% 90% at 0% 0%,rgba(247,189,63,.14),transparent 50%),linear-gradient(168deg,rgba(23,33,44,.94),rgba(13,19,26,.94) 64%);
  box-shadow:0 10px 26px -12px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,255,255,.07) }
.td-hud::after { content:'';position:absolute;inset:-1px;border-radius:inherit;border:1px solid rgba(52,185,120,.8);box-shadow:0 0 16px -3px rgba(52,185,120,.5);opacity:.45;pointer-events:none;animation:tdDeal 12s linear infinite }
.td-head { display:flex;align-items:center;gap:6px;height:11px }
.td-pips { display:flex;gap:3px;flex-shrink:0 }
.td-pip { position:relative;width:6px;height:6px;border-radius:50%;background:#2e3f50 }
.td-pip::after { content:'';position:absolute;inset:0;border-radius:50%;background:#f7bd3f;box-shadow:0 0 6px rgba(247,189,63,.65) }
.td-pip:nth-child(2)::after { animation:tdPip2 12s linear infinite }
.td-pip:nth-child(3)::after { animation:tdPip3 12s linear infinite }
.td-title,.td-pct,.td-cap { position:relative;height:11px }
.td-title { flex:1;min-width:0 }
.td-pct { width:40px;flex-shrink:0 }
.td-title span,.td-pct span,.td-cap span { position:absolute;top:0;white-space:nowrap;line-height:11px }
.td-title span { left:0;font-size:8px;font-weight:800;letter-spacing:.08em;color:#8d9aa6 }
.td-pct span { right:0;font-size:8.5px;font-weight:700;color:#8d9aa6 }
.td-pct .td-s3 { color:#34b978 }
.td-s1 { opacity:0;animation:tdT1 12s linear infinite }
.td-s2 { opacity:0;animation:tdT2 12s linear infinite }
.td-s3 { animation:tdT3 12s linear infinite }
.td-track { position:relative;height:10px;margin-top:6px;border-radius:999px;border:1px solid #1d2833;background:linear-gradient(180deg,#090d12,#0d131a);box-shadow:inset 0 1px 3px rgba(0,0,0,.5) }
.td-zone { position:absolute;inset:2px;border-radius:999px;transform:scaleX(.1353);animation:tdZone 12s linear infinite;
  background:linear-gradient(90deg,transparent,rgba(247,189,63,.36) 22%,rgba(247,189,63,.36) 78%,transparent) }
.td-est { position:absolute;top:1px;bottom:1px;left:50%;width:2px;margin-left:-1px;border-radius:2px;background:#f7bd3f;box-shadow:0 0 6px rgba(247,189,63,.6) }
.td-ask { position:absolute;inset:0;transform:translateX(var(--td-m3));animation:tdAsk 12s linear infinite }
.td-ask i { position:absolute;top:-3px;bottom:-3px;left:50%;width:2px;margin-left:-1px;border-radius:2px;background:#1c63c9;box-shadow:0 0 8px rgba(28,99,201,.75);animation:tdBlink 12s linear infinite }
.td-ask i::after { content:'';position:absolute;top:-5px;left:50%;margin-left:-3.5px;border-left:3.5px solid transparent;border-right:3.5px solid transparent;border-top:5px solid #1c63c9 }
.td-cap { margin-top:6px }
.td-cap span { left:0;font-size:8.5px;font-weight:600;color:#8d9aa6 }
.td-cap .td-c3 { color:#e0783a;opacity:0;animation:tdC3 12s linear infinite }
.td-cap .td-c4 { color:#e6493c;opacity:0;animation:tdC4 12s linear infinite }
.td-cap .td-c5 { color:#34b978;animation:tdC5 12s linear infinite }

/* Geniş kartta (masaüstü iki sütun) araç sahnede küçük kalıyordu: kutuyu
   büyüt, lastik hizası panelin üstünde kalsın. Yansıma yine lastik
   hizasından (4 + 131 × 0,853 ≈ 116) ters çevriliyor. */
@container (min-width:440px) {
  .td-car { top:4px;width:196px;height:131px;margin-left:-98px }
  .td-refl { top:97px;width:196px;height:131px;margin-left:-98px }
  .td-shadow { top:110px;width:198px;margin-left:-99px }
  .td-pool { top:98px;width:280px;margin-left:-140px }
}

@media (prefers-reduced-motion: reduce) { .td, .td *, .td *::before, .td *::after { animation:none !important } }
`;

function TorpidodanScene() {
  const { t, lang } = useLang();
  const w = t.games.scenes.torpidodan;
  const [index, setIndex] = useState(0);
  const car = TD_CARS[index];
  const src = `${TD_DIR}${car.img}.webp`;
  const nextSrc = `${TD_DIR}${TD_CARS[(index + 1) % TD_CARS.length].img}.webp`;
  const fmt = new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US');
  const captions = tdCaptions(car, w, fmt);
  const price = `${fmt.format(car.ask)} TL`;
  const hasB = car.panels.some(([state]) => state === 'boyali');

  // Sıradaki aracın görselini bir tur önceden indirip çöz: değişim anında
  // boş kare kalmasın. Hepsini baştan yüklemiyoruz — iOS bellek bütçesi
  // (bkz. CLAUDE.md "Görsel bütçesi"), aynı anda en fazla iki araç.
  useEffect(() => {
    const img = new Image();
    img.src = nextSrc;
    img.decode?.().catch(() => {});
  }, [nextSrc]);

  // Işık tamamen sönükken (tdDim'in tur sonu) sıradaki araç.
  const onIteration = (e) => {
    if (e.animationName === 'tdDim') setIndex((n) => (n + 1) % TD_CARS.length);
  };

  // İğnenin yeri: 0.5 bandın ortası; kutu genişliğinin yüzdesi olarak kaydırılıyor.
  const needle = Object.fromEntries(car.mark.map((m, i) => [`--td-m${i}`, `${((m - 0.5) * 100).toFixed(1)}%`]));
  const mask = `url(${src})`;

  const wear = (pass) => (
    <div className={`td-wipe td-wipe--${pass}`}>
      <div>
        <svg className="td-wear" viewBox="0 0 640 427" aria-hidden="true" focusable="false">
          {car.panels
            .filter(([state]) => (pass === 'b') === (state === 'degisen'))
            .map(([state, d, x, y]) => (
              <g key={state} className={`td-p td-p--${state}`}>
                <path className="td-p-fill" d={d} />
                <path d={d} fill="url(#tdHatch)" stroke="none" />
                <text className="td-harf" x={x} y={y} textAnchor="middle">{TD_HARF[state]}</text>
              </g>
            ))}
        </svg>
      </div>
    </div>
  );

  return (
    <div className="td" aria-hidden="true" style={needle} onAnimationIteration={onIteration}>
      <style>{TD_CSS}</style>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <pattern id="tdHatch" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <path className="td-hatch" d="M0 0H22" />
          </pattern>
        </defs>
      </svg>
      <div className="td-cone" />
      <div className="td-bar" />
      <div className="td-floor" />
      <div className="td-pool" />
      <div className="td-shadow" />
      {/* loading="lazy" şart: Preloader ekrandaki eager görselleri sayıyor (bkz. LoreScene). */}
      <img className="td-refl" src={src} alt="" loading="lazy" decoding="async" width={640} height={427} />

      <div className="td-car">
        <img className="td-img" src={src} alt="" loading="lazy" decoding="async" width={640} height={427} />
        <div className="td-wear-all td-hold">
          {wear('a')}
          {wear('b')}
        </div>
        <div className="td-sheen" style={{ WebkitMaskImage: mask, maskImage: mask }}>
          <div className="td-sweep"><i /></div>
        </div>
        <div className="td-sweep td-beam"><i /></div>
        <div className="td-marks td-hold">
          {hasB && <span className="td-mark td-mark--b">B</span>}
          <span className="td-mark td-mark--d">D</span>
        </div>
      </div>
      <div className="td-dim" />

      <div className="td-plate">
        <span className="td-plate-tr">TR</span>
        <span className="td-plate-no td-mono">34 ARDO 95</span>
      </div>
      <div className="td-info td-hold">
        <b>{car.brand} {car.model}</b>
        <span className="td-mono">{car.year} · {fmt.format(car.km)} km</span>
      </div>

      <div className="td-price td-hold">
        <span className="td-price-lbl">{w.ask}</span>
        <span className="td-price-val td-mono">
          <span className="td-v1">{price}</span>
          <span className="td-v2">{fmt.format(car.deal)} TL</span>
        </span>
        <span className="td-price-old td-mono">{price}</span>
      </div>

      <div className="td-hud">
        <div className="td-hold">
          <div className="td-head">
            <span className="td-pips"><i className="td-pip" /><i className="td-pip" /><i className="td-pip" /></span>
            <span className="td-title">
              {w.levels.map((l, i) => <span key={l} className={`td-s${i + 1}`}>{l}</span>)}
            </span>
            <span className="td-pct td-mono">
              {w.bands.map((b, i) => <span key={b} className={`td-s${i + 1}`}>{b}</span>)}
            </span>
          </div>
          <div className="td-track">
            <span className="td-zone" />
            <span className="td-est" />
            <span className="td-ask"><i /></span>
          </div>
          <div className="td-cap">
            {captions.map((c, i) => (
              <span key={i} className={i < 2 ? `td-s${i + 1}` : `td-c${i + 1}`}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function StatusBadge({ status, label }) {
  const { t } = useLang();
  if (status === 'live') {
    // i18n metni "● Yayında" — nokta metnin içinde. Canlı halka onun
    // yerine geçiyor, metindeki noktayı göstermiyoruz (iki nokta olmasın).
    const text = t.games.statusLive.replace(/^●\s*/, '');
    return (
      <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="adk-ping absolute inset-0 rounded-full bg-emerald-400" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        {text}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[10px] font-black tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
      {/* Ortak rozet "Çok Yakında" diyor; tarihi belirsizleşen yapımlar
          i18n'den kendi `statusLabel`'ını verip bunu yumuşatabilir. */}
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
      {label || t.games.statusSoon}
    </span>
  );
}

const LORE_CSS = `
@keyframes lrCam{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(calc(-50% - 9px),calc(-50% + 4px)) scale(1.045)}}
@keyframes lrHalo{0%,100%{opacity:.3;transform:translate(-50%,-50%) scale(1)}22%{opacity:.58;transform:translate(-50%,-50%) scale(1.12)}46%{opacity:.36;transform:translate(-50%,-50%) scale(.94)}72%{opacity:.66;transform:translate(-50%,-50%) scale(1.06)}}
@keyframes lrFlame{0%,100%{opacity:.32;transform:translate(-50%,-50%) scale(1,1)}28%{opacity:.68;transform:translate(-50%,-50%) scale(.87,1.2)}58%{opacity:.42;transform:translate(-50%,-50%) scale(1.12,.9)}}
@keyframes lrEmber{0%{opacity:0;transform:translate(0,0)}14%{opacity:.9}100%{opacity:0;transform:translate(var(--dx,0px),-54px)}}
@keyframes lrMist{0%{transform:translateX(-6%)}100%{transform:translateX(0)}}
@keyframes lrSpark{0%,100%{opacity:.06}50%{opacity:.8}}
@keyframes lrSky{0%,100%{opacity:.16}50%{opacity:.4}}
@keyframes lrGlint{0%,56%{opacity:0;transform:translateX(-70%) rotate(41deg)}64%{opacity:.5}80%,100%{opacity:0;transform:translateX(470%) rotate(41deg)}}

/* Görselin cover geometrisini birebir yeniden üretir: en az kutu kadar geniş,
   en boy oranı 1536/486 sabit, taşan kısmı .lr kırpıyor. 601px = 190px × 3.1605
   (kutu yüksekliğinde cover için gereken genişlik). aspect-ratio desteklemeyen
   eski Safari'de height:100%'e düşer — hizalama bozulur ama sahne çalışır. */
.lr-stage { position:absolute;left:50%;top:50%;width:max(100%,601px);height:100%;transform:translate(-50%,-50%);animation:lrCam 26s ease-in-out infinite }
@supports (aspect-ratio:1/1){ .lr-stage { height:auto;aspect-ratio:1536/486 } }
.lr-art { position:absolute;inset:0;width:100%;height:100%;object-fit:cover }

/* Meşaleler — halo geniş ve yumuşak, alev dili dar ve parlak; ikisi farklı
   sürede titreyince mekanik senkron hissi kayboluyor. */
.lr-halo { position:absolute;width:11%;height:34%;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(circle,rgba(186,142,255,.3),rgba(139,92,246,.11) 45%,transparent 70%) }
.lr-flame { position:absolute;width:3.6%;height:21%;transform:translate(-50%,-50%);border-radius:50% 50% 44% 44%;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(ellipse at 50% 62%,rgba(236,224,255,.42),rgba(178,124,255,.2) 48%,transparent 76%) }

/* Köz ve parıltılar 2px kare — görsel pixel art, yuvarlak parçacık sırıtırdı. */
.lr-ember { position:absolute;width:2px;height:2px;pointer-events:none;background:#d9b8ff;box-shadow:0 0 4px rgba(186,142,255,.8);animation:lrEmber 5s linear infinite }
.lr-spark { position:absolute;width:2px;height:2px;pointer-events:none;background:#e3ccff;animation:lrSpark 5.4s ease-in-out infinite }

.lr-mist { position:absolute;left:-3%;top:38%;width:112%;height:44%;pointer-events:none;background:radial-gradient(ellipse 20% 55% at 16% 52%,rgba(163,146,214,.11),transparent 72%),radial-gradient(ellipse 16% 48% at 46% 62%,rgba(163,146,214,.09),transparent 72%),radial-gradient(ellipse 24% 60% at 76% 48%,rgba(163,146,214,.1),transparent 72%);animation:lrMist 34s ease-in-out infinite alternate }
.lr-sky { position:absolute;left:55%;top:0;width:36%;height:42%;transform:translateX(-50%);pointer-events:none;mix-blend-mode:screen;background:radial-gradient(ellipse at 50% 0%,rgba(198,206,255,.26),transparent 68%);animation:lrSky 9.5s ease-in-out infinite }

/* Kılıç parıltısı: kutu kılıcın sınırlayıcı dikdörtgeni, maske de o kutunun
   sol-üst → sağ-alt köşegeni (41°, namlunun eğimi). Parıltı çubuğu namluya
   dik duruyor, maske sayesinde yalnızca bıçağın üstünde görünüyor. */
.lr-blade { position:absolute;left:50.2%;top:57.5%;width:10.6%;height:28%;overflow:hidden;pointer-events:none;mix-blend-mode:screen;-webkit-mask-image:linear-gradient(41deg,transparent 43%,#000 48.5%,#000 53.5%,transparent 59%);mask-image:linear-gradient(41deg,transparent 43%,#000 48.5%,#000 53.5%,transparent 59%) }
.lr-glint { position:absolute;left:0;top:-40%;width:15%;height:180%;background:linear-gradient(90deg,transparent,rgba(226,234,255,.75),transparent);animation:lrGlint 7.2s ease-in-out infinite }

@media (prefers-reduced-motion: reduce) { .lr, .lr * { animation: none !important } }
`;

/* Köz kaynakları meşale alevlerinin tepesi; sıçrama yönü ve süre elle
   dağıtıldı ki altı köz ritmik bir sıra gibi görünmesin. */
const LORE_EMBERS = [
  { left: '16.3%', top: '43%', dx: '-6px', delay: '0s', dur: '5.2s' },
  { left: '17.4%', top: '41%', dx: '5px', delay: '1.7s', dur: '4.4s' },
  { left: '18.2%', top: '44%', dx: '-3px', delay: '3.2s', dur: '5.8s' },
  { left: '79.6%', top: '51%', dx: '5px', delay: '.9s', dur: '4.8s' },
  { left: '80.6%', top: '49%', dx: '-5px', delay: '2.4s', dur: '5.5s' },
  { left: '81.5%', top: '52%', dx: '4px', delay: '3.9s', dur: '4.2s' },
];

/* Görselde zaten mor toz zerreleri var; bunlar onların üstünde yanıp sönüyor. */
const LORE_SPARKS = [
  { left: '30%', top: '22%', delay: '0s' },
  { left: '44%', top: '64%', delay: '1.3s' },
  { left: '66%', top: '30%', delay: '2.6s' },
  { left: '93%', top: '46%', delay: '3.4s' },
  { left: '7%', top: '76%', delay: '4.1s' },
];

/**
 * LORE — diğer sahnelerden farklı olarak elle çizilmiş SVG değil, hazır
 * anahtar görsel. Diğer kartların sahne kutusuyla aynı ölçüde durması için
 * çerçeve birebir aynı (h-190, rounded-card, alt kenar çizgisi).
 *
 * Görsel hazır olduğu için canlandırma da diğerlerinden farklı: çizimin kendisi
 * animasyonlu değil, görselin ÜSTÜNE ışık ve parçacık katmanları biniyor — iki
 * meşale alevi, yükselen közler, sürüklenen sis, gökyüzü nefesi, kılıcın
 * üzerinden geçen parıltı ve çok yavaş bir kamera kayması. Hepsi CSS.
 * `filter: blur()` BİLEREK yok (iOS'ta geniş alanlı blur pahalı); ışıklar
 * radial-gradient + `mix-blend-mode: screen` ile yapılıyor, animasyonlar
 * yalnızca transform/opacity sürüyor.
 *
 * ⚠️ Katmanlar görselin belirli PİKSELLERİNE çivili (alevler 17.1%/48% ve
 * 80.3%/55%, kılıç 50-60% × 58-85%). Kart genişliği 327px–975px arasında
 * değişiyor ve `object-cover` bu aralıkta kâh yanları kâh alt/üstü kırpıyor;
 * yüzdeler sahne kutusuna göre verilseydi hizalama her ekranda kayardı.
 * `.lr-stage` bu yüzden cover geometrisini yeniden üretiyor ve katmanlar
 * onun çocuğu. Yeni katman eklerken konumu görselin 1536×486 koordinatından
 * yüzdeye çevir.
 *
 * `image-rendering: pixelated` BİLEREK yok: görsel 1536px genişliğinde ve karta
 * ~600px olarak küçülüyor. pixelated yalnızca BÜYÜTÜRKEN doğru sonuç verir;
 * küçültmede en-yakın-komşu piksel atlar ve pixel art titreşir. Tarayıcının
 * varsayılan yumuşak küçültmesi burada doğru olan.
 *
 * loading="lazy" şart: Preloader ekrandaki eager görselleri sayıyor, bu kart
 * ekranın çok altında ve sayaca girmemeli.
 */
function LoreScene() {
  return (
    <div
      className="lr relative h-[190px] overflow-hidden rounded-card border-b border-white/5"
      style={{ background: '#0A0714' }}
    >
      <style>{LORE_CSS}</style>
      <div className="lr-stage">
        <img
          src="/games/lore-wide.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={1536}
          height={486}
          className="lr-art"
        />

        <div className="lr-sky" />
        <div className="lr-mist" />

        {/* Sol meşale */}
        <div className="lr-halo" style={{ left: '17.1%', top: '48%', animation: 'lrHalo 3.4s ease-in-out infinite' }} />
        <div className="lr-flame" style={{ left: '17.1%', top: '46%', animation: 'lrFlame 1.9s ease-in-out infinite' }} />
        {/* Sağ meşale — aynı animasyon, farklı süre; ikisi asla senkron olmuyor */}
        <div className="lr-halo" style={{ left: '80.3%', top: '55%', animation: 'lrHalo 4.1s ease-in-out infinite .6s' }} />
        <div className="lr-flame" style={{ left: '80.3%', top: '54%', animation: 'lrFlame 2.3s ease-in-out infinite .4s' }} />

        {LORE_EMBERS.map((e, i) => (
          <div
            key={i}
            className="lr-ember"
            style={{ left: e.left, top: e.top, '--dx': e.dx, animationDelay: e.delay, animationDuration: e.dur }}
          />
        ))}
        {LORE_SPARKS.map((s, i) => (
          <div key={i} className="lr-spark" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
        ))}

        <div className="lr-blade">
          <div className="lr-glint" />
        </div>
      </div>

      {/* Alt kenarı kart zeminine bağlayan geçiş — sert kesim olmasın */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#05070F]/80 to-transparent pointer-events-none" />
    </div>
  );
}

/* ------------------------------------------------------------------
   Hover: kart değil, YÜZEYİ kalkar (2026-11-25).

   Eskiden `hover:-translate-y-1.5` tıklanan elemanın kendisindeydi:
   imleç kartın alt kenarına yakınken kart 6px yukarı kayınca imleç
   artık kartın dışında kalıyor, hover düşüyor, kart iniyor, imleç yine
   üstünde... alt kenarda titreme. Artık dıştaki `group` kutusu (isabet
   alanı) yerinde duruyor, içindeki `.gc-surface` kalkıyor. Görüntü
   aynı, titreme yok.

   Sahne de hover'da çok yavaş %3 yakınlaşıyor — çerçeve dönmüyor (tilt
   kalkmıştı, bkz. aşağıdaki not), sadece bakış biraz yaklaşıyor.
------------------------------------------------------------------- */
const SURFACE =
  'gc-surface relative flex h-full min-h-[460px] flex-col overflow-hidden rounded-card transition-[translate,border-color,box-shadow] duration-500 ease-soft group-hover:-translate-y-1.5';

function GameCard({ game }) {
  const [sceneRef, sceneIdle] = useSceneIdle();
  const [replay, setReplay] = useState(0);
  const { t } = useLang();
  const Scene = game.scene;

  if (game.status === 'secret') {
    return (
      <motion.div ref={sceneRef} variants={cardVariants} className={`h-full ${sceneIdle ? 'gc-idle' : ''}`}>
        <div className="group relative h-full" onPointerEnter={() => setReplay((n) => n + 1)}>
        <div className={`${SURFACE} border border-dashed border-white/10 bg-white/[0.012] group-hover:border-white/20`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
          </div>
          {/* Gizli dosya hissi: sabit tarama çizgileri (animasyonsuz). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{ background: 'repeating-linear-gradient(to bottom, transparent 0 3px, rgba(129,140,248,0.05) 3px 4px)' }}
          />
          <Spotlight size={380} color="rgba(129, 140, 248, 0.40)" />
          <div className="relative z-10 flex flex-col flex-1 p-8 items-center justify-center text-center">
            {/* Yükseklik bilerek sabit ve klasör dibe hizalı: açılınca
                kâğıtlar ~60px yukarı savruluyor, o boşluk önceden ayrılmazsa
                üstteki kod adı satırının üstüne biniyorlar. */}
            <div className="relative mb-4 flex h-[150px] w-[100px] items-end justify-center">
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [0.25, 0.6, 0.25] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute bottom-1 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(99,102,241,0.45), transparent 70%)',
                }}
              />
              {/* z-10: glow DOM'da önce ama konumlanmış, yani klasörü
                  boyamada geçerdi. Işık arkada kalsın. */}
              <Folder
                className="relative z-10"
                label={t.games.secret.folderLabel}
                items={REDACTED_SHEETS}
              />
            </div>
            {/* Kod adı kartın üstüne gelince yeniden "çözülüyor" — gizli
                bir dosyanın kilidi açılıyor. lang="en": İngilizce ifade,
                CSS uppercase Türkçe kurala düşmesin. */}
            <ScrambleText
              lang="en"
              text={t.games.secret.codename}
              replay={replay}
              className="text-[9px] font-black tracking-label-x text-indigo-300/80 uppercase mb-2"
            />
            <h3 className="text-xl font-black text-white mb-4 tracking-wider uppercase">{t.games.secret.title}</h3>
            <p className="text-gray-500 max-w-xs text-xs font-light leading-relaxed">
              {t.games.secret.desc}
            </p>
            <div className="mt-8 w-full h-px bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
              />
            </div>
            <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mt-2">
              {t.games.secret.soon}
            </span>
          </div>
        </div>
        </div>
      </motion.div>
    );
  }

  const isLive = game.status === 'live';
  const words = t.games.items[game.id] || {};
  const displayTitle =
  game.id === 'lore'
    ? words.title || game.title
    : game.title;
  return (
    <motion.div
      ref={sceneRef}
      id={`game-${game.id}`}
      variants={cardVariants}
      className={`h-full scroll-mt-24 ${sceneIdle ? 'gc-idle' : ''}`}
    >
      <div
        data-cursor="soft"
        data-cursor-color={game.id === 'revo' ? 'teal' : undefined}
        className="group relative h-full"
      >
      <div
        className={`${SURFACE} card-glass border border-white/10 group-hover:border-white/20 group-hover:shadow-[0_28px_70px_-28px_rgba(99,102,241,0.5)]`}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        </div>

        {/* Sahnelerin zemini opak, üstelik DOM'da Spotlight'tan SONRA
            geliyor — yani ışık anahtar görselin/çiziminin üstüne binmez,
            sadece altındaki camsı gövdeyi aydınlatır. Bilerek böyle:
            sahne kendi ışığını taşıyor, ikinci bir kaynak istemiyoruz.
            Kenar halkası (Spotlight'ın `rim`'i) aynı ışığın kenara vurması;
            rengi projenin kendi vurgusu. */}
        <Spotlight color={SPOTLIGHT_COLORS[game.id]} />

        {/* Sahne kabı: kırpıyor, içi hover'da yavaşça yakınlaşıyor.
            Transform genişliği değiştirmediği için Torpidodan'ın
            @container kuralları ve LORE'un cover hizalaması etkilenmez. */}
        {Scene && (
          <div className="relative overflow-hidden rounded-card">
            <div className="origin-center transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.03]">
              <Scene />
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col flex-1 p-8">
          <div className="flex items-center justify-between mb-5">
            <StatusBadge status={game.status} label={words.statusLabel} />
            <span className="text-[9px] text-gray-400 font-bold tracking-widest">{game.platforms}</span>
          </div>
          <h3 className={`text-2xl font-black text-white tracking-tight ${words.subtitle ? 'mb-1' : 'mb-3'}`}>
  {displayTitle}
</h3>
          {words.subtitle && (
            <p className="text-[11px] font-bold tracking-wide mb-3" style={{ color: game.accent || '#3ECFC0' }}>
              {words.subtitle}
            </p>
          )}
          <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 flex-1">
            {words.desc}
          </p>

          {game.links ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-[#3ECFC0]"
                />
                <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">
                  {game.links.secondary ? t.games.hintBrowser : t.games.hintOneClick}
                </span>
              </div>
              <ActionLink
                href={game.links.primary}
                target="_blank"
                rel="noreferrer"
                cursorColor="teal"
                className="shine relative overflow-hidden w-full px-6 py-3.5 bg-[#3ECFC0] text-[#05070F] rounded-control text-[10px] font-black tracking-widest uppercase text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_25px_rgba(62,207,192,0.25)] block"
              >
                {words.linkPrimary} →
              </ActionLink>

              {game.links.secondary && (
                <>
                  <ActionLink
                    href={game.links.secondary}
                    target="_blank"
                    rel="noreferrer"
                    cursorColor="teal"
                    className="w-full px-6 py-3.5 border border-[#3ECFC0]/30 hover:border-[#3ECFC0]/70 rounded-control text-[10px] font-black tracking-widest text-[#3ECFC0] uppercase text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3v12" />
                      <path d="m7 11 5 5 5-5" />
                      <path d="M4 20h16" />
                    </svg>
                    {words.linkSecondary}
                  </ActionLink>
                  {words.linkSecondaryNote && (
                    <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase text-center">
                      {words.linkSecondaryNote}
                    </span>
                  )}
                </>
              )}
            </div>
          ) : isLive ? (
            <>
              {words.rating && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-xs text-yellow-400">★</span>)}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{words.rating} {t.games.reviewsSuffix}</span>
                </div>
              )}
              {/* flex-wrap: kart içeriği mobilde ve lg'nin iki sütununda
                  ~210–280px'e iniyor, ikonlu iki buton oraya yan yana
                  sığmıyor — o zaman alt alta düşüp ikisi de tam genişlik
                  oluyor. whitespace-nowrap şart: yoksa "GOOGLE PLAY" buton
                  içinde kırılır ve satıra sığmış sayılır. `lang="en"`:
                  belge dili tr, CSS büyütmesi "itch.io"yu "İTCH.İO" yapar. */}
              <div className="flex flex-wrap gap-3">
                {STORES.filter((s) => game[s.key]).map((s, i) => (
                  <ActionLink
                    key={s.key}
                    href={game[s.key]}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap px-5 py-3.5 rounded-control text-[10px] font-black tracking-widest uppercase ${
                      i === 0
                        ? 'shine relative overflow-hidden bg-white text-[#05070F] shadow-[inset_0_-2px_0_rgba(5,7,15,0.12),0_8px_24px_-10px_rgba(255,255,255,0.35)]'
                        : 'lg text-white transition-colors hover:text-white'
                    }`}
                  >
                    <StoreIcon kind={s.key} />
                    <span lang="en">{s.label}</span>
                  </ActionLink>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-px bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                  className="h-full w-1/3 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
                />
              </div>
              <span className="text-[9px] text-gray-500 font-black tracking-label-wide uppercase">
                {/* Ortak metin "mağazalarda yakında" diyor; mobil oyunlar için
                    doğru ama mağazasız çıkacak yapımlar için değil. Oyun kendi
                    soonNote'unu verirse o kazanır. */}
                {words.soonNote || t.games.comingToStores}
              </span>
            </>
          )}
        </div>
      </div>
      </div>
    </motion.div>
  );
}

/* Eskiden MagneticButton'dı; mıknatıs efekti siteden kaldırıldı, bkz.
   Hero.jsx'teki CtaLink notu. (Kartların 3B tilt'i de aynı gün
   kaldırıldı; yukarıdaki nota bak.)
   Not: dosya bunu bir zamanlar `export` ediyordu ama hiçbir yer import
   etmiyordu; export da kaldırıldı. */
function ActionLink({ href, className, children, target, rel, cursorColor }) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      data-cursor="ring"
      data-cursor-color={cursorColor}
      className={className}
    >
      {children}
    </a>
  );
}

export default function Games() {
  const { t } = useLang();
  // Vitrin sırası kullanıcının kendi seçimi (2026-09-27): en yeni çıkan
  // dördü önde, sonra eski yayındakiler.
  const games = [
    {
      id: 'torpidodan',
      status: 'live',
      title: 'Torpidodan',
      platforms: 'IOS · ANDROID',
      scene: TorpidodanScene,
      accent: '#F7BD3F',
      appStore: 'https://apps.apple.com/tr/app/torpidodan/id6807162427?l=tr',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.ardeko.torpidodan',
    },
    {
      id: 'lore',
      status: 'live',
      title: 'LORE - Legend of Rey: Echoes',
      platforms: 'WINDOWS · PC',
      scene: LoreScene,
      accent: '#A78BFA',
      itch: 'https://ardeko.itch.io/legend-of-rey',
    },
    {
      id: 'rushville',
      status: 'live',
      title: 'Rushville',
      platforms: 'IOS · ANDROID',
      scene: RushvilleScene,
      appStore: 'https://apps.apple.com/tr/app/rushville/id6808291839?l=tr',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.ardeko.rushville',
    },
    {
      id: 'skyline',
      status: 'live',
      title: 'Skyline Swinger',
      platforms: 'IOS · ANDROID',
      scene: SkylineSwingerScene,
      appStore: 'https://apps.apple.com/tr/app/skyline-swinger/id6807957503?l=tr',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.ardeko.skylineswinger',
    },
    {
      id: 'switch',
      status: 'live',
      title: 'Switch Master: Railway',
      platforms: 'IOS · ANDROID',
      scene: TrainScene,
      appStore: 'https://apps.apple.com/tr/app/switch-master-railway/id6770972534?l=tr',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.ardeko.switchmaster&pcampaignid=web_share',
    },
    {
      id: 'revo',
      status: 'live',
      title: 'REVO',
      platforms: 'WEB · WINDOWS',
      scene: RevoScene,
      links: {
        primary: 'https://ardekostudios.xyz',
        // Doğrudan indirme: kullanıcı sürüm sayfasına düşmez, tıklar tıklamaz
        // dosya inmeye başlar. Kalıcı adres — yeni sürümde değiştirmen gerekmez.
        secondary: 'https://github.com/Ardeko/Revo/releases/latest/download/REVO-Setup.exe',
      },
    },
    {
      id: 'apex',
      status: 'live',
      title: 'Apex Shift',
      platforms: 'WEB · BROWSER',
      scene: ApexShiftScene,
      links: { primary: 'https://ardaguner.com/apex-shift' },
    },
    {
      id: 'decoy',
      status: 'live',
      title: 'Decoy',
      platforms: 'WEB · ONLINE',
      scene: DecoyScene,
      accent: '#F43F5E',
      // Oyun sitenin KENDI icinde barinir (public/decoy/index.html), disarida
      // degil. Guncellemek icin decoy projesinde: npm run deploy:site
      links: { primary: '/decoy/' },
    },
    {
      id: 'forza',
      status: 'live',
      title: 'Forza Orbit',
      platforms: 'WEB · BROWSER',
      scene: ForzaShiftScene,
      links: { primary: 'https://ardaguner.com/forza-orbit' },
    },
    // Kafa Kafaya listenin sonunda: proje rafa kalkma yolunda, yakın
    // zamanda çıkmayacak. Diğer "soon" yapımların önünde durup onların
    // sırasını yemesin diye en arkada. Rozeti de daha yumuşak: i18n'de
    // `items.kafa.statusLabel` ortak "Çok Yakında"yı eziyor.
    {
      id: 'kafa',
      status: 'soon',
      title: 'Kafa Kafaya',
      platforms: 'IOS · ANDROID',
      scene: KafaKafayaScene,
    },
    {
      status: 'secret',
    },
  ];
  return (
    <section id="games" className="py-32 px-6 max-w-[1280px] mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="mb-20 text-center lg:text-left"
      >
        <p className="text-[11px] font-black tracking-label-x text-indigo-400 uppercase mb-3">
          {t.games.eyebrow}
        </p>
        <SplitWords
          as="h2"
          className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase"
          text={t.games.title}
        />
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 w-full"
      >
        {games.map((game, i) => (
          <GameCard key={i} game={game} />
        ))}
      </motion.div>
      {/* HoverPreviewList (dev tipografili oyun listesi) burada duruyordu —
          2026-11-25'te KALDIRILDI. Aynı 10 oyunu kartların hemen altında
          ikinci kez gösteriyordu: yeni bilgi yoktu, sayfaya ~1700px tekrar
          ekliyordu. Kullanıcı da "kendini tekrar eden bir yapı" dedi.
          Geri getirme; oyunlar sayfada BİR kez, kartlarda. */}
    </section>
  );
}