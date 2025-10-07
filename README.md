# 🚀 CI/CD Pipeline Runner

A lightweight **CI/CD pipeline simulator** built from scratch — with a **React + Tailwind frontend** and **Node.js + Express + PostgreSQL backend**.  
It allows users to create and run pipelines, execute commands step-by-step, and view **real-time logs** like a real DevOps dashboard.

---

## 🏗️ Project Structure

```bash
CI-CD/
├── ci-cd-dashboard/                 # 🖥️ Frontend (React + Tailwind)
│   ├── node_modules/
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── components/
│   │   │   ├── PipelineForm.jsx
│   │   │   └── PipelineList.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
├── ci-cd-runner/                    # ⚙️ Backend (Node.js + Express + PostgreSQL)
│   ├── node_modules/
│   ├── db.js                        # Database connection (PostgreSQL)
│   ├── pipeline-runner.js           # Executes shell commands step-by-step
│   ├── server.js                    # Express + Socket.IO backend server
│   ├── package.json
│   └── package-lock.json
│
├── node_modules/
├── package.json
└── README.md
```

## ⚙️ Tech Stack
```
| **Layer**                         | **Technologies & Description**                                                                                                                                                                                  |
|---------------------------------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🖥️ **Frontend**                  | **React.js** for building dynamic single-page interfaces<br>**Tailwind CSS** for fast, utility-first styling<br>**Socket.IO Client** for real-time communication between UI and backend                         |
| ⚙️ **Backend**                   | **Node.js** (JavaScript runtime) + **Express.js** (REST API framework)<br>**Socket.IO Server** for WebSocket-based real-time updates<br>Handles pipeline execution, command streaming, and database integration |
| 🗄️ **Database**                  | **PostgreSQL** — stores pipeline metadata, execution logs, and step results<br>Integrated using `pg` Node driver and managed through **pgAdmin**                                                                |
| 🧰 **Build & Dev Tools**         | **Vite** (frontend build tool) for ultra-fast development server<br>**npm** for package management<br>**VS Code** as primary IDE                                                                                |
| 🔄 **Version Control**           | **Git & GitHub** — for source code management, commits, and collaboration                                                                                                                                       |
| ☁️ **Environment & Deployment ** | Works locally via `localhost` setup — can be easily extended to Docker, AWS EC2, or Render for production hosting                                                                                               |
```
---

📸 Preview
```
🚀 Pipeline 1759866357003 started (2 steps)...
▶️ Step 1: echo Hello
Hello
▶️ Step 2: dir
Volume in drive C is OS
 Volume Serial Number is A6EF-8EAF
 Directory of C:\Users\prana\OneDrive\Desktop\ci-cd\ci-cd-runner
05-10-2025  22:57    <DIR>          .
06-10-2025  04:57    <DIR>          ..
06-10-2025  00:20               746 db.js
06-10-2025  05:20    <DIR>          node_modules
06-10-2025  05:20            35,793 package-lock.json
06-10-2025  05:20               318 package.json
03-10-2025  20:20             1,008 pipeline-runner.js
08-10-2025  00:18             6,651 server.js
               5 File(s)         44,516 bytes
               3 Dir(s)   7,902,048,256 bytes free
✅ Pipeline 1759866357003 finished with status: success
```

###  Clone the repository
```bash
git clone https://github.com/PragtiKumari/CI-CD-pipeline-runner.git
cd CI-CD-pipeline-runner
```

1️⃣ Start the Backend (Node.js)
```
cd ci-cd-runner
npm install
node server.js
```

The backend starts on:

```http://localhost:3000```

2️⃣ Start the Frontend (React)

Open a new terminal:
```
cd ci-cd-dashboard
npm install
npm run dev
```

⚙️ The frontend runs on:
```http://localhost:5173```

## 🧠 Features

✅ Add and run pipelines with multiple shell commands
✅ Real-time logs via Socket.IO
✅ Persistent storage in PostgreSQL
✅ Minimal terminal-style dashboard
✅ Fetch and view historical run logs

---

# 🗄️ Database Schema (simplified)
Column	Type	Description
run_id	TEXT	Unique run identifier
status	TEXT	success / failed / running
total_steps	INT	Total number of steps
successful_steps	INT	Number of successful steps
failed_steps	INT	Number of failed steps
logs	JSONB	Step-wise log storage
created_at	TIMESTAMP	Execution timestamp

🧑‍💻 Developer Setup

You can modify db.js in the backend to match your local PostgreSQL credentials:
```
const pool = new Pool({
  user: "postgres",
  password: "Pragati@12",
  host: "localhost",
  port: 5432,
  database: "cicd_runner"
});
```
---

📜 License

This project is open source and available under the MIT License
.

👩‍💻 Author

Pragti Kumari
📍 Software Developer | CI/CD Enthusiast | React + Node.js + PostgreSQL
🔗 GitHub

---
