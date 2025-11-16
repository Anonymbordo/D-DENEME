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

export function generateMenuForProfile(profile){
  const comp = profile.computed || profile
  const kcal = comp.energy_plan_kcal || (profile.energy_plan_kcal)
  const meals = parseInt(profile.meals_per_day || 3, 10)
  const forbidden = (profile.allergies || '').split(',').map(s=>s.trim()).filter(Boolean)
  const macros = macro_distribution(kcal)
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
