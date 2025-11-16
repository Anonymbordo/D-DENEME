import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { initReveal, initTextStagger } from './utils/reveal'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// initialize reveal effects after a short delay to allow app render
setTimeout(()=>{
  try{
    initTextStagger(document)
    initReveal('.reveal')
  }catch(e){ console.warn('reveal init failed', e) }
}, 120)
