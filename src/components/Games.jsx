import { motion } from 'framer-motion';
import { useRef } from 'react';

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

function StatusBadge({ status }) {
  if (status === 'live') {
    return (
      <span className="text-[10px] font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
        ● Yayında
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[10px] font-black tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />Çok Yakında
    </span>
  );
}

function GameCard({ game }) {
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
          <div className="flex flex-col flex-1 p-8 items-center justify-center text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-2xl mb-6"
            >
              🔒
            </motion.div>
            <span className="text-[9px] font-black tracking-[0.4em] text-indigo-400/60 uppercase mb-2">
              Project Codename: Unknown
            </span>
            <h3 className="text-xl font-black text-white mb-4 tracking-wider uppercase">YENİ PROJE</h3>
            <p className="text-gray-500 max-w-xs text-xs font-light leading-relaxed">
              Sınırları zorlayan yeni nesil bir mobil deneyim için AR-GE süreçlerimiz devam ediyor.
              Çok yakında burada listelenecek — takipte kal.
            </p>
            <div className="mt-8 w-full h-px bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
              />
            </div>
            <span className="text-[9px] text-gray-600 font-bold tracking-widest uppercase mt-2">
              Yakında...
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  const isLive = game.status === 'live';
  return (
    <motion.div variants={cardVariants}>
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group relative rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col min-h-[460px] will-change-transform"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {Scene && <Scene />}

        <div className="flex flex-col flex-1 p-8">
          <div className="flex items-center justify-between mb-5">
            <StatusBadge status={game.status} />
            <span className="text-[9px] text-gray-600 font-bold tracking-widest">{game.platforms}</span>
          </div>
          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{game.title}</h3>
          <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 flex-1">
            {game.desc}
          </p>

          {isLive ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-xs text-yellow-400">★</span>)}
                </div>
                <span className="text-xs text-gray-500 font-medium">{game.rating}</span>
              </div>
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
                Mağazalarda çok yakında
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MagneticButton({ href, className, children, target, rel }) {
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
    <a ref={ref} href={href} target={target} rel={rel} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={className}>
      {children}
    </a>
  );
}

export { MagneticButton };

export default function Games() {
  const games = [
    {
      status: 'live',
      title: 'Switch Master: Railway',
      desc: 'Demiryolu makaslarını doğru zamanda değiştir, trenleri kazasız hedeflerine ulaştır. Refleks ve stratejiyi birleştiren minimalist bir bulmaca deneyimi.',
      platforms: 'IOS · ANDROID',
      rating: '5 · 10+ değerlendirme',
      scene: TrainScene,
      appStore: 'https://apps.apple.com/tr/app/switch-master-railway/id6770972534?l=tr',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.ardeko.switchmaster&pcampaignid=web_share',
    },
    {
      status: 'soon',
      title: 'Kafa Kafaya',
      desc: 'İki oyuncunun kıyasıya çarpıştığı, fizik tabanlı hızlı bir kafa topu oyunu. Kupalar, yetenek kartları ve çevrimiçi sıralamayla rekabetçi mobil deneyim.',
      platforms: 'IOS · ANDROID',
      scene: KafaKafayaScene,
    },
    {
      status: 'soon',
      title: 'Rushville',
      desc: 'Büyüyen şehrin trafiğini akışta tut. Renk renk mahalleleri yollarla bağla, tıkanıklığı çöz — sade ama derin bir şehir-bulmaca.',
      platforms: 'ANDROID',
      scene: RushvilleScene,
    },
    {
      status: 'soon',
      title: 'Skyline Swinger',
      desc: 'Alacakaranlık şehrinde ağdan ağa savrul. Sarkaç fiziğiyle çalışan, refleks odaklı sonsuz koşu.',
      platforms: 'IOS · ANDROID',
      scene: SkylineSwingerScene,
    },
    {
      status: 'soon',
      title: 'Forza Shift',
      desc: "Halkadan halkaya fırla, tam kenarda 'Perfect' yakala. Zamanlama üzerine kurulu minimalist, hipnotik bir arcade.",
      platforms: 'IOS · ANDROID',
      scene: ForzaShiftScene,
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
          Neler Yapıyoruz?
        </p>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          PROJELERİMİZ
        </h2>
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
    </section>
  );
}
