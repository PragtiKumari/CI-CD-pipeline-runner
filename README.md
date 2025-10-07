# 🚀 CI/CD Pipeline Runner

A lightweight **CI/CD pipeline simulator** built from scratch — with a **React + Tailwind frontend** and **Node.js + Express + PostgreSQL backend**.  
It allows users to create and run pipelines, execute commands step-by-step, and view **real-time logs** like a real DevOps dashboard.

---

## 🏗️ Project Structure

ci-cd/
├── ci-cd-dashboard/ # 🖥️ Frontend (React + Tailwind)
│ ├── node_modules/
│ ├── src/
│ │ ├── api/
│ │ │ ├── api.js # Handles API calls to backend
│ │ │ └── socket.js # Manages Socket.IO connection
│ │ ├── components/
│ │ │ ├── PipelineForm.jsx # UI to add and run pipelines
│ │ │ └── PipelineList.jsx # Table to list pipeline history
│ │ ├── pages/
│ │ │ └── Dashboard.jsx # Main dashboard view
│ │ ├── App.jsx # Root React component
│ │ ├── index.css # Global styles (Tailwind)
│ │ └── main.jsx # React entry point
│ ├── index.html # Root HTML file for Vite
│ ├── package.json # Frontend dependencies
│ ├── package-lock.json
│ ├── postcss.config.js # PostCSS setup for Tailwind
│ └── tailwind.config.js # Tailwind configuration
│
├── ci-cd-runner/ # ⚙️ Backend (Node.js + Express + PostgreSQL)
│ ├── node_modules/
│ ├── db.js # PostgreSQL database connection
│ ├── pipeline-runner.js # Executes shell commands step-by-step
│ ├── server.js # Express + Socket.IO backend server
│ ├── package.json # Backend dependencies
│ └── package-lock.json
│
├── node_modules/ # Shared root modules (optional)
├── package.json # Root-level config if needed
└── README.md # Project documentation
