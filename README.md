# Lehigh Valley Hackathon 2025

## Backend – NourishLU

### Overview
This backend powers the NourishLU application, a project for Lehigh Valley Hackathon 2025.  
It is built with Node.js and Express, connects to a PostgreSQL database hosted on AWS RDS, and is currently deployed on an EC2 instance.

---

### Running Locally

1. Navigate to the backend folder  
       cd backend

2. Install dependencies  
       npm install

3. Start in production mode  
       npm run start

4. Start in development mode (auto-restarts on file save)  
       npm run dev

---

### Environment Setup
Create a .env file inside the backend folder using .env.example as a template.

Never commit .env files or AWS credentials.  
The .env.example file is safe to share as a reference.

---

### Security Notes
- .env, .pem keys, and build artifacts (*.zip) are ignored via .gitignore.  
- Do not upload credentials or private keys to GitHub or Elastic Beanstalk.  
- Use environment variables securely on AWS EC2 or RDS.

---

### SSH into EC2 Instance

To connect to the live backend server:

1. Download your SSH key-pair (ws-default-keypair.pem) from the AWS Hackathon portal.  
2. Connect using PowerShell:  
       ssh -i "C:\Users\<YourName>\Downloads\ws-default-keypair.pem" ec2-user@54.146.231.84  
3. Once connected, set up the environment:  
       sudo dnf update -y  
       sudo dnf install -y git nodejs npm  
       git clone <repository-url>  
       cd backend  
       npm install  
       nano .env  
       node server.js  
4. Visit in a browser:  
       http://54.146.231.84:3000