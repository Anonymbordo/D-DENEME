"""Generate sample users and example menus using exchange lists and calculators.

This script is a prototype to create a dataset of personalized menus based on the rules
you provided (BMI, BMR via Mifflin/St-Jeor or Schofield, PAL->TEH, energy requirement adjustments,
macro splits, exchanges, and forbidden items/allergens).

Run: `python data_generator.py --out sample_menus.csv`
"""
import argparse
import random
import csv
from typing import List
import pandas as pd

from calculators import bmi, bmi_category, bmr_mifflin, bmr_schofield, select_pal, teh, energy_requirements, macro_distribution
from nutrition_constants import FOOD_POOLS, EXCHANGES, ALLERGENS


def pick_food(group: str, forbidden_allergens: List[str]) -> str:
    pool = FOOD_POOLS.get(group, [])
    if not pool:
        return group
    # naive allergen filtering by text (prototype only)
    candidates = [name for (name, _) in pool if not any(a in name.lower() for a in forbidden_allergens)]
    if not candidates:
        candidates = [name for (name, _) in pool]
    return random.choice(candidates)


def compose_daily_menu(energy_kcal: float, meals_per_day: int, forbidden_allergens: List[str]) -> List[dict]:
    # Compute macros
    macros = macro_distribution(energy_kcal)
    carbs_g = macros["carbs_g"]
    protein_g = macros["protein_g"]
    fat_g = macros["fat_g"]

    # Rough allocation across groups using exchange grams
    # Compute number of bread exchanges from carbs (bread has 15g carb)
    bread_ex = int(round(carbs_g / 15.0))
    meat_ex = int(round(protein_g / 6.0))
    milk_ex = int(round(carbs_g / 9.0 / 6.0)) if carbs_g > 0 else 0
    fat_ex = int(round(fat_g / 5.0))

    # Distribute exchanges across meals
    meals = []
    for i in range(meals_per_day):
        meal = {
            "meal_no": i + 1,
            "bread_ex": max(1, bread_ex // meals_per_day),
            "meat_ex": max(0, meat_ex // meals_per_day),
            "milk_ex": max(0, milk_ex // max(1, meals_per_day)),
            "veg_ex": 1,
            "fruit_ex": 1 if i < 2 else 0,
            "fat_ex": max(0, fat_ex // max(1, meals_per_day)),
        }
        # pick example foods
        meal_items = []
        for _ in range(meal["bread_ex"]):
            meal_items.append(pick_food("bread_group", forbidden_allergens))
        for _ in range(meal["meat_ex"]):
            meal_items.append(pick_food("meat_group", forbidden_allergens))
        for _ in range(meal["milk_ex"]):
            meal_items.append(pick_food("milk_group", forbidden_allergens))
        for _ in range(meal["veg_ex"]):
            meal_items.append(pick_food("veg_group", forbidden_allergens))
        for _ in range(meal["fruit_ex"]):
            meal_items.append(pick_food("fruit_group", forbidden_allergens))
        for _ in range(meal["fat_ex"]):
            meal_items.append(pick_food("fat_group", forbidden_allergens))
        meal["items"] = "; ".join(meal_items)
        meals.append(meal)
    return meals


def sample_users(n: int = 8):
    sexes = ["male", "female"]
    activity_choices = ["light", "moderate", "heavy"]
    users = []
    for i in range(n):
        age = random.randint(18, 65)
        sex = random.choice(sexes)
        weight = round(random.uniform(48, 110), 1)
        height = round(random.uniform(150, 190), 1)
        pal = random.choice(activity_choices)
        meals = random.choice([3, 4, 5])
        allergies = []
        # small chance of allergy
        if random.random() < 0.2:
            allergies = random.sample(ALLERGENS, k=1)
        users.append({
            "user_id": f"u{i+1}",
            "age": age,
            "sex": sex,
            "weight_kg": weight,
            "height_cm": height,
            "pal_label": pal,
            "meals_per_day": meals,
            "allergies": allergies,
        })
    return users


def generate_dataset(out_path: str, n_users: int = 8):
    users = sample_users(n_users)
    rows = []
    for u in users:
        b = bmi(u["weight_kg"], u["height_cm"])
        cat = bmi_category(b)
        # choose BMR method: use Mifflin for weight loss/normal/overweight per spec
        bmr = bmr_mifflin(u["weight_kg"], u["height_cm"], u["age"], u["sex"])
        pal = select_pal(u["pal_label"])
        total_teh = teh(bmr, pal)
        maintenance, minus500, minus750 = energy_requirements(total_teh, b)
        # pick the appropriate energy to use: if user is overweight/obese and wants weight loss, pick minus500
        # For prototype choose maintenance for normal, minus500 for overweight/obese
        if b >= 25.0:
            chosen_kcal = minus500
        else:
            chosen_kcal = maintenance

        menu = compose_daily_menu(chosen_kcal, u["meals_per_day"], [a for a in u["allergies"]])
        # flatten and write one row per meal
        for m in menu:
            rows.append({
                "user_id": u["user_id"],
                "age": u["age"],
                "sex": u["sex"],
                "weight_kg": u["weight_kg"],
                "height_cm": u["height_cm"],
                "bmi": round(b, 2),
                "bmi_category": cat,
                "bmr": round(bmr, 1),
                "pal": round(pal, 2),
                "teh": round(total_teh, 1),
                "energy_plan_kcal": round(chosen_kcal, 1),
                "meals_per_day": u["meals_per_day"],
                "meal_no": m["meal_no"],
                "menu_items": m["items"],
                "allergies": ",".join(u["allergies"]) if u["allergies"] else "",
            })

    df = pd.DataFrame(rows)
    df.to_csv(out_path, index=False)
    print(f"Wrote {len(df)} rows to {out_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="sample_menus.csv")
    parser.add_argument("--n", type=int, default=8)
    args = parser.parse_args()
    generate_dataset(args.out, args.n)
