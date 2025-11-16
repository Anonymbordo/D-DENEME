'use client'

interface HeaderProps {
  isHeaderMounted: boolean
  isScrolled: boolean
  isNavOpen: boolean
  setIsNavOpen: (open: boolean) => void
  goLanding: () => void
  startAnalysis: () => void
  goProfile: () => void
}

export default function Header({
  isHeaderMounted,
  isScrolled,
  isNavOpen,
  setIsNavOpen,
  goLanding,
  startAnalysis,
  goProfile
}: HeaderProps) {
  const scrollToServices = () => {
    goLanding()
    setTimeout(() => {
      const element = document.querySelector('.services')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
    setIsNavOpen(false)
  }

  return (
    <header
      className={
        'site-header' +
        (isHeaderMounted ? ' mounted' : '') +
        (isScrolled ? ' scrolled' : '')
      }
    >
      <div className="header-inner">
        <div className="logo" onClick={goLanding} style={{ cursor: 'pointer' }}>
          HEALFLOW
        </div>

        <nav className={`site-nav ${isNavOpen ? 'open' : ''}`}>
          <a onClick={goLanding} style={{ cursor: 'pointer' }}>Ana Sayfa</a>
          <a onClick={scrollToServices} style={{ cursor: 'pointer' }}>Hizmetler</a>
          <a onClick={goProfile} style={{ cursor: 'pointer' }}>Profil</a>
          <a onClick={startAnalysis} style={{ cursor: 'pointer' }}>Analiz Başla</a>
          <a onClick={scrollToServices} style={{ cursor: 'pointer' }}>İletişim</a>
        </nav>

        <div className="actions">
          <button className="btn-cta" onClick={startAnalysis}>
            Analiz Başla
          </button>

          <button
            className="hamburger"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Menüyü aç/kapat"
          >
            <span>☰</span>
          </button>
        </div>
      </div>
    </header>
  )
}
