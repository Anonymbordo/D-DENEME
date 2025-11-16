export function bmi(weight_kg, height_cm){
  const h = height_cm/100.0
  return +(weight_kg/(h*h)).toFixed(2)
}

export function bmi_category(b){
  if(b<18.5) return 'underweight'
  if(b<25) return 'normal'
  if(b<30) return 'overweight'
  if(b<35) return 'obesity_class_1'
  if(b<40) return 'obesity_class_2'
  return 'obesity_class_3'
}

export function bmr_mifflin(weight, height, age, sex){
  const base = 10*weight + 6.25*height - 5*age
  return sex==='male' ? Math.round(base+5) : Math.round(base-161)
}

export function select_pal(label){
  label = (''+label).toLowerCase()
  if(label.startsWith('light')) return (1.40+1.69)/2
  if(label.startsWith('moderate')) return (1.70+1.99)/2
  if(label.startsWith('heavy')) return (2.00+2.40)/2
  const n = parseFloat(label)
  if(!isNaN(n)) return n
  return (1.7)
}

export function teh(bmr, pal){
  return Math.round(bmr*pal)
}

export function energy_requirements(teh_kcal, bmi_value){
  const maintenance = Math.max(0, teh_kcal)
  const d500 = Math.max(0, maintenance-500)
  const d750 = Math.max(0, maintenance-750)
  if(bmi_value<18.5) return {maintenance, d500: maintenance, d750: maintenance}
  return {maintenance, d500, d750}
}

export function macro_distribution(kcal, carb_pct=0.55, fat_pct=0.30, protein_pct=0.15){
  const carbs_kcal = kcal*carb_pct
  const fat_kcal = kcal*fat_pct
  const protein_kcal = kcal*protein_pct
  return {
    kcal,
    carbs_g: +(carbs_kcal/4).toFixed(1),
    protein_g: +(protein_kcal/4).toFixed(1),
    fat_g: +(fat_kcal/9).toFixed(1),
  }
}

export function calcAll({weight, height, age, sex, pal}){
  const b = bmi(weight, height)
  const cat = bmi_category(b)
  const bmr = bmr_mifflin(weight, height, age, sex)
  const p = select_pal(pal)
  const t = teh(bmr, p)
  const reqs = energy_requirements(t, b)
  const chosen = b>=25 ? reqs.d500 : reqs.maintenance
  const macros = macro_distribution(chosen)
  return {bmi: b, bmi_category: cat, bmr, pal: p, teh: t, energy_plan_kcal: chosen, macros}
}
