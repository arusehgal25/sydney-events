# Sydney Event Discovery Platform

A full-stack modern web application that automatically scrapes events from public event websites in Sydney, Australia. It displays these events in a highly bespoke, modern UI, automatically categorizes them, and includes an Admin Dashboard built with Google OAuth.

## 🌟 Features

*   **Automated Web Scraping**: Utilizes `Puppeteer` to bypass detection and scrape Eventbrite for the latest events in Sydney.
*   **Intelligent Deduplication**: Implements a SHA-256 `dataHash` check when ingesting events. The system automatically tags events as `new`, `updated`, or `inactive`.
*   **Bespoke Glassmorphic UI**: Beautiful, interactive Event Cards built with vanilla CSS without relying on generic component libraries. 
*   **Lead Capture Pipeline**: "Get Tickets" popup intercepts user intent, safely capturing email and consent using a MongoDB-backed API before redirecting to the official ticketing source.
*   **Admin Dashboard**: Protected by Google OAuth 2.0 and Passport.js.
*   **Background Workers**: Queue management via `BullMQ` + `Redis` ensures scraper resilience, allowing the scraping tasks to run gracefully every 6 hours without blocking the main API thread.

## 🛠 Tech Stack

*   **Frontend**: React 18, Vite, Zustand (State), React Router, Vanilla CSS Modules.
*   **Backend**: Node.js, Express, Mongoose, Passport.js, BullMQ, Puppeteer.
*   **Database**: MongoDB (Local or Atlas).
*   **Cache / Queue**: Redis (Used by BullMQ).

## 🚀 Running Locally

Ensure you have Node.js, MongoDB (`localhost:27017`), and Redis (`localhost:6379`) running.

### 1. Start the Backend API & Scraping Queue
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```

You can now visit the live application at `http://localhost:5173`.

## ☁️ Deployment Strategy (Option 2)

This repository is pre-configured to automatically deploy using industry-standard platforms for the MERN stack.

### Frontend Deployment (Vercel)
The `frontend/vercel.json` ensures React Router SPAs gracefully fallback on correct URLs. 
1. Connect this repo to Vercel.
2. Set the *Root Directory* to `frontend/`.
3. Add the `VITE_API_URL` environment variable pointing to your backend.
4. Deploy.

### Backend Deployment (Render)
The `backend/render.yaml` Blueprint automatically provisions a Web Service API alongside an isolated Background Worker purely for running the BullMQ cron jobs.
1. Create a free MongoDB Atlas cluster and grab the connection URL.
2. In Render, select **New -> Blueprint**.
3. Select this repository.
4. Supply your `MONGO_URI` to connect both your Web and Worker environments to the same data store.

## 🧠 AI Recommendation MVP Architecture

While the foundation is fully MERN and automation-focused, the architectural roadmap supports an AI Recommendation loop:
1. **Extraction**: Utilize `LangChain` to evaluate user chat behavior (WhatsApp/Telegram).
2. **Vector DB**: Pinecone embeds and stores event descriptions upon every scrape run.
3. **Synthesis**: Low-latency inference via Mistral-7B API detects if a *new* event strongly matches a user's vectorized preferences and triggers an alert.

---
*Developed as a full-stack automated MERN discovery engine.*
