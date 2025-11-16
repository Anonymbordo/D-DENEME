import React, { useState, useEffect } from 'react'
import Profile from './pages/Profile'
import MealLog from './pages/MealLog'
import Recommendations from './pages/Recommendations'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Chatbot from './components/Chatbot'

export default function App() {
  const [page, setPage] = useState('landing')
  const [profile, setProfile] = useState(null)

  const [isHeaderMounted, setIsHeaderMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

  // header animasyon & scroll durumu
  useEffect(() => {
    setIsHeaderMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goLanding = () => {
    setPage('landing')
    setIsNavOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startAnalysis = () => {
    setPage('home')
    setIsNavOpen(false)
  }

  const handleHomeNavigate = (p) => {
    if (p === 'profile') setPage('profile')
    if (p === 'meal') setPage('meal')
    if (p === 'rec') setPage('rec')
  }

  return (
    <div className="app landing-root">
      {/* HEADER */}
      <header
        className={
          'site-header' +
          (isHeaderMounted ? ' mounted' : '') +
          (isScrolled ? ' scrolled' : '')
        }
      >
        <div className="header-inner">
          {/* LOGO */}
          <div className="logo" onClick={goLanding}>
            HEALFLOW
          </div>

          {/* NAV */}
          <nav className={`site-nav ${isNavOpen ? 'open' : ''}`}>
            <a onClick={goLanding}>Ana Sayfa</a>
            <a href="#services">Hizmetler</a>
            <a href="#dietitian">Diyetisyen</a>
            <a onClick={startAnalysis}>Analiz Başla</a>
            <a href="#contact">İletişim</a>
          </nav>

          {/* ACTIONS (sağ kısım) */}
          <div className="actions">
            <button className="btn-cta" onClick={startAnalysis}>
              Analiz Başla
            </button>

            <button
              className="hamburger"
              onClick={() => setIsNavOpen((prev) => !prev)}
              aria-label="Menüyü aç/kapat"
            >
              {/* basit ikon, istersen yerine svg koyabiliriz */}
              <span>☰</span>
            </button>
          </div>
        </div>
      </header>

      {/* SAYFA İÇERİĞİ */}
      <main>
        {page === 'landing' && <Landing />}
        {page === 'home' && (
          <Home onNavigate={handleHomeNavigate} profile={profile} />
        )}
        {page === 'profile' && (
          <Profile
            onSave={(p) => {
              setProfile(p)
              setPage('rec')
            }}
          />
        )}
        {page === 'meal' && <MealLog profile={profile} />}
        {page === 'rec' && <Recommendations profile={profile} />}
      </main>

      {/* AI Chatbot */}
      <Chatbot profile={profile} />
    </div>
  )
}
