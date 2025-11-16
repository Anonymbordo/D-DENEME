'use client'

import React from 'react'
import { Breakfast, Snack, Lunch, Dinner, Water, Logo } from '@/components/Icon'

export default function Home({onNavigate, profile}){
  const kcal = profile?.computed?.energy_plan_kcal ?? 1739
  const target = profile ? `${Math.round(profile.weight)} kg` : '67 kg'
  const days = profile ? '50 GÜN' : '50 GÜN'

  return (
    <div className="mobile-shell modern">
      <div className="mobile-top modern-top">
        <div className="brand-row">
          <div className="logo-wrap"><Logo size={36} /></div>
          <div className="brand">Cixol</div>
        </div>
        <div className="banner-avatars">Uzman Diyetisyenlerimiz</div>
      </div>

      <div className="hero modern-hero">
        <div className="hero-circle">
          <div className="avatar-figure">👩</div>
          <div className="kcal">{kcal} Kcal</div>
        </div>
        <div className="hero-meta">
          <div className="meta-item">Hedef: <strong>{target}</strong></div>
          <div className="meta-item">{days}</div>
        </div>
        <button className="water-fab" title="Add water"><Water /></button>
      </div>

      <div className="meals modern-meals">
        <button className="meal-btn modern" onClick={()=>onNavigate('rec')}><Breakfast /> <span>Kahvaltı</span></button>
        <button className="meal-btn modern" onClick={()=>onNavigate('meal')}><Snack /> <span>Ara öğün</span></button>
        <button className="meal-btn modern" onClick={()=>onNavigate('meal')}><Lunch /> <span>Öğle Yemeği</span></button>
        <button className="meal-btn modern" onClick={()=>onNavigate('meal')}><Dinner /> <span>Akşam Yemeği</span></button>
      </div>

      <div className="mobile-bottom-nav modern-nav">
        <button aria-label="home" onClick={()=>onNavigate('home')}>🏠</button>
        <button aria-label="photos" onClick={()=>onNavigate('meal')}>📷</button>
        <button aria-label="logs" onClick={()=>onNavigate('meal')}>📝</button>
        <button aria-label="library" onClick={()=>onNavigate('rec')}>📚</button>
        <button aria-label="menu" onClick={()=>onNavigate('profile')}>☰</button>
      </div>
    </div>
  )
}

