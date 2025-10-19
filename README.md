# Lehigh Valley Hackathon 2025

## NourishLU — Unified Full-Stack Dining & Nutrition Assistant

### Overview
**NourishLU** is a web application built for Lehigh University students to make smarter, personalized dining decisions.  
It combines real campus meal data, nutritional analytics, and AI-powered insights to help users meet dietary or fitness goals.

The unified build serves both the **React + Vite frontend** and the **Node.js + Express backend** from the same server (port **3000**), connected to an **AWS RDS PostgreSQL** database and enhanced by **Groq LLM integration** for conversational guidance.

---

## 1. Unified Architecture

### Stack Summary
| Layer | Technology | Description |
|--------|-------------|-------------|
| **Frontend** | React (Vite) | Interactive meal planner and AI chat interface |
| **Backend** | Node.js (Express) | REST APIs, AI logic, and unified static serving |
| **Database** | AWS RDS PostgreSQL | Persistent structured data for meals and user info |
| **AI Integration** | Groq API (LLaMA-3.1) | Natural-language reasoning and meal recommendations |
| **Deployment** | EC2 + Nginx + SSL | Single-port hosting with HTTPS and CI automation |

The app runs entirely from a single Express server:
Frontend static build → served from `/frontend/dist`  
API routes → `/api/...` (chat, nutrition, database access)

---

## 2. Running Locally

### Setup
cd backend  
npm install  
cp .env.example .env  

### Build and Start (Unified)
npm run build  
npm start  

This performs:
1. Frontend build (via Vite)
2. Backend startup (serving both static files and APIs)

Access in browser: **http://localhost:3000**

---

### Development Mode (optional)
For live editing, you can still run both separately:
- Frontend: `npm run dev` (port 5173)
- Backend: `npm run dev` (port 3000)

---

## 3. Environment Configuration

Create a `.env` file inside `/backend` with the following variables:

PORT=3000  
DB_HOST=  
DB_USER=  
DB_PASS=  
DB_NAME=  
DB_PORT=  
GROQ_API_KEY=  
LLM_MODEL=  

> `.env` is ignored by Git and should not be shared publicly.

---

## 4. API Reference

| Endpoint | Method | Description |
|-----------|---------|-------------|
| /api/health | GET | Backend health check |
| /api/db-test | GET | Test PostgreSQL connectivity |
| /api/chat | POST | Chatbot endpoint (Groq LLM) |
| /api/calculate-nutrition | POST | Compute BMR, TDEE, and macronutrients |
| /api/recommend-meals | POST | Recommend meals based on goals and data |

All endpoints are accessible at **http://localhost:3000** since the app is unified.

---

## 5. Deployment on EC2

### Server Architecture
Browser → Nginx (80/443) → Node.js Backend (3000) → PostgreSQL (5432)

### Steps
ssh -i "<key.pem>" ec2-user@<server-address>  
git pull origin main  
./deploy_backend.sh  

The deploy script:
- Pulls latest changes  
- Builds the frontend  
- Installs dependencies  
- Restarts the backend service  

---

## 6. Nginx & SSL Configuration

- Frontend served from `/var/www/nourishlu`
- Backend proxied internally to `http://127.0.0.1:3000`
- SSL certificates managed by **Let’s Encrypt (Certbot)**
- HTTP automatically redirects to HTTPS

---

## 7. Security and Access Control

- Environment secrets excluded via `.gitignore`
- HTTPS enforced through Nginx + Certbot
- RDS access restricted to EC2 VPC and approved IPs only
- No sensitive keys stored in repository

---

## 8. Summary

**NourishLU** is a production-ready full-stack application demonstrating:
- Unified single-port deployment  
- AI-powered, data-driven dietary recommendations  
- Real-time PostgreSQL integration  
- Scalable AWS infrastructure  
- Clean, modular architecture for maintainability and growth  

---

## 9. Future Enhancements
- Persistent user sessions (no login required)  
- Live dining hall menu scraping from Lehigh Dining API  
- Progressive Web App (PWA) mobile adaptation  
- Enhanced AI reasoning combining nutrition, budget, and taste metrics