import React, {useState, useEffect} from 'react'
import {loadFoodPools, generateMenuForProfile} from '../utils/generator'

export default function Recommendations({profile}){
  const [menu, setMenu] = useState([])

  useEffect(()=>{
    loadFoodPools()
    if(!profile){
      const p = localStorage.getItem('dt_profile')
      if(p) profile = JSON.parse(p)
    }
    if(profile){
      const gen = generateMenuForProfile(profile)
      setMenu(gen)
    }
  },[])

  if(!profile) return <div className="card"><strong>Profil yok</strong><div>Lütfen önce profil oluşturup kaydedin.</div></div>

  return (
    <div className="card">
      <h2>Oluşturulan Menü</h2>
      <div>Profil: {profile.sex === 'female' ? 'Kadın' : profile.sex === 'male' ? 'Erkek' : profile.sex}, {profile.age} yaş, {profile.weight} kg, {profile.height} cm</div>
      <div style={{marginTop:8}}>
        {menu.map((m,idx)=> (
          <div key={idx} style={{borderTop: '1px solid #eee', paddingTop:8, marginTop:8}}>
            <strong>Öğün {m.meal_no}</strong>
            <div>{m.items}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
