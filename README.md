# Assetra Monorepo

Welcome to the Assetra monorepo. This repository contains the foundational structure for the web application, split into the backend, frontend, and AI service as defined in the master project prompt.

## Directory Structure
- `backend/`: Node.js, Express, Prisma (SQLite). Contains auth logic, API endpoints, and business engines.
- `frontend/`: React/Vite client application using Tailwind CSS for premium UI.
- `ai-service/`: Stubs and prompts for the OCR parsing and grounded RAG models.

## Getting Started

### 1. Backend
```bash
cd backend
npm install
# Ensure .env is set with DATABASE_URL, PORT, JWT_SECRET, JWT_REFRESH_SECRET
npx prisma generate
npx prisma db push
node seeds/seedData.js # Seed the demo data
npm run dev # Or node server.js
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

The application relies on HTTP-only cookies for token refresh. Ensure the client operates on the expected `CLIENT_URL` (usually `http://localhost:5173`).

## Key Features Implemented
- **Dual-Token JWT Auth**: Short lived tokens and 7-day refresh tokens stored securely as HTTP-only cookies.
- **Upload Pipeline**: Multer middleware ready for receipt ingestion in `/api/documents/upload`.
- **RAG Chat Stub**: `/api/chat/query` endpoint with contextual asset extraction logic.
- **Impact Engine**: Calculates "Purchase Advantage", "Money Saved", and "Protected Value" across tracked assets.
