import {macro_distribution} from './calculators'

// lightweight copy of pools (mirrors backend prototype pools)
let FOOD_POOLS = {
  milk_group: [ '1 cup milk (200 ml)', '1 small yogurt (150 g)', '1 ayran (200 ml)'],
  meat_group: [ '50 g chicken breast', '50 g fish', '1 boiled egg'],
  bread_group: [ '1 slice bread', '1/2 cup cooked rice', '1 small bowl soup'],
  veg_group: [ '1 serving cooked vegetable', '1 bowl salad'],
  fruit_group: [ '1 medium apple', '1 banana'],
  fat_group: [ '1 tsp olive oil', '1 tsp butter'],
  legume_group: [ '2 tbsp cooked lentils', '2 tbsp cooked chickpeas']
}

export function loadFoodPools(){
  // placeholder for async loading later
  return FOOD_POOLS
}

function pick(foodArray, forbidden=[]){
  const candidates = foodArray.filter(n => !forbidden.some(f => n.toLowerCase().includes(f.toLowerCase())))
  return candidates.length? candidates[Math.floor(Math.random()*candidates.length)] : foodArray[Math.floor(Math.random()*foodArray.length)]
}

export async function generateMenuForProfile(profile){
  const comp = profile.computed || profile
  const kcal = comp.energy_plan_kcal || (profile.energy_plan_kcal)
  const meals = parseInt(profile.meals_per_day || 3, 10)
  const forbidden = (profile.allergies || '').split(',').map(s=>s.trim()).filter(Boolean)
  const macros = macro_distribution(kcal)

  try {
    // AI ile menü oluştur
    const prompt = `Sen Türk mutfağı uzmanı bir diyetisyensin. TAMAMEN TÜRKÇE bir günlük beslenme menüsü hazırla.

KİŞİ BİLGİLERİ:
• ${profile.sex === 'female' ? 'Kadın' : 'Erkek'}, ${profile.age} yaşında
• Kilo: ${profile.weight} kg, Boy: ${profile.height} cm
• Günlük kalori hedefi: ${kcal} kcal
• Makro dağılımı: ${macros.carbs_g}g karbonhidrat, ${macros.protein_g}g protein, ${macros.fat_g}g yağ
• Öğün sayısı: ${meals}${forbidden.length > 0 ? `\n• Yemeyenler/Alerjiler: ${forbidden.join(', ')}` : ''}

KURALLAR:
✓ Sadece TÜRK mutfağı (menemen, çorba, pilav, zeytinyağlı, izgara vs.)
✓ Her öğünü TÜRKÇE yaz
✓ Porsiyon: tam sayı (1 kase, 2 dilim, 100 gram gibi)
✓ Basit, evde kolayca hazırlanabilir
✓ Toplam ${kcal} kcal'yi öğünlere dengeli dağıt

FORMAT (kesinlikle bu formatta yaz):
Öğün 1: Kahvaltı
- Menemen (2 yumurta, domates, biber)
- Beyaz peynir (50 gram)
- Tam buğday ekmeği (2 dilim)
- Çay

Öğün 2: Ara Öğün
- Elma (1 adet orta boy)
- Çiğ badem (10 adet)

Öğün 3: Öğle Yemeği
- Mercimek çorbası (1 kase)
- Izgara tavuk (120 gram)
- Bulgur pilavı (3 yemek kaşığı)
- Mevsim salatası

Öğün 4: Akşam Yemeği
- Zeytinyağlı taze fasulye (1 porsiyon)
- Yoğurt (1 kase)
- Ekmek (1 dilim)

ÖNEMLİ: Hiçbir açıklama yazma, sadece öğünleri listele. İngilizce kelime kullanma!`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 saniye timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'HEALFLOW Menu Generator'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1200
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API Error:', response.status, errorData)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    // Parse AI response
    const menu = []
    const mealSections = content.split(/Öğün \d+:/i).filter(s => s.trim())
    
    mealSections.forEach((section, idx) => {
      const lines = section.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim())
      if (lines.length > 0) {
        menu.push({
          meal_no: idx + 1,
          items: lines.join(' • ')
        })
      }
    })

    return menu.length > 0 ? menu : fallbackMenu(profile, meals, macros, forbidden)
  } catch (error) {
    console.error('AI menu generation failed:', error.message || error)
    // Network veya timeout hatası varsa fallback kullan
    return fallbackMenu(profile, meals, macros, forbidden)
  }
}

// Fallback: AI başarısız olursa eski yöntem
function fallbackMenu(profile, meals, macros, forbidden) {
  const bread_ex = Math.max(1, Math.round(macros.carbs_g/15))
  const meat_ex = Math.max(0, Math.round(macros.protein_g/6))
  const fat_ex = Math.max(0, Math.round(macros.fat_g/5))

  const menu = []
  for(let i=0;i<meals;i++){
    const items = []
    for(let b=0;b<Math.max(1, Math.floor(bread_ex/meals)); b++) items.push(pick(FOOD_POOLS.bread_group, forbidden))
    for(let m=0;m<Math.floor(meat_ex/meals); m++) items.push(pick(FOOD_POOLS.meat_group, forbidden))
    for(let v=0; v<1; v++) items.push(pick(FOOD_POOLS.veg_group, forbidden))
    if(i<2) items.push(pick(FOOD_POOLS.fruit_group, forbidden))
    for(let f=0; f<Math.floor(fat_ex/meals); f++) items.push(pick(FOOD_POOLS.fat_group, forbidden))
    menu.push({meal_no: i+1, items: items.join(' ; ')})
  }
  return menu
}
