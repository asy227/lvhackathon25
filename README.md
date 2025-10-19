# Lehigh Valley Hackathon 2025  

## Frontend – NourishLU Web Client  

### Overview  
The frontend is a React application built with **Vite**. It provides the user interface for **NourishLU**, allowing users to explore on-campus dining options, view nutrition data, and connect with custom diet or fitness plans.  

It communicates with the backend API via HTTP requests to the deployed server.  

---  

### Running Locally  
1. Navigate to the frontend directory  
   **cd frontend**  
2. Install dependencies  
   **npm install**  
3. Start the development server  
   **npm run dev**  
4. Visit the local site  
   **http://localhost:5173**  

> The frontend runs on port 5173 during development and communicates with the backend API on port 3000.  

---  

### Building for Production  
To build optimized static files for deployment:  
**npm run build**  

This generates a **dist/** folder containing static assets that can be served via **Nginx** or another hosting service.  

---  

## Backend – NourishLU API  

### Overview  
The backend handles all data and logic for NourishLU.  
It is built with **Node.js** and **Express**, connects to a **PostgreSQL** database hosted on **AWS RDS (Aurora PostgreSQL)**, and runs on an **Amazon EC2** instance.  

---  

### Running Locally  
To test and develop the backend on your local machine:  

1. Navigate to the backend directory  
   **cd backend**  

2. Install dependencies  
   **npm install**  

3. Create a local `.env` file using `.env.example` as a template.  
   Update the database credentials to point to your local or test database instance.  

4. Start the backend server in development mode (auto-reloads on file changes):  
   **npm run dev**  

5. Or start it in production mode:  
   **npm run start**  

6. Visit the API locally:  
   **http://localhost:3000/api/db-test**  

> Ensure your local database is running and matches the configuration in `.env`.  

---  

### Environment Setup  
Create a **.env** file inside the backend directory using **.env.example** as a guide.  
Include variables such as:  
`PORT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, and `DB_PORT`.  

Never commit `.env` files or any secrets to GitHub. The `.env.example` file can safely remain public for reference.  

---  

## Web Hosting and Deployment  

### Overview  
The full stack is deployed on an **Amazon EC2 instance** running **Amazon Linux 2023**.  
The EC2 instance connects securely to an **AWS RDS Aurora PostgreSQL** cluster within the same VPC.  

**Traffic Flow:**  
Frontend → Nginx (port 80/443) → Node.js backend (port 3000) → RDS database (port 5432)  

---  

### Accessing the Server  
1. Obtain your SSH key-pair from the project admin or AWS console.  
2. Connect using a secure terminal command (example syntax):  
   **ssh -i "<your-key.pem>" ec2-user@<server-address>**  
3. Navigate to the project:  
   **cd ~/lvhackathon25**  
4. Pull the latest updates and redeploy if needed:  
   **git pull origin main**  
   **deploy_backend.sh**  

---  

### Deployment Script  
A deployment script simplifies backend restarts and updates.  

**Location:** `/usr/local/bin/deploy_backend.sh`  

**Function:**  
- Installs dependencies  
- Stops existing Node.js processes  
- Restarts the backend in the background with logging  

This ensures consistent, quick redeployments during testing.  

---  

### Nginx Configuration  
Nginx acts as a reverse proxy and serves the frontend.  
- Frontend files are hosted in `/var/www/nourishlu`  
- Backend requests to `/api` are proxied to **http://127.0.0.1:3000**  
- SSL certificates are managed via **Let’s Encrypt (Certbot)**  
- HTTP traffic automatically redirects to HTTPS  

---  

### Database Integration  
The backend connects to the **AWS RDS Aurora PostgreSQL** instance using environment variables.  
Access is restricted to:  
- The EC2 instance  
- Approved developer IP addresses  

To grant new developer access, add their public IP in RDS inbound rules:  
**Type:** PostgreSQL **Port:** 5432 **Source:** `<developer_public_IP>/32`  

> Never allow global access (`0.0.0.0/0`). Keep inbound rules limited for security.  

---  

### Git Workflow  

**Repository:** Private GitHub repository for project collaboration  

**Workflow Summary:**  
1. Develop and test locally on ports 5173 (frontend) and 3000 (backend).  
2. Commit and push to the `main` branch on GitHub.  
3. SSH into the server and pull updates with:  
   **git pull origin main**  
4. Run the deploy script to restart the backend:  
   **deploy_backend.sh**  
5. Verify functionality through API endpoints.  

> On EC2, GitHub authentication uses Personal Access Tokens instead of passwords.  

---  

### Live Deployment  

**Frontend:** Hosted through Nginx (secured with SSL)  
**Backend (API):** Proxied through Nginx to Node.js  
**SSL Certificates:** Managed via Let’s Encrypt  
**Server Stack:**  
- Node.js v20+  
- Nginx 1.28+  
- Amazon Linux 2023  
- PostgreSQL (Aurora RDS)  

---  

### Security Notes  
- `.env`, `.pem`, and build artifacts are excluded via `.gitignore`.  
- Secrets and credentials are never committed to GitHub.  
- HTTPS ensures encrypted communication.  
- EC2 and RDS communicate within a private VPC network.  

---  

### Summary  
- **Frontend:** React + Vite served through Nginx  
- **Backend:** Node.js + Express connected to Aurora PostgreSQL  
- **Hosting:** Amazon EC2 with custom domain and SSL  
- **Deployment:** Automated via `/usr/local/bin/deploy_backend.sh`  
- **Version Control:** GitHub → EC2 sync via SSH and tokens  
