# GearGuard Backend API

Backend API for the GearGuard Maintenance Tracker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login (supports demo credentials)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout (protected)
- `GET /api/auth/profile` - Get user profile (protected)

### Demo Credentials
- Email: `demo@gearguard.com`
- Password: `demo123`

## Tech Stack
- Express.js
- Supabase (Authentication & Database)
- JWT for token management
