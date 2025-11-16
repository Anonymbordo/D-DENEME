"""Calculators for BMI, BMR (Mifflin & Schofield), PAL, TEH and macro conversions."""
from typing import Tuple
from math import isfinite

def bmi(weight_kg: float, height_cm: float) -> float:
    h_m = height_cm / 100.0
    if h_m <= 0:
        raise ValueError("Height must be positive")
    return weight_kg / (h_m * h_m)

def bmi_category(bmi_value: float) -> str:
    if bmi_value < 18.5:
        return "underweight"
    if bmi_value < 25.0:
        return "normal"
    if bmi_value < 30.0:
        return "overweight"
    if bmi_value < 35.0:
        return "obesity_class_1"
    if bmi_value < 40.0:
        return "obesity_class_2"
    return "obesity_class_3"

def bmr_mifflin(weight_kg: float, height_cm: float, age: int, sex: str) -> float:
    sex = sex.lower()
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    if sex in ("male", "m"):
        return base + 5
    return base - 161

def bmr_schofield(weight_kg: float, age: int, sex: str) -> float:
    sex = sex.lower()
    if sex in ("male", "m"):
        if 15 <= age < 18:
            return 17.6 * weight_kg + 656
        if 18 <= age < 30:
            return 15.0 * weight_kg + 690
        if 30 <= age < 60:
            return 11.4 * weight_kg + 870
        return 11.7 * weight_kg + 585
    else:
        if 15 <= age < 18:
            return 13.3 * weight_kg + 690
        if 18 <= age < 30:
            return 14.8 * weight_kg + 485
        if 30 <= age < 60:
            return 8.1 * weight_kg + 842
        return 9.0 * weight_kg + 656

def select_pal(pal_label: str) -> float:
    pal_label = pal_label.lower()
    if pal_label.startswith("light") or pal_label == "light":
        # default to the midpoint
        return (1.40 + 1.69) / 2.0
    if pal_label.startswith("moderate") or pal_label == "moderate":
        return (1.70 + 1.99) / 2.0
    if pal_label.startswith("heavy") or pal_label == "heavy":
        return (2.00 + 2.40) / 2.0
    # allow numeric strings
    try:
        val = float(pal_label)
        if isfinite(val):
            return val
    except Exception:
        pass
    raise ValueError(f"Unknown PAL label/value: {pal_label}")

def teh(bmr: float, pal: float) -> float:
    return bmr * pal

def energy_requirements(teh_kcal: float, bmi_value: float) -> Tuple[float, float, float]:
    """Return (maintenance, -500, -750) energy needs but enforce rules:
    - If underweight (BMI<18.5) do not provide energy deficits (no -500/-750)
    - If obese (BMI>=30) do not provide energy surplus (not applicable here, but keep rules for completeness)
    """
    maintenance = max(0, teh_kcal)
    # default reductions for weight loss candidates
    deficit_500 = maintenance - 500
    deficit_750 = maintenance - 750
    if bmi_value < 18.5:
        # do not allow negative adjustments that further reduce energy
        return (maintenance, maintenance, maintenance)
    # if obese, we still allow deficits; avoid surplus increases if implemented
    return (maintenance, max(0, deficit_500), max(0, deficit_750))

def macro_distribution(kcal: float, carb_pct: float = 0.55, fat_pct: float = 0.30, protein_pct: float = 0.15) -> dict:
    """Return macro gram targets given kcal and percent splits. Defaults to 55/30/15.
    Carbs & protein: 4 kcal/g; Fat: 9 kcal/g
    Also include recommended saturated/MUFA/PUFA contributions as kcal and grams (approximate percentages).
    """
    carbs_kcal = kcal * carb_pct
    fat_kcal = kcal * fat_pct
    protein_kcal = kcal * protein_pct
    carbs_g = carbs_kcal / 4.0
    protein_g = protein_kcal / 4.0
    fat_g = fat_kcal / 9.0
    # fats breakdown (percent of total energy)
    sat_kcal = kcal * 0.07
    mufa_kcal = kcal * 0.12
    pufa_kcal = kcal * 0.07
    sat_g = sat_kcal / 9.0
    mufa_g = mufa_kcal / 9.0
    pufa_g = pufa_kcal / 9.0
    water_ml = int(round(kcal))  # 1 ml per kcal
    return {
        "kcal": kcal,
        "carbs_g": round(carbs_g, 1),
        "fat_g": round(fat_g, 1),
        "protein_g": round(protein_g, 1),
        "sat_g": round(sat_g, 1),
        "mufa_g": round(mufa_g, 1),
        "pufa_g": round(pufa_g, 1),
        "water_ml": water_ml,
    }

if __name__ == "__main__":
    # quick smoke test
    w, h, age, sex = 70, 175, 30, "male"
    b = bmi(w, h)
    print("BMI:", b, bmi_category(b))
    bmr = bmr_mifflin(w, h, age, sex)
    print("BMR (Mifflin):", bmr)
    pal = select_pal("moderate")
    print("PAL:", pal)
    t = teh(bmr, pal)
    print("TEH:", t)
    print("Energy reqs:", energy_requirements(t, b))
    print("Macros:", macro_distribution(t))
