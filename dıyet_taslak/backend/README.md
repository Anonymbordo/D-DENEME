# Backend data generator and calculators

This folder contains utilities to compute BMI, BMR (Mifflin-St Jeor and Schofield), PAL, TEH, macro distributions, exchange definitions and a simple dataset/menu generator for prototype/demo use.

Files:
- `calculators.py`: BMI, BMR, PAL, TEH and macro conversion functions.
- `nutrition_constants.py`: exchange values and small food lists used by generator.
- `data_generator.py`: sample user generator and menu/export functions that produce `sample_menus.csv`.
- `requirements.txt`: Python dependencies.

Quick start (from `backend/`):
```powershell
python -m pip install -r requirements.txt
python data_generator.py --out sample_menus.csv
```

The scripts are intentionally simple and intended as a starting point to integrate into the main backend API and to be adapted for real datasets and clinical rules.