import React, {useState, useEffect, useRef} from 'react'

export default function Header(){
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const headerRef = useRef(null)

  useEffect(()=>{
    function onScroll(){
      const el = headerRef.current
      if(!el) return
      if(window.scrollY > 12) el.classList.add('scrolled')
      else el.classList.remove('scrolled')
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  useEffect(()=>{
    // Trigger mount animation slightly after render
    const t = setTimeout(()=> setMounted(true), 120)
    return ()=> clearTimeout(t)
  },[])

  return (
    <header id="site-header" ref={headerRef} className={`site-header ${mounted? 'mounted':''}`}>
      <div className="header-inner">
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div className="logo">HealFlow</div>
        </div>

        {/* Move CTA next to logo for left-aligned CTA layout */}
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <button className="btn-cta">Analiz Başla</button>
        </div>

        <nav className={`site-nav ${open? 'open':''}`}>
          <a className="nav-link">Ana Sayfa</a>
          <a className="nav-link">Hizmetler</a>
          <a className="nav-link">Diyetisyen</a>
          <a className="nav-link">Analiz Başla</a>
          <a className="nav-link">İletişim</a>
        </nav>

        <div className="actions">
          <button className="hamburger" aria-label="menu" onClick={()=>setOpen(v=>!v)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#0f1724" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </header>
  )
}
