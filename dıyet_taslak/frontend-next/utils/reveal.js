// Small reveal-on-scroll helper using IntersectionObserver
export function initReveal(selector = '.reveal'){
  if(typeof window === 'undefined' || !('IntersectionObserver' in window)){
    // fallback: just make visible
    document.querySelectorAll(selector).forEach(el => el.classList.add('visible'))
    return
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible')
        io.unobserve(entry.target)
      }
    })
  },{threshold: 0.12})

  document.querySelectorAll(selector).forEach(el => io.observe(el))
}

export function initTextStagger(root = document){
  // add animate-line class to hero heading spans if present
  const spans = root.querySelectorAll('.landing-hero h1 span')
  spans.forEach(s => s.classList.add('animate-line'))
}
