import { Component } from 'react';

/**
 * Ardeko Studios — çöküş ağı.
 *
 * Neden var: React 19'da yakalanmayan bir render hatası tüm ağacı söker.
 * Geriye boş bir <div id="root"> ve gövdenin koyu zemini kalır — yani
 * kullanıcı açısından "site siyah ekranda kaldı". Hata mesajı sadece
 * konsolda durur ve telefonda konsol yoktur.
 *
 * Buradaki fallback bilerek SATIR İÇİ stille yazıldı: sorun CSS'in kendisiyse
 * (Tailwind v4 çıktısı `@property`/`oklch`/`color-mix` kullanıyor, bunlar
 * Safari 16.4 öncesinde yok sayılır) Tailwind sınıflarına güvenilemez.
 *
 * Cihazda teşhis: siteyi `?debug=1` ile aç. O modda React dışındaki hatalar
 * (rAF callback'i, event handler, reddedilen promise) da ekrana basılır —
 * masaüstü konsoluna bağlanmadan iPhone'da hata okunabilir.
 */

function debugEnabled() {
  try {
    return new URLSearchParams(window.location.search).has('debug');
  } catch {
    return false;
  }
}

const shell = {
  position: 'fixed',
  inset: 0,
  zIndex: 2147483647,
  overflow: 'auto',
  background: '#05070F',
  color: '#E2E8F0',
  padding: '24px',
  font: '14px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace',
  WebkitTextSizeAdjust: '100%',
};

const heading = {
  margin: '0 0 4px',
  font: '900 18px/1.2 system-ui, -apple-system, sans-serif',
  letterSpacing: '0.02em',
  color: '#FFFFFF',
};

const note = { margin: '0 0 20px', color: '#94A3B8', fontSize: '13px' };

const box = {
  margin: '0 0 12px',
  padding: '14px',
  borderRadius: '12px',
  border: '1px solid rgba(244,63,94,0.35)',
  background: 'rgba(244,63,94,0.08)',
  color: '#FDA4AF',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const button = {
  appearance: 'none',
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'transparent',
  color: '#FFFFFF',
  borderRadius: '10px',
  padding: '12px 20px',
  font: '700 13px system-ui, -apple-system, sans-serif',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  minHeight: '44px',
};

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, globals: [] };
    this.debug = debugEnabled();
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Konsolu koru: masaüstünde hâlâ en iyi teşhis kaynağı.
    console.error('[ardeko] render hatası:', error, info?.componentStack);
  }

  componentDidMount() {
    if (!this.debug) return;

    this.onError = (e) => {
      const where = e.filename ? ` @ ${e.filename}:${e.lineno}` : '';
      this.push(`${e.message}${where}`);
    };
    this.onRejection = (e) => {
      this.push(`Yakalanmayan promise: ${e.reason?.message ?? String(e.reason)}`);
    };

    window.addEventListener('error', this.onError);
    window.addEventListener('unhandledrejection', this.onRejection);
  }

  componentWillUnmount() {
    if (!this.debug) return;
    window.removeEventListener('error', this.onError);
    window.removeEventListener('unhandledrejection', this.onRejection);
  }

  push(message) {
    this.setState((s) =>
      s.globals.includes(message) ? null : { globals: [...s.globals, message] }
    );
  }

  render() {
    const { error, globals } = this.state;

    if (error) {
      return (
        <div style={shell}>
          <h1 style={heading}>Site yüklenemedi</h1>
          <p style={note}>
            Beklenmedik bir hata oluştu. Sayfayı yenilemek çoğu zaman yeterli oluyor.
          </p>
          <pre style={box}>{error?.message || String(error)}</pre>
          {this.debug && error?.stack && <pre style={box}>{error.stack}</pre>}
          <button type="button" style={button} onClick={() => window.location.reload()}>
            Yeniden dene
          </button>
        </div>
      );
    }

    return (
      <>
        {this.props.children}
        {this.debug && globals.length > 0 && (
          <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2147483647,
              maxHeight: '45vh',
              overflow: 'auto',
              padding: '12px',
              background: 'rgba(5,7,15,0.96)',
              borderTop: '1px solid rgba(244,63,94,0.5)',
              color: '#FDA4AF',
              font: '12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            {globals.map((g) => (
              <div key={g} style={{ marginBottom: '6px', wordBreak: 'break-word' }}>
                {g}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}
