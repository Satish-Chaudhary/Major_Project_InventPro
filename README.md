# InventPro

InventPro is a premium inventory and project management application designed with a **Dark Luxury** aesthetic. It provides a comprehensive suite of tools for managing products, categories, suppliers, orders, and users with a focus on visual excellence and smooth user experience.

## 🎨 Design Philosophy

- **Theme**: Dark Luxury aesthetic (`#050505` background).
- **Core Colors**: Deep Black, Purple-600, Cyan-600.
- **Interactions**: Fluid animations powered by Framer Motion.
- **UI System**: Modern Glassmorphism with heavy backdrop blurs.

## 📁 Project Structure

```text
Major_Project_InventPro/
├── backend/            # Express.js Server
│   ├── config/         # Configuration files
│   ├── controllers/    # API Request handlers
│   ├── models/         # Database schemas
│   ├── routes/         # API Route definitions
│   └── server.js       # Entry point
├── frontend/           # React + Vite Client
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   ├── assets/     # Static assets
│   │   └── App.jsx     # Main application layout
│   └── package.json
└── WORKFLOW.md         # Detailed page connectivity & user flow
```

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit (Slices, RTK Query, Persist)
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **State/Routing**: React Router 7
- **Charts**: Recharts

### Backend
- **Framework**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Security**: JWT, Bcrypt, Cookie-based sessions
- **Architecture**: MVC (Model-View-Controller)
- **Environment**: Dotenv for configuration

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- MongoDB (Running instance or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Satish-Chaudhary/Major_Project_InventPro.git
   cd Major_Project_InventPro
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file with PORT, MONGO_URI, JWT_SECRET, EMAIL, EMAIL_PASS
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

- **Backend**: 
  ```bash
  cd backend
  npm start
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```

## 📄 Documentation

- [WORKFLOW.md](WORKFLOW.md) — Detailed page connectivity & user flow.
- [ROADMAP.md](ROADMAP.md) — Project phases and implementation tasks.
- [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md) — Final deployment and feature status.
- [inventory-system-specification.md](inventory-system-specification.md) — Functional requirements & technical specs.

**Project Status**: 🟢 **Complete & Dynamic**. All 12 core modules are production-ready with real-time backend integration and Redux state management.
