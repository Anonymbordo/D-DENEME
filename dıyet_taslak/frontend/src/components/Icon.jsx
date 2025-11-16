import React from 'react'

export function Breakfast(){
  return (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6" width="20" height="12" rx="2" fill="#FFB86B"/><path d="M7 10h10" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>)
}

export function Snack(){
  return (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#FFD166"/><path d="M9 12h6" stroke="#7A4BEB" strokeWidth="1.2" strokeLinecap="round"/></svg>)
}

export function Lunch(){
  return (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="10" rx="3" fill="#8BD3DD"/><path d="M6 14v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
}

export function Dinner(){
  return (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12h16" stroke="#FFD1F0" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 6v6" stroke="#7A4BEB" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 6v6" stroke="#7A4BEB" strokeWidth="1.5" strokeLinecap="round"/></svg>)
}

export function Water(){
  return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2s4 3 4 6c0 3-4 7-4 14-0-7-4-11-4-14 0-3 4-6 4-6z" fill="#87CEFA"/><path d="M12 14v6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>)
}

export function Logo({size=40}){
  return (<svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#7d5cf0"/><stop offset="1" stopColor="#ff7a7a"/></linearGradient></defs><rect width="48" height="48" rx="10" fill="url(#g)"/><path d="M14 24c0-5.5 4.5-10 10-10v0c5.5 0 10 4.5 10 10v0c0 5.5-4.5 10-10 10v0c-5.5 0-10-4.5-10-10z" fill="#fff" opacity="0.95"/></svg>)
}

export default function Icon(){ return null }
