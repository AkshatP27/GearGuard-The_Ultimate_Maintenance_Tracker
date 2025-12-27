# GearGuard: The Ultimate Maintenance Tracker

A comprehensive maintenance tracking application for managing equipment, maintenance schedules, and team assignments.

## Project Structure

```
GearGuard/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/           # Express.js API server
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your Supabase credentials
npm run dev
```

Backend API will run on `http://localhost:5000`

## Demo Login Credentials

- Email: `demo@gearguard.com`
- Password: `demo123`

## Features

- 🔐 Authentication (Login/Signup with demo mode)
- 📊 Dashboard with maintenance overview
- 🛠️ Equipment management
- 📋 Maintenance tracking
- 👥 Team management
- 📱 Responsive design

## Tech Stack

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Vite
- Supabase Client

### Backend
- Express.js
- Supabase (Auth & Database)
- JWT Authentication
- CORS enabled

## Development

This project uses:
- ESM modules (type: "module")
- Hot Module Replacement (HMR)
- Modern JavaScript features
