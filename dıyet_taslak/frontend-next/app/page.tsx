'use client'

import { useState, useEffect } from 'react'
import Landing from '@/components/Landing'
import Home from '@/components/Home'
import Profile from '@/components/Profile'
import MealLog from '@/components/MealLog'
import Recommendations from '@/components/Recommendations'
import Header from '@/components/Header'
import Chatbot from '@/components/Chatbot'

export default function Page() {
  const [page, setPage] = useState('landing')
  const [profile, setProfile] = useState<any>(null)
  const [isHeaderMounted, setIsHeaderMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    // Profil yükle
    const savedProfile = localStorage.getItem('dt_profile')
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch (e) {
        console.error('Profile load error:', e)
      }
    }

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

  const goProfile = () => {
    setPage('profile')
    setIsNavOpen(false)
  }

  const handleHomeNavigate = (p: string) => {
    if (p === 'profile') setPage('profile')
    if (p === 'meal') setPage('meal')
    if (p === 'rec') setPage('rec')
    if (p === 'home') setPage('home')
  }

  return (
    <div className="app landing-root">
      <Header 
        isHeaderMounted={isHeaderMounted}
        isScrolled={isScrolled}
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
        goLanding={goLanding}
        startAnalysis={startAnalysis}
        goProfile={goProfile}
      />

      <main>
        {page === 'landing' && <Landing />}
        {page === 'home' && <Home onNavigate={handleHomeNavigate} profile={profile} />}
        {page === 'profile' && (
          <Profile
            onSave={(p: any) => {
              setProfile(p)
              setPage('rec')
            }}
          />
        )}
        {page === 'meal' && <MealLog profile={profile} />}
        {page === 'rec' && <Recommendations profile={profile} />}
      </main>

      <Chatbot profile={profile} />
    </div>
  )
}
