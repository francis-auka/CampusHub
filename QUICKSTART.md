# Campus Hub - Quick Start Guide

## ⚠️ Important: Start Backend First!

The frontend requires the backend to be running. Follow these steps:

### Step 1: Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is installed and running
mongod
```

**Option B: MongoDB Atlas (Recommended)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campushub
```

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

### Step 3: Frontend is Already Running

The frontend is running on http://localhost:5173

## ✅ Testing the Application

### 1. Test Backend API
Open http://localhost:5000/api/health in your browser.
You should see: `{"message":"Campus Hub API is running","status":"OK"}`

### 2. Test Frontend
Open http://localhost:5173
You should see the Campus Hub landing page.

### 3. Test Registration
1. Click "Get Started"
2. Select "Student" or "MSME"
3. Fill in the form
4. Click "Create Account"
5. You'll be redirected to your dashboard

### 4. Test Login
1. Go to http://localhost:5173/login
2. Enter your credentials
3. Click "Sign In"
4. You'll be redirected to your dashboard

## 🐛 Troubleshooting

### White Screen on Frontend
- **Cause**: Backend not running
- **Solution**: Start the backend server first

### "Network Error" on Login/Register
- **Cause**: Backend not accessible
- **Solution**: Check backend is running on port 5000

### MongoDB Connection Error
- **Cause**: MongoDB not running or wrong connection string
- **Solution**: 
  - Check MongoDB is running locally, OR
  - Use MongoDB Atlas and update `.env`

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## 📝 Current Status

### ✅ Working
- Frontend pages (Landing, Login, Register, Tasks, Dashboard)
- Design system with Tailwind
- Routing with React Router
- AuthContext for state management

### ⚠️ Needs Backend Running
- User registration
- User login
- Task fetching
- Authentication verification

### 🔄 Next Steps
1. Start backend server
2. Test registration flow
3. Test login flow
4. Connect task browsing to API
5. Build MSME dashboard
6. Build task details page

## 🚀 API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (MSME only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/apply` - Apply for task (Student only)
- `POST /api/tasks/:id/assign` - Assign task to student (MSME only)

## 💡 Tips

1. **Use MongoDB Atlas** for easier setup (no local MongoDB needed)
2. **Keep both terminals open** - one for frontend, one for backend
3. **Check browser console** for any errors
4. **Use Postman** to test API endpoints directly
5. **Clear localStorage** if you have auth issues: `localStorage.clear()`

## 📞 Need Help?

Check the logs:
- Frontend: Browser console (F12)
- Backend: Terminal where `npm run dev` is running
- MongoDB: Check connection string in `.env`
