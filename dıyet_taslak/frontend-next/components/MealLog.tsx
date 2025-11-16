'use client'

import React, {useState, useEffect} from 'react'

interface MealLogProps {
  profile: any
}

export default function MealLog({profile}: MealLogProps){
  const [logs, setLogs] = useState<any[]>([])
  const [text, setText] = useState('')

  useEffect(()=>{
    const s = localStorage.getItem('dt_meal_logs')
    if(s) setLogs(JSON.parse(s))
  },[])

  function add(){
    const entry = {id: Date.now(), time: new Date().toISOString(), text}
    const next = [entry, ...logs]
    setLogs(next)
    localStorage.setItem('dt_meal_logs', JSON.stringify(next))
    setText('')
  }

  return (
    <div className="card">
      <h2>Meal Log</h2>
      <textarea rows={3} value={text} onChange={e=>setText(e.target.value)} style={{width:'100%'}} />
      <div style={{marginTop:8}}>
        <button onClick={add}>Add Log</button>
      </div>
      <ul style={{marginTop:12}}>
        {logs.map(l=> <li key={l.id}><strong>{new Date(l.time).toLocaleString()}:</strong> {l.text}</li>)}
      </ul>
    </div>
  )
}

