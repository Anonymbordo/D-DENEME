'use client'

import React, {useState} from 'react'
import {calcAll} from '@/utils/calculators'

interface ProfileProps {
  onSave: (profile: any) => void
}

export default function Profile({onSave}: ProfileProps){
  const [form, setForm] = useState({age:30, sex:'female', weight:70, height:170, pal:'moderate', meals_per_day:3, allergies:''})
  const [result, setResult] = useState<any>(null)

  function handleChange(e){
    const {name, value} = e.target
    setForm({...form, [name]: value})
  }

  function runCalc(){
    const parsed = {...form, age: parseInt(form.age,10), weight: parseFloat(form.weight), height: parseFloat(form.height), meals_per_day: parseInt(form.meals_per_day,10)}
    const r = calcAll(parsed)
    setResult(r)
  }

  function save(){
    if(result===null) runCalc()
    const profile = {...form, computed: result}
    localStorage.setItem('dt_profile', JSON.stringify(profile))
    if(onSave) onSave(profile)
    alert('Profile saved locally')
  }

  return (
    <div className="profile-card card">
      <div className="profile-header">
        <h2>Profile</h2>
        <p className="profile-sub">Bilgilerinizi girin; hesaplama anında yapılır.</p>
      </div>

      <div className="profile-grid">
        <div className="form-row">
          <label>Age</label>
          <input name="age" value={form.age} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Sex</label>
          <select name="sex" value={form.sex} onChange={handleChange}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <div className="form-row">
          <label>Weight (kg)</label>
          <input name="weight" value={form.weight} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Height (cm)</label>
          <input name="height" value={form.height} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>PAL</label>
          <select name="pal" value={form.pal} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        <div className="form-row">
          <label>Meals per day</label>
          <select name="meals_per_day" value={form.meals_per_day} onChange={handleChange}>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div className="form-row" style={{gridColumn: '1 / -1'}}>
          <label>Allergies (comma separated)</label>
          <input name="allergies" value={form.allergies} onChange={handleChange} />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={runCalc}>Calculate</button>
        <button className="btn-secondary" onClick={save}>Save & Use</button>
      </div>

      {result && (
        <div className="computed-panel">
          <h3>Computed</h3>
          <div className="computed-grid">
            <div><strong>BMI:</strong> {result.bmi} <span className="muted">({result.bmi_category})</span></div>
            <div><strong>BMR (Mifflin):</strong> {result.bmr}</div>
            <div><strong>TEH:</strong> {result.teh}</div>
            <div><strong>Energy plan:</strong> {result.energy_plan_kcal} kcal</div>
            <div className="macros"><strong>Macros:</strong> C {result.macros.carbs_g}g • P {result.macros.protein_g}g • F {result.macros.fat_g}g</div>
          </div>
        </div>
      )}
    </div>
  )
}

