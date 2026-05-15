# dashboard-ui

React + Tailwind dashboard for the `autoData` FastAPI backend.

## Structure

```text
dashboard-ui/
├── public/
│   ├── manifest.json
│   └── legacy/              # Previous static UI preserved here
├── src/
│   ├── assets/global.css
│   ├── components/
│   │   ├── forms/PredictForm.jsx
│   │   ├── layout/Sidebar.jsx
│   │   ├── layout/Topbar.jsx
│   │   └── ui/
│   ├── context/AuthContext.jsx
│   ├── hooks/
│   ├── pages/
│   ├── services/apiClient.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Local Run

```bash
npm install
npm run dev
```

The app expects the backend API at:

```text
VITE_BACKEND_API_URL=http://localhost:8000/api
```

Update `.env` if your FastAPI server is on another host or port.

## Checks

```bash
npm run build
```

Legacy Node/static files were moved to `legacy-node/` and `public/legacy/` for reference.
