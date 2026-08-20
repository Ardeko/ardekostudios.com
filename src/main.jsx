import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import 'lenis/dist/lenis.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

// index.html'deki statik boot ekranını kaldır. React mount oldu; buradan
// sonrasını <Preloader> devralıyor (ya da intro atlanıyorsa doğrudan site).
// Bir kare bekliyoruz ki Preloader'ın perdesi silinmeden önce boyanmış olsun,
// arada beyaz/boş bir kare çakmasın.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.getElementById('boot')?.remove()
  })
})
