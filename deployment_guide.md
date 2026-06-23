# 🚀 FoodLens AI — Deployment Guide

This guide describes how to deploy the **FoodLens AI** stack (FastAPI backend + React frontend) to production.

---

## 📦 Option 1: Docker Compose (Recommended for VMs/VPS)

If you are deploying to a Virtual Private Server (e.g., DigitalOcean, AWS EC2, Linode) that has Docker and Docker Compose installed:

### 1. Set Environment Variables
Create a `.env` file at the root of the project:

```bash
# The API key for Gemini 2.5 Flash
GEMINI_API_KEY=your_gemini_api_key_here

# The public URL where the FastAPI backend will be accessible
VITE_API_URL=http://your-server-ip:8000
```

### 2. Build and Start the Stack
Run the following command at the project root:

```bash
docker-compose up -d --build
```

* **Frontend** will be served at `http://your-server-ip:80` (port 80).
* **Backend API** will be accessible at `http://your-server-ip:8000`.

---

## ☁️ Option 2: Cloud PaaS Deployment (Render, Railway, etc.)

If you want to host the frontend and backend separately on cloud platform providers:

### 1. Deploy the Backend (FastAPI + Playwright)

Because the Zomato scraper relies on **Playwright** (Chromium), your backend hosting environment must support running headless Chromium.

#### Render Deployment Steps:
1. Create a new **Web Service** on Render and connect your GitHub repository.
2. Select the **Docker** runtime (do NOT select Python).
3. Under **Advanced Settings**, configure:
   * **Docker Build Context**: `.` (root)
   * **Dockerfile Path**: `Dockerfile.server`
4. Add the following **Environment Variables**:
   * `GEMINI_API_KEY`: Your Google Gemini API Key.
   * `PORT`: `8000`
5. Deploy. Render will automatically build the image using `Dockerfile.server` which pre-installs Python, Playwright dependencies, and Chromium.

---

### 2. Deploy the Frontend (React + Vite)

You can host the React static build on **Vercel**, **Netlify**, or **Render Static Sites**.

#### Vercel/Netlify Deployment Steps:
1. Create a new project and select your repository.
2. Set the **Root Directory** to `client/`.
3. Set the **Build Command** to: `npm run build`
4. Set the **Output Directory** to: `dist`
5. Configure the **Build Environment Variables**:
   * `VITE_API_URL`: The URL of your deployed Backend service (e.g., `https://foodlens-backend.onrender.com`).
6. Deploy.

---

## ⚙️ Environment Variables Summary

| Variable Name | Required By | Description | Example Value |
|---|---|---|---|
| `GEMINI_API_KEY` | Backend | Used to extract search intent and generate recommendations. | `AIzaSy...` |
| `VITE_API_URL` | Frontend | Used by the React app to communicate with the FastAPI backend. | `https://api.foodlens.com` |
