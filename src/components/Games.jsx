import { motion } from 'framer-motion';
import { useRef } from 'react';
import RevoScene from './RevoScene';
import { SplitWords } from './Reveal';
import HoverPreviewList from './HoverPreviewList';
import Spotlight from './Spotlight';
import Folder from './Folder';
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
  torpidodan: 'rgba(96, 165, 250, 0.42)',
  kafa: 'rgba(52, 211, 153, 0.42)',
  // Beyaz diğer renklerle aynı alfada gözü alıyor — koyu zeminde doygunluğu
  // olmayan tek renk o, bu yüzden bilerek daha kısık.
  rushville: 'rgba(255, 255, 255, 0.26)',
  apex: 'rgba(251, 191, 36, 0.40)',
};

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

function useTilt() {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    el.style.transition = 'transform 0.1s ease';
  };
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    ref.current.style.transition = 'transform 0.5s ease';
  };
  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}

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
    <div className="relative h-[190px] overflow-hidden rounded-2xl border-b border-white/5" style={{background:'#060810'}}>
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
.fs-perfect { position:absolute;font-family:Impact,sans-serif;font-size:13px;letter-spacing:1px;animation:fsPerfect 3.4s ease-in-out infinite }
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

const TD_CSS = `
/* Mercek aracın kendi genişliği boyunca süpürür; hasar kayıtlarıyla senkron
   kart ne kadar geniş olursa olsun bozulmasın diye yüzde değil px kullanılıyor. */
@keyframes tdSweep{0%,6%{left:calc(50% - 86px)}64%,72%{left:calc(50% + 86px)}86%,100%{left:calc(50% - 86px)}}
@keyframes tdLens{0%,4%{opacity:0}10%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes tdMarkA{0%,26%{opacity:0;transform:scale(.4)}32%{opacity:1;transform:scale(1.3)}38%,90%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}
@keyframes tdMarkB{0%,42%{opacity:0;transform:scale(.4)}48%{opacity:1;transform:scale(1.3)}54%,90%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}
@keyframes tdBadge{0%,54%{opacity:0;transform:translate(-50%,3px)}62%,90%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,0)}}
@keyframes tdBand{0%{left:10%;right:10%}64%,86%{left:39%;right:39%}100%{left:10%;right:10%}}

.td { position:relative;width:100%;height:190px;border-radius:14px;overflow:hidden;background:linear-gradient(160deg,#f2ece0,#ded6c4) }
.td-rule { position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(26,79,160,.05) 0 1px,transparent 1px 15px),repeating-linear-gradient(90deg,rgba(26,79,160,.04) 0 1px,transparent 1px 15px) }
.td-stamp { position:absolute;top:12px;right:14px;padding:2px 7px;border:1.5px dashed rgba(26,79,160,.4);border-radius:4px;font-size:6px;font-weight:900;letter-spacing:2px;color:rgba(26,79,160,.55);transform:rotate(-6deg) }

.td-shadow { position:absolute;left:50%;top:112px;width:172px;height:9px;transform:translateX(-50%);border-radius:50%;background:rgba(20,35,59,.16) }
.td-car { position:absolute;left:50%;top:62px;width:150px;height:52px;transform:translateX(-50%);z-index:3 }
.td-body { position:absolute;left:0;bottom:9px;width:150px;height:24px;border-radius:9px 11px 6px 6px;background:linear-gradient(180deg,#2c4270,#16233d) }
.td-roof { position:absolute;left:34px;bottom:30px;width:74px;height:22px;border-radius:12px 16px 2px 2px;background:linear-gradient(180deg,#33507f,#1d2f52) }
.td-win { position:absolute;bottom:33px;height:14px;border-radius:5px 7px 2px 2px;background:rgba(190,222,255,.72) }
.td-wheel { position:absolute;bottom:0;width:22px;height:22px;border-radius:50%;background:#111827;box-shadow:inset 0 0 0 3px #4b5563;z-index:4 }
.td-hub { position:absolute;left:50%;top:50%;width:12px;height:2px;margin:-1px 0 0 -6px;background:#9ca3af;border-radius:1px }

.td-mark { position:absolute;width:15px;height:15px;z-index:5 }
.td-mark::before,.td-mark::after { content:'';position:absolute;left:50%;top:50%;width:15px;height:2px;margin:-1px 0 0 -7.5px;background:#d1443c;border-radius:1px }
.td-mark::before { transform:rotate(45deg) }
.td-mark::after { transform:rotate(-45deg) }

.td-lens { position:absolute;top:56px;width:56px;height:56px;margin-left:-28px;z-index:6;animation:tdSweep 6.4s ease-in-out infinite }
.td-glass { position:absolute;inset:0;border-radius:50%;border:3px solid #14233b;background:radial-gradient(circle at 36% 30%,rgba(255,255,255,.55),rgba(120,190,255,.16));box-shadow:0 3px 8px rgba(20,35,59,.28);animation:tdLens 6.4s ease-in-out infinite }
.td-grip { position:absolute;left:78%;top:80%;width:5px;height:20px;border-radius:3px;background:#14233b;transform:rotate(-42deg);transform-origin:top center;animation:tdLens 6.4s ease-in-out infinite }
.td-tramer { position:absolute;left:50%;top:-14px;padding:2px 6px;border-radius:4px;background:#d1443c;color:#fff;font-size:6px;font-weight:900;letter-spacing:1.4px;white-space:nowrap;transform:translateX(-50%);animation:tdBadge 6.4s ease-in-out infinite }

.td-plate { position:absolute;left:14px;bottom:13px;display:flex;align-items:stretch;height:20px;border-radius:3px;overflow:hidden;border:1.5px solid #14233b;background:#fff;box-shadow:0 2px 4px rgba(20,35,59,.2);z-index:7 }
.td-plate-tr { display:flex;align-items:flex-end;justify-content:center;width:13px;padding-bottom:2px;background:#1a4fa0;color:#fff;font-size:5px;font-weight:900 }
.td-plate-no { display:flex;align-items:center;padding:0 6px;color:#14233b;font-size:11px;font-weight:900;letter-spacing:1px }

.td-est { position:absolute;right:14px;bottom:13px;width:42%;z-index:7 }
.td-est-row { display:flex;align-items:center;justify-content:space-between;margin-bottom:3px }
.td-est-lbl { font-size:6px;font-weight:900;letter-spacing:1.6px;color:rgba(20,35,59,.62) }
.td-est-cur { font-size:9px;font-weight:900;color:#14233b;letter-spacing:1px }
.td-est-track { position:relative;height:6px;border-radius:3px;background:rgba(20,35,59,.14);overflow:hidden }
.td-est-band { position:absolute;top:0;bottom:0;left:39%;right:39%;border-radius:3px;background:linear-gradient(90deg,rgba(26,79,160,.35),#1a4fa0,rgba(26,79,160,.35));animation:tdBand 6.4s ease-in-out infinite }

@media (prefers-reduced-motion: reduce) { .td * { animation: none !important } }
`;

function TorpidodanScene() {
  const { t } = useLang();
  const words = t.games.scenes.torpidodan;
  return (
    <div className="td">
      <style>{TD_CSS}</style>
      <div className="td-rule" />
      <div className="td-stamp">{words.stamp}</div>

      <div className="td-shadow" />
      <div className="td-car">
        <div className="td-roof" />
        <div className="td-win" style={{ left: '38px', width: '30px' }} />
        <div className="td-win" style={{ left: '72px', width: '32px' }} />
        <div className="td-body" />
        <div className="td-wheel" style={{ left: '22px' }}><div className="td-hub" /></div>
        <div className="td-wheel" style={{ right: '22px' }}><div className="td-hub" /></div>
        {/* Mercek üzerlerinden geçtikçe ortaya çıkan hasar kayıtları */}
        <div className="td-mark" style={{ left: '30px', top: '20px', animation: 'tdMarkA 6.4s ease-in-out infinite' }} />
        <div className="td-mark" style={{ left: '104px', top: '26px', animation: 'tdMarkB 6.4s ease-in-out infinite' }} />
      </div>

      <div className="td-lens">
        <div className="td-glass" />
        <div className="td-grip" />
        <div className="td-tramer">{words.tramer}</div>
      </div>

      <div className="td-plate">
        <div className="td-plate-tr">TR</div>
        <div className="td-plate-no">34 ARD 34</div>
      </div>

      <div className="td-est">
        <div className="td-est-row">
          <span className="td-est-lbl">{words.inspect}</span>
          <span className="td-est-cur">₺ ? ? ?</span>
        </div>
        <div className="td-est-track">
          <div className="td-est-band" />
        </div>
      </div>
    </div>
  );
}


function StatusBadge({ status }) {
  const { t } = useLang();
  if (status === 'live') {
    return (
      <span className="text-[10px] font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
        {t.games.statusLive}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[10px] font-black tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />{t.games.statusSoon}
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
 * çerçeve birebir aynı (h-190, rounded-2xl, alt kenar çizgisi).
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
      className="lr relative h-[190px] overflow-hidden rounded-2xl border-b border-white/5"
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

function GameCard({ game }) {
  const { t } = useLang();
  const tilt = useTilt();
  const Scene = game.scene;

  if (game.status === 'secret') {
    return (
      <motion.div variants={cardVariants}>
        <div
          ref={tilt.ref}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          className="group relative rounded-3xl border border-dashed border-white/8 bg-white/[0.01] overflow-hidden flex flex-col min-h-[460px] will-change-transform"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
          </div>
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
            <span className="text-[9px] font-black tracking-[0.4em] text-indigo-400/60 uppercase mb-2">
              {t.games.secret.codename}
            </span>
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
            <span className="text-[9px] text-gray-600 font-bold tracking-widest uppercase mt-2">
              {t.games.secret.soon}
            </span>
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
    <motion.div variants={cardVariants}>
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        data-cursor="soft"
        data-cursor-color={game.id === 'revo' ? 'teal' : undefined}
        className="group relative rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col min-h-[460px] will-change-transform"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Sahnelerin zemini opak, üstelik DOM'da Spotlight'tan SONRA
            geliyor — yani ışık anahtar görselin/çiziminin üstüne binmez,
            sadece altındaki camsı gövdeyi aydınlatır. Bilerek böyle:
            sahne kendi ışığını taşıyor, ikinci bir kaynak istemiyoruz. */}
        <Spotlight color={SPOTLIGHT_COLORS[game.id]} />

        {Scene && <Scene />}

        <div className="relative z-10 flex flex-col flex-1 p-8">
          <div className="flex items-center justify-between mb-5">
            <StatusBadge status={game.status} />
            <span className="text-[9px] text-gray-600 font-bold tracking-widest">{game.platforms}</span>
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
              <MagneticButton
                href={game.links.primary}
                target="_blank"
                rel="noreferrer"
                cursorColor="teal"
                className="w-full px-6 py-3.5 bg-[#3ECFC0] text-[#05070F] rounded-xl text-[10px] font-black tracking-widest uppercase text-center shadow-[0_0_25px_rgba(62,207,192,0.25)] block"
              >
                {words.linkPrimary} →
              </MagneticButton>

              {game.links.secondary && (
                <>
                  <MagneticButton
                    href={game.links.secondary}
                    target="_blank"
                    rel="noreferrer"
                    cursorColor="teal"
                    className="w-full px-6 py-3.5 border border-[#3ECFC0]/30 hover:border-[#3ECFC0]/70 rounded-xl text-[10px] font-black tracking-widest text-[#3ECFC0] uppercase text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3v12" />
                      <path d="m7 11 5 5 5-5" />
                      <path d="M4 20h16" />
                    </svg>
                    {words.linkSecondary}
                  </MagneticButton>
                  {words.linkSecondaryNote && (
                    <span className="text-[9px] text-gray-600 font-bold tracking-widest uppercase text-center">
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
              <div className="flex gap-3">
                {game.appStore && (
                  <MagneticButton
                    href={game.appStore}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-6 py-3.5 bg-white text-[#05070F] rounded-xl text-[10px] font-black tracking-widest uppercase text-center"
                  >
                    App Store
                  </MagneticButton>
                )}
                {game.googlePlay && (
                  <MagneticButton
                    href={game.googlePlay}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-6 py-3.5 border border-white/15 hover:border-white/40 rounded-xl text-[10px] font-black tracking-widest text-white uppercase text-center transition-colors block"
                  >
                    Google Play
                  </MagneticButton>
                )}
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
              <span className="text-[9px] text-gray-500 font-black tracking-[0.3em] uppercase">
                {/* Ortak metin "mağazalarda yakında" diyor; mobil oyunlar için
                    doğru ama mağazasız çıkacak yapımlar için değil. Oyun kendi
                    soonNote'unu verirse o kazanır. */}
                {words.soonNote || t.games.comingToStores}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MagneticButton({ href, className, children, target, rel, cursorColor }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px) scale(1.04)`;
    el.style.transition = 'transform 0.1s ease';
  };
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px) scale(1)';
    ref.current.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  };
  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="ring"
      data-cursor-color={cursorColor}
      className={className}
    >
      {children}
    </a>
  );
}

export { MagneticButton };

export default function Games() {
  const { t } = useLang();
  const games = [
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
    {
      id: 'apex',
      status: 'live',
      title: 'Apex Shift',
      platforms: 'WEB · BROWSER',
      scene: ApexShiftScene,
      links: { primary: 'https://ardaguner.com/apex-shift' },
    },
    {
  id: 'lore',
  status: 'soon',
  title: 'LORE - Legend of Rey: Echoes',
  platforms: 'WINDOWS · PC',
  scene: LoreScene,
  accent: '#A78BFA',
},
    {
      id: 'kafa',
      status: 'soon',
      title: 'Kafa Kafaya',
      platforms: 'IOS · ANDROID',
      scene: KafaKafayaScene,
    },
    {
      id: 'rushville',
      status: 'soon',
      title: 'Rushville',
      platforms: 'IOS · ANDROID',
      scene: RushvilleScene,
    },
    {
      id: 'skyline',
      status: 'soon',
      title: 'Skyline Swinger',
      platforms: 'IOS · ANDROID',
      scene: SkylineSwingerScene,
    },
    {
      id: 'torpidodan',
      status: 'soon',
      title: 'Torpidodan',
      platforms: 'IOS · ANDROID',
      scene: TorpidodanScene,
      accent: '#60A5FA',
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
        <p className="text-[11px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-3">
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
      <HoverPreviewList
        className="mt-32"
        items={[
          { id: 'switch',    title: 'Switch Master',   meta: t.games.previewMeta.switch,    image: '/games/switch.jpg',    href: '#games' },
          { id: 'revo',      title: 'REVO',            meta: t.games.previewMeta.revo,      image: '/games/revo.jpg',      href: '#games' },
          { id: 'decoy',     title: 'Decoy',           meta: t.games.previewMeta.decoy,     image: '/games/decoy.svg',     href: '#games' },
          { id: 'forza',     title: 'Forza Orbit',     meta: t.games.previewMeta.forza,     image: '/games/forza.jpg',     href: '#games' },
          { id: 'apex',      title: 'Apex Shift',      meta: t.games.previewMeta.apex,      image: '/games/apex.jpg',      href: '#games' },
          { id: 'lore',      title: t.games.items.lore.title, meta: t.games.previewMeta.lore, image: '/games/lore.webp', href: '#games' },
          { id: 'kafa',      title: 'Kafa Kafaya',     lang: 'tr', meta: t.games.previewMeta.kafa,      image: '/games/kafa.jpg',      href: '#games' },
          { id: 'rushville', title: 'Rushville',       meta: t.games.previewMeta.rushville, image: '/games/rushville.jpg', href: '#games' },
          { id: 'skyline',   title: 'Skyline Swinger', meta: t.games.previewMeta.skyline,   image: '/games/skyline.jpg',   href: '#games' },
          { id: 'torpidodan', title: 'Torpidodan',     lang: 'tr', meta: t.games.previewMeta.torpidodan, image: '/games/torpidodan.svg', href: '#games' },
        ]}
      />
    </section>
  );
}