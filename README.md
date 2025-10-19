# Lehigh Valley Hackathon 2025

## NourishLU – Full-Stack Dining & Nutrition Assistant

### Overview
**NourishLU** is a web application that helps Lehigh University students make smarter on-campus dining choices.  
It integrates meal data, nutrition analytics, and AI-driven recommendations to support students with diverse dietary goals.

Built with a **React + Vite** frontend, **Node.js + Express** backend, **PostgreSQL (AWS RDS)** database, and **Groq LLM integration**, the system combines usability, performance, and real-time intelligence.

---

## 1. Frontend – NourishLU Web Client

### Overview
The frontend is developed in **React (Vite)** for rapid rendering and modular component management.  
It provides interactive features for:
- Selecting dietary goals
- Viewing personalized meal recommendations
- Chatting with the AI nutrition assistant
- Displaying dynamic nutrition visualizations

Frontend communicates with backend REST APIs over HTTP (port 5173 → 3000).

---

### Running Locally
cd frontend  
npm install  
npm run dev  

Open in your browser at **http://localhost:5173**

> The frontend automatically connects to the backend API on **http://localhost:3000**.

---

### Building for Production
npm run build  

The optimized output is generated in the **dist/** folder.  
It can be served via **Nginx** or any static file host.

---

## 2. Backend – NourishLU API

### Overview
The backend powers all application logic, including:
- Meal recommendation engine
- Nutrition calculation (BMR + TDEE)
- Chatbot responses through Groq LLMs
- Database integration with PostgreSQL (AWS RDS)

It is implemented in **Node.js (Express)** and listens on port **3000**.

---

### Running Locally
cd backend  
npm install  
cp .env.example .env  
npm run dev  

Verify database connection:  
http://localhost:3000/api/db-test

---

### Environment Variables
Required `.env` fields:  
PORT=  
DB_HOST=  
DB_USER=  
DB_PASS=  
DB_NAME=  
DB_PORT=  
GROQ_API_KEY=  
LLM_MODEL=  

> The `.env` file is excluded from version control for security.

---

### API Endpoints
| Endpoint | Method | Description |
|-----------|---------|-------------|
| /api/health | GET | Verify service status |
| /api/db-test | GET | Confirm database connectivity |
| /api/chat | POST | AI chatbot (Groq API) |
| /api/calculate-nutrition | POST | Nutrition goal computation |
| /api/recommend-meals | POST | Dynamic meal recommendation engine |

---

## 3. Deployment & Infrastructure

### Overview
The full application stack runs on **Amazon EC2 (Amazon Linux 2023)** with a private **AWS RDS Aurora PostgreSQL** instance.  
The architecture ensures secure, low-latency communication between backend and database within the same VPC.

**Traffic Flow:**  
Frontend → Nginx (80/443) → Node.js Backend (3000) → PostgreSQL (5432)

---

### Deployment Process
ssh -i "<key.pem>" ec2-user@<server-address>  
git pull origin main  
./deploy_backend.sh  

`deploy_backend.sh` automates pulling the latest code, installing dependencies, rebuilding the frontend, and restarting the backend service.

---

### Nginx Configuration
- Frontend served from /var/www/nourishlu  
- Backend proxied to http://127.0.0.1:3000  
- SSL managed via **Let’s Encrypt (Certbot)**  
- All HTTP requests redirect to HTTPS

---

### Security & Access Control
- `.env`, `.pem`, and build directories are excluded via `.gitignore`  
- HTTPS enforced through SSL certificates  
- RDS accessible only within the EC2 VPC and approved IP addresses

---

## 4. Technical Summary
| Layer | Technology | Responsibilities |
|--------|-------------|------------------|
| **Frontend** | React (Vite), Recharts | User interface, chatbot, and visualization |
| **Backend** | Node.js (Express) | API endpoints, logic, and AI integration |
| **Database** | AWS RDS PostgreSQL | Structured meal and nutrition data |
| **AI Model** | Groq API (LLaMA-3.1) | Natural-language meal recommendations |
| **Deployment** | EC2 + Dokku + Nginx | Hosting, SSL, and CI automation |

---

### Summary Statement
NourishLU is a full-stack, production-ready prototype demonstrating:  
- Real-time AI-powered dietary recommendations  
- Campus-specific data integration  
- Scalable AWS deployment with secure infrastructure  
- Clean and maintainable architecture for future expansion

---

### Optional Enhancements (Future Work)
- User preference persistence (no authentication required) 
- Real-time dining hall menu scraping from Lehigh Dining API
- Mobile-responsive companion app
- Enhanced AI meal reasoning (nutrition + cost trade-offs)