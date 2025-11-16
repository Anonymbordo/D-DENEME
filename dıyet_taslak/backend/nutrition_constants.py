"""Nutrition exchange constants and simple food pools for generating example menus."""

# Exchange definitions (per problem statement)
EXCHANGES = {
    "milk_group": {"kcal": 114, "carb_g": 9, "protein_g": 6, "fat_g": 6},
    "meat_group": {"kcal": 69, "protein_g": 6, "fat_g": 5},
    "bread_group": {"kcal": 68, "carb_g": 15, "protein_g": 2},
    "veg_group": {"kcal": 32, "carb_g": 6, "protein_g": 2},
    "fruit_group": {"kcal": 60, "carb_g": 15},
    "fat_group": {"kcal": 45, "fat_g": 5},
    "legume_group": {"kcal": 60, "carb_g": 15, "protein_g": 5},
}

# Example simple pools (replace with full food database later)
FOOD_POOLS = {
    "milk_group": [
        ("1 cup milk (200 ml)", "milk_group"),
        ("1 small yogurt (150 g)", "milk_group"),
        ("1 ayran (200 ml)", "milk_group"),
    ],
    "meat_group": [
        ("50 g chicken breast", "meat_group"),
        ("50 g fish", "meat_group"),
        ("1 boiled egg", "meat_group"),
    ],
    "bread_group": [
        ("1 slice bread", "bread_group"),
        ("1/2 cup cooked rice", "bread_group"),
        ("1 small bowl soup", "bread_group"),
    ],
    "veg_group": [
        ("1 serving cooked vegetable", "veg_group"),
        ("1 bowl salad", "veg_group"),
    ],
    "fruit_group": [
        ("1 medium apple", "fruit_group"),
        ("1 banana", "fruit_group"),
    ],
    "fat_group": [
        ("1 tsp olive oil", "fat_group"),
        ("1 tsp butter", "fat_group"),
    ],
    "legume_group": [
        ("2 tbsp cooked lentils", "legume_group"),
        ("2 tbsp cooked chickpeas", "legume_group"),
    ],
}

ALLERGENS = [
    "peanut", "tree_nuts", "shellfish", "molluscs", "fish", "egg", "milk", "gluten", "soy", "sesame", "celery", "mustard", "broad_bean", "sulfites"
]

PAL_RANGES = {
    "light": (1.40, 1.69),
    "moderate": (1.70, 1.99),
    "heavy": (2.00, 2.40),
}
