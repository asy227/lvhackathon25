# Lehigh Valley Hackathon 2025  

## NourishLU – Full Stack Dining & Nutrition Assistant  

### Overview  
**NourishLU** is a web-based application that helps Lehigh University students discover on-campus dining options, filter by dietary restrictions, and receive personalized meal recommendations through an AI chatbot.  

The system integrates a **React + Vite** frontend, a **Node.js + Express** backend, a **PostgreSQL (AWS RDS)** database, and an **AI model served via Groq API**.  

---

## Frontend – NourishLU Web Client  

### Overview  
The frontend is built with **React** and **Vite**, providing the interactive interface for browsing dining halls, meals, and chatbot recommendations.  
It communicates with the backend REST API over HTTP using fetch requests.  

---

### Running Locally  
1. Navigate to the frontend directory  
   **cd frontend**  
2. Install dependencies  
   **npm install**  
3. Start the development server  
   **npm run dev**  
4. Open in browser  
   **http://localhost:5173**  

> The frontend runs on port 5173 and communicates with the backend on port 3000.  

---

### Building for Production  
Run the following command to generate optimized static assets:  
**npm run build**  

The build output is stored in the **dist/** folder and can be hosted via **Nginx** or another web server.  

---

## Backend – NourishLU API  

### Overview  
The backend provides API endpoints, connects to a **PostgreSQL (AWS RDS)** database, and integrates with the **Groq API** for chatbot responses.  
It is written in **Node.js (Express)** and runs locally on port **3000**.  

---

### Running Locally  
1. Navigate to the backend directory  
   **cd backend**  
2. Install dependencies  
   **npm install**  
3. Copy the example environment file  
   **cp .env.example .env**  
4. Start the development server  
   **npm run dev**  
5. Test the database connection  
   **http://localhost:3000/api/db-test**  

---

### Environment Setup  
The backend requires a `.env` file with variables:  
`PORT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`, `GROQ_API_KEY`, `LLM_MODEL`.  

> `.env` is excluded from version control for security.  

---

### API Endpoints  
- **/api/health** – Service check  
- **/api/db-test** – Verify database connection  
- **/api/chat** – AI chatbot using Groq API  

---

## Deployment & Infrastructure  

### Overview  
The application is deployed on an **Amazon EC2** instance running **Amazon Linux 2023**, connected to an **AWS RDS Aurora PostgreSQL** cluster within the same VPC.  

**Traffic Flow:**  
Frontend → Nginx (port 80/443) → Node.js Backend (port 3000) → PostgreSQL (port 5432)  

---

### Deployment Process  
1. SSH into the EC2 instance:  
   **ssh -i "<key.pem>" ec2-user@<server-address>**  
2. Pull the latest changes:  
   **git pull origin main**  
3. Redeploy backend:  
   **deploy_backend.sh**  

---

### Nginx Configuration  
- Frontend served from `/var/www/nourishlu`  
- Backend requests proxied to **http://127.0.0.1:3000**  
- SSL managed with **Let’s Encrypt (Certbot)**  
- HTTP redirects to HTTPS  

---

### Security Notes  
- `.env`, `.pem`, and build files excluded via `.gitignore`  
- HTTPS encryption enabled  
- EC2 ↔ RDS connection restricted to private VPC and approved IPs  

---

### Summary  
- **Frontend:** React + Vite served through Nginx  
- **Backend:** Node.js + Express + Groq API chatbot  
- **Database:** AWS RDS Aurora PostgreSQL  
- **Hosting:** Amazon EC2 with SSL (Let’s Encrypt)  
- **Deployment:** Automated via `deploy_backend.sh`