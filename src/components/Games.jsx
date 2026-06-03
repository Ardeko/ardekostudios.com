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
 
function GameCard({ game }) {
  const tilt = useTilt();
  return (
    <motion.div variants={cardVariants}>
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className={`group relative rounded-3xl border overflow-hidden flex flex-col min-h-[460px] will-change-transform ${
          game.live
            ? 'bg-white/[0.03] border-white/10'
            : 'bg-white/[0.01] border-dashed border-white/8'
        }`}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
        {game.live && <TrainScene />}
 
        <div className={`flex flex-col flex-1 p-8 ${!game.live ? 'items-center justify-center text-center' : ''}`}>
          {game.live ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
                  ● Yayında
                </span>
                <span className="text-[9px] text-gray-600 font-bold tracking-widest">IOS · ANDROID</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Switch Master: Railway</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 flex-1">
                Demiryolu makaslarını doğru zamanda değiştir, trenleri kazasız hedeflerine ulaştır.
                Refleks ve stratejiyi birleştiren minimalist bir bulmaca deneyimi.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-xs text-yellow-400">★</span>)}
                </div>
                <span className="text-xs text-gray-500 font-medium">5 · 10+ değerlendirme</span>
              </div>
              <div className="flex gap-3">
                <MagneticButton
                  href="https://apps.apple.com/tr/app/switch-master-railway/id6770972534?l=tr"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-6 py-3.5 bg-white text-[#05070F] rounded-xl text-[10px] font-black tracking-widest uppercase text-center"
                >
                  App Store
                </MagneticButton>
                <MagneticButton
                  href="https://play.google.com/store/apps/details?id=com.ardeko.switchmaster&pcampaignid=web_share"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-6 py-3.5 border border-white/15 hover:border-white/40 rounded-xl text-[10px] font-black tracking-widest text-white uppercase text-center transition-colors block"
                >
                  Google Play
                </MagneticButton>
              </div>
            </>
          ) : (
            <>
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
  const games = [{ live: true }, { live: false }];
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