'use client'

import React, {useState, useEffect} from 'react'
import {loadFoodPools, generateMenuForProfile} from '@/utils/generator'

export default function Recommendations({profile}: {profile?: any}){
  const [menu, setMenu] = useState<any[]>([])
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{
    loadFoodPools()
    let p = profile
    if(!p){
      const stored = localStorage.getItem('dt_profile')
      if(stored) p = JSON.parse(stored)
    }
    if(p){
      setProfileData(p)
      const fetchMenu = async () => {
        setLoading(true)
        setError('')
        try {
          const gen = await generateMenuForProfile(p)
          setMenu(gen)
        } catch (err) {
          console.error('Menu generation error:', err)
          setError('Menü oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
        } finally {
          setLoading(false)
        }
      }
      fetchMenu()
    }
  },[profile])

  if(!profileData) {
    return (
      <div className="recommendations-container">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>Henüz profil oluşturulmamış</h2>
          <p>Kişiselleştirilmiş beslenme menüsü için lütfen önce profilinizi oluşturun.</p>
        </div>
      </div>
    )
  }

  if(loading) {
    return (
      <div className="recommendations-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <h2>🤖 AI Menünüz Hazırlanıyor...</h2>
          <p>Profilinize özel beslenme planı oluşturuluyor, lütfen bekleyin.</p>
        </div>
      </div>
    )
  }

  if(error) {
    return (
      <div className="recommendations-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Bir Sorun Oluştu</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const getMealIcon = (mealNo: number) => {
    const icons = ['☀️', '🍎', '🍽️', '🌙']
    return icons[mealNo - 1] || '🍴'
  }

  const getMealName = (mealNo: number) => {
    const names = ['Kahvaltı', 'Ara Öğün', 'Öğle Yemeği', 'Akşam Yemeği']
    return names[mealNo - 1] || `Öğün ${mealNo}`
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <div className="header-content">
          <h1>Kişiselleştirilmiş Beslenme Menünüz</h1>
          <div className="profile-summary">
            <span className="profile-badge">
              {profileData.sex === 'female' ? '👩' : '👨'} {profileData.sex === 'female' ? 'Kadın' : 'Erkek'}
            </span>
            <span className="profile-badge">🎂 {profileData.age} yaş</span>
            <span className="profile-badge">⚖️ {profileData.weight} kg</span>
            <span className="profile-badge">📏 {profileData.height} cm</span>
          </div>
        </div>
      </div>

      <div className="menu-grid">
        {menu.map((m, idx) => (
          <div key={idx} className="meal-card">
            <div className="meal-header">
              <span className="meal-icon">{getMealIcon(m.meal_no)}</span>
              <h3>{getMealName(m.meal_no)}</h3>
            </div>
            <div className="meal-items">
              {m.items.split(';').map((item: string, i: number) => (
                <div key={i} className="meal-item">
                  <span className="bullet">•</span>
                  <span>{item.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="menu-footer">
        <p className="disclaimer">
          💡 Bu menü, profilinize göre otomatik olarak oluşturulmuştur. 
          Özel sağlık durumlarınız için mutlaka bir diyetisyene danışın.
        </p>
      </div>
    </div>
  )
}

