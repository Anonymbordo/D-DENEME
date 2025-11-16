# Frontend (Vite + React) prototype

Quick start (from `frontend/` folder):

```powershell
npm install
npm run dev
```

- The app stores profile and meal logs in `localStorage` for the prototype.
- `Profile` page computes BMI/BMR/TEH and picks an energy plan; `Recommendations` generates example menus client-side using exchange pools.
- Next steps: wire to backend API endpoints (e.g., `/api/generate`) and add authentication.
