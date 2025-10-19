# Lehigh Valley Hackathon 2025  

## Frontend – NourishLU Web Client  

### Overview  
The frontend is a React application built with **Vite**. It provides the user interface for NourishLU, allowing users to explore on-campus dining options, view nutrition data, and connect with custom diet or fitness plans.  

It communicates with the backend API via HTTP requests to the deployed server on AWS EC2.  

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
To prepare the frontend for deployment:  
**npm run build**  

This generates a **dist/** folder containing static assets that can later be served through the backend or a hosting service such as AWS Amplify or S3.  

---  

## Backend – NourishLU API  

### Overview  
The backend powers all data and logic for NourishLU.  
It is built with **Node.js** and **Express**, connects to a **PostgreSQL** database hosted on **AWS RDS (Aurora PostgreSQL)**, and is deployed on an **EC2 instance**.  

---  

### Running Locally  
1. Navigate to the backend folder  
   **cd backend**  

2. Install dependencies  
   **npm install**  

3. Start in production mode  
   **npm run start**  

4. Start in development mode (auto-restarts on file save)  
   **npm run dev**  

---  

### Environment Setup  
Create a **.env** file inside the backend folder using **.env.example** as a template.  

The file should include variables such as:  
`PORT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, and `DB_PORT`.  

Never commit `.env` files or AWS credentials.  
The `.env.example` file is safe to share as a reference.  

---  

### Process Management with PM2  
The backend on EC2 runs continuously using **PM2**, a production process manager for Node.js.  

PM2 keeps the backend online, restarts it automatically on failure, and ensures it restarts after server reboots.  

**Common PM2 Commands**  
- `pm2 list` → View running applications  
- `pm2 logs nourishlu-backend` → View logs  
- `pm2 restart nourishlu-backend` → Restart after updates  
- `pm2 save` → Save the current process list for reboot  
- `pm2 startup` → Register PM2 to start automatically on boot  

---  

### Security Notes  
- `.env`, `.pem` keys, and build artifacts are ignored via `.gitignore`.  
- Never upload credentials, database passwords, or SSH keys to GitHub.  
- The database is only accessible to approved IP addresses and the EC2 instance.  
- Always confirm firewall and security group settings before deployment.  

---  

## Web Hosting and Database Integration on AWS EC2  

### Overview  
The backend is hosted on an **Amazon EC2 instance** running **Amazon Linux 2023**.  
It connects to an **AWS RDS Aurora PostgreSQL** database within the same VPC.  

**Traffic Flow:**  
Frontend → EC2 backend (port 3000) → RDS database (port 5432)  

---  

### Accessing the EC2 Instance  
1. Download your SSH key-pair (**ws-default-keypair.pem**) from the AWS Hackathon portal.  
2. Connect using PowerShell or terminal:  
   **ssh -i "C:\Users\<YourName>\Downloads\ws-default-keypair.pem" ec2-user@54.146.231.84**  
3. Once connected, navigate to the backend directory:  
   **cd ~/lvhackathon25/backend**  
4. Pull latest changes and restart:  
   **git pull origin main**  
   **pm2 restart nourishlu-backend**  

---  

### Deployment Workflow  
1. Develop and test locally on ports 5173 (frontend) and 3000 (backend).  
2. Push updates to GitHub.  
3. SSH into the EC2 instance.  
4. Pull changes from the main branch.  
5. Restart the backend using PM2.  
6. Verify connection to the database via `/api/db-test`.  

---  

### Connecting to the Database  
The backend uses environment variables to connect to the Aurora PostgreSQL cluster.  
Only the EC2 instance and approved developer IP addresses can access the RDS cluster.  

To allow a new developer to connect for local testing:  
Add their public IP to the RDS inbound rules under:  
**Type:** PostgreSQL **Port:** 5432 **Source:** `<their_public_IP>/32`  

> Avoid opening the database to all traffic (`0.0.0.0/0`). Always use restrictive access rules.  

---  

### Live Backend Access  
The deployed backend is available at:  
**http://54.146.231.84:3000**  

API endpoints can be tested via routes such as:  
**http://54.146.231.84:3000/api/db-test**  

---  

### Summary  
- Frontend and backend run separately during development but integrate via API calls.  
- Production backend is managed by **PM2** for reliability and automatic restarts.  
- The EC2 instance connects securely to the AWS RDS database using environment variables.  
- Sensitive data is protected through environment files and AWS network security configurations.  

## Deployment on AWS EC2

- Hosted at: https://nourishlu.duckdns.org
- Backend: Node.js + Express (port 3000, proxied via Nginx)
- Frontend: React (Vite build, served from /var/www/nourishlu)
- SSL: Let's Encrypt (certbot)
- Deployment script: /usr/local/bin/deploy_backend.sh
