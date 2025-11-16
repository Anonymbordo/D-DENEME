'use client'

import React, { useEffect } from 'react'

function ServiceCard({title, text}: {title: string, text: string}){
  return (
    <div className="service-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

export default function Landing(){
  useEffect(() => {
    const spans = document.querySelectorAll('.landing-hero h1 span')
    spans.forEach(span => {
      span.classList.add('animate-line')
    })
  }, [])

  return (
    <div className="landing-root">
      <section className="landing-hero">
        <div className="hero-left">
          <h1>
            <span className="reveal">Sağlığa</span>
            <span className="reveal"> Açılan</span>
            <span className="reveal"> Kişiselleştirilmiş</span>
            <span className="reveal accent"> Akış.</span>
          </h1>
          <p className="subtitle">Vücudunuzu dinleyen, bilim destekli ve sadece size özel beslenme planları ile sürdürülebilir sağlıklı yaşama adım atın.</p>
        </div>
        <div className="hero-right">
          <div className="promo-card">Premium Beslenme Vizyonu</div>
        </div>
      </section>

      <section className="services">
        <h2>Premium Hizmetlerimiz</h2>
        <div className="services-grid">
          <ServiceCard title="Kişiye Özel Program" text="Benzersiz biyolojik yapınıza, alerjilerinize ve hedeflerinize uygun, esnek beslenme akışları." />
          <ServiceCard title="Bilimsel Yaklaşım" text="En güncel klinik araştırmalar ve tıbbi verilerinizle desteklenen, kanıtlanmış stratejiler." />
          <ServiceCard title="Sürekli Destek" text="Haftalık birebir kontrol ve diyetisyenle anlık mesajlaşma erişimi ile motivasyonunuzu koruyun." />
        </div>
      </section>
    </div>
  )
}

