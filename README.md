# 🛡️ Suraksha — Smart Tourist Safety & Incident Response System

**Suraksha** is an AI-powered, geo-fencing–based tourist safety platform designed to enhance security, monitoring, and rapid emergency response for travelers.  
Built with a **monolithic architecture** using **React + Node.js + Express + TypeScript + Prisma + PostgreSQL**, it provides real-time monitoring, AI-based anomaly detection, and seamless communication between tourists and authorities.

---

## 🚀 Features

### 🧭 Tourist Platform
- **Digital Tourist ID Generation** — Aadhaar/Passport-based KYC, trip itinerary & emergency contact linking  
- **Geo-Fencing Alerts** — Detects entry into high-risk or restricted areas  
- **Safety Score System** — Dynamically rates tourists’ safety based on travel behavior  
- **SOS / Panic Button** — Instantly sends location to nearest police unit and emergency contacts  
- **Real-Time Location Tracking** *(opt-in)* for family or law enforcement visibility  

### 🧠 AI & Analytics
- **Anomaly Detection** — Detects unusual inactivity, route deviation, or distress patterns  
- **Predictive Alerts** — ML-based predictions of risk zones based on crowd and incident data  

### 🖥️ Department Dashboard
- **Live Tourist Map** — Heatmaps & cluster views of tourist density  
- **Alert Logs** — Tracks all SOS incidents and status updates  
- **E-FIR Generation** — Auto-generates preliminary reports for missing persons  

### ⚙️ IoT Integration (Optional)
- Integration with **smart bands/tags** for tourists in sensitive zones (forests, caves)  
- Monitors health and sends **continuous location + SOS triggers**

### 🔒 Security & Privacy
- End-to-end encrypted communication  
- JWT authentication & role-based access  
- GDPR-compliant data handling  
- Blockchain-ready for tamper-proof ID & travel records *(future scope)*

---

## 🧱 Architecture Overview

**Monolithic TypeScript Setup**

```

Suraksha/
├── client/        # React (Vite + TypeScript)
│   ├── src/
│   └── package.json
├── server/        # Node.js + Express + Prisma
│   ├── src/
│   ├── prisma/
│   └── package.json
├── pnpm-workspace.yaml
└── package.json   # Root workspace

````

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React 18 (Vite + TypeScript) |
| Backend | Node.js + Express (TypeScript) |
| ORM | Prisma |
| Database | PostgreSQL |
| Real-time | Socket.io |
| Auth | JWT |
| DevOps | Docker, pnpm, concurrently |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rohit83r/Suraksha.git
cd Suraksha
````

### 2️⃣ Install Dependencies

```bash
pnpm install
```

### 3️⃣ Setup Environment Variables

**server/.env**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/suraksha?schema=public"
PORT=4000
JWT_SECRET=supersecret
```

### 4️⃣ Initialize Prisma & Database

```bash
cd server
pnpm exec prisma migrate dev --name init
cd ..
```

### 5️⃣ Run the App

Run both backend and frontend together:

```bash
pnpm dev
```

* 🌐 Frontend → [http://localhost:5173](http://localhost:5173)
* ⚙️ Backend → [http://localhost:4000](http://localhost:4000)

---

## 🧩 Example API Endpoints

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| `POST` | `/api/v1/register` | Register a new tourist |
| `POST` | `/api/v1/login`    | Authenticate tourist   |
| `GET`  | `/api/v1/alerts`   | Fetch recent alerts    |
| `POST` | `/api/v1/sos`      | Trigger SOS alert      |

---

## 🧠 Future Enhancements

* 🛰️ Integrate ML model for real-time anomaly prediction
* 🪪 Blockchain-backed tourist ID verification
* 🧬 AI chatbot for travel safety queries
* 🌍 Multi-language voice SOS commands
* 📱 Native mobile app (React Native + Expo)

---

## 🪪 License

This project is licensed under the **MIT License**.
Feel free to fork, enhance, and use responsibly for public safety innovations.

---
> *“Technology isn’t just about innovation — it’s about protection, empathy, and trust.”*
> — **Suraksha** 🌍
```
