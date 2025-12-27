# 🚀 Quick Start Guide - GearGuard

## Step 1: Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

## Step 2: Environment Configuration

### Frontend Environment
```bash
cd frontend
copy .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

### Backend Environment
```bash
cd backend
copy .env.example .env
```

Edit `.env` and add your configuration:
```
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_random_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

## Step 3: Start Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

## Step 4: Test the Application

1. Open your browser to: `http://localhost:5173`
2. You'll be redirected to `/auth`
3. Click "Demo Login" button or manually enter:
   - **Email**: `demo@gearguard.com`
   - **Password**: `demo123`
4. You'll be redirected to the dashboard!

## 🎯 Demo Credentials

```
Email: demo@gearguard.com
Password: demo123
```

## 📚 Available Routes

- `/auth` - Combined Login/Signup (default landing page)
- `/login` - Standalone login page
- `/signup` - Standalone signup page
- `/dashboard` - Main dashboard (requires auth)
- `/equipment` - Equipment management (requires auth)
- `/maintenance` - Maintenance tracking (requires auth)
- `/teams` - Team management (requires auth)

## 🔧 Troubleshooting

### Issue: Cannot connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend `.env`
- Verify `VITE_API_URL` in frontend `.env`

### Issue: Supabase errors
- Verify your Supabase project credentials
- Check that Supabase project is active
- Ensure authentication is enabled in Supabase dashboard

### Issue: Demo login not working
- Demo login works without Supabase configuration
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`

## 📦 Project Structure

```
GearGuard/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── styles/        # Global styles
│   └── package.json
│
├── backend/               # Express.js API
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Custom middleware
│   │   └── routes/        # API routes
│   └── package.json
│
└── README.md
```

## 🎨 Features Implemented

✅ Login & Sign Up pages with validation
✅ Demo login functionality
✅ Protected routes
✅ Modern, responsive UI
✅ Backend API with Express.js
✅ Supabase authentication integration
✅ JWT middleware
✅ Role-based user metadata

## 📞 API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `GET /api/health` - Health check

## 💡 Tips

1. **Use Demo Mode**: Perfect for testing without Supabase setup
2. **Check Console**: Browser console shows helpful debug info
3. **Backend Logs**: Backend terminal shows API requests
4. **Hot Reload**: Both frontend and backend support hot reload

## 🔜 Next Development Steps

1. Implement Dashboard UI with stats
2. Create Equipment CRUD operations
3. Build Maintenance scheduling system
4. Add Team management features
5. Implement notifications
6. Add data visualization (charts)
7. Create reporting features

---

**Need Help?** Check the `IMPLEMENTATION_SUMMARY.md` for detailed technical documentation.
