# StockFlow UI 

This repository contains the Node.js frontend dashboard and authentication service for the StockFlow application. It is designed to work in tandem with the `autoData` FastAPI ML backend.

## 🏗 Architecture (Two-Repo Setup)

We utilize a decoupled architecture to separate UI/Authentication from heavy ML model inference.

1. **Frontend (This Repo):** A Node.js custom HTTP server handling static file serving, user authentication (sessions), and API route proxying.
2. **Backend (`autoData` Repo):** A Python/FastAPI service hosting the machine learning models for Indian Market stock predictions.

**How they blend:** The frontend does not execute ML logic. Instead, the Node.js server exposes an endpoint (`/api/ml/predict`). When the UI hits this endpoint, `server.js` proxies the payload directly to the FastAPI server running on port `8000`, bypassing CORS issues and keeping the ML backend entirely hidden from the public internet.

## 🚀 How to Run Locally

You must run both repositories simultaneously.

### Terminal 1: Start the ML Backend (`autoData`)
Navigate to your backend repository directory:
\`\`\`bash
cd ../autoData
# Activate virtual environment if you have one
python -m uvicorn app.main:app --port 8000 --reload
\`\`\`

### Terminal 2: Start the Frontend UI (This Repo)
Navigate to this repository:
\`\`\`bash
cd dashboard-ui
npm install
npm run dev
\`\`\`

## 📁 Folder Structure
\`\`\`text
dashboard-ui/
├── data/
│   └── users.json         # Local JSON db for auth
├── public/                # Static assets served to the client
│   ├── app.js             # Auth logic
│   ├── dashboard.css      # UI styling
│   ├── dashboard.html     # Dashboard view
│   ├── dashboard.js       # Dashboard logic & ML API calls
│   ├── index.html         # Login/Register view
│   └── styles.css         # Auth styling
├── .env                   # Configuration (Backend URL)
├── .gitignore
├── package.json
└── server.js              # Node.js server & proxy logic
\`\`\`