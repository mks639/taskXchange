# TaskXChange

TaskXChange is a collaborative team task management platform built with the MERN stack.

## Features
- 🔐 JWT Authentication (Login/Signup)
- 👥 Role-Based Access Control (Admin/Member)
- 📊 Dashboard with dynamic task statistics
- 📁 Project & Task creation (Admin)
- ✅ Task status updates (Pending, In Progress, Completed)
- 🎨 Modern, minimal, and responsive UI built with TailwindCSS

## Tech Stack
**Frontend:** React, Vite, React Router, Axios, TailwindCSS, Lucide React
**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployment
- **Backend (Railway):** Ready out-of-the-box. Ensure you set the `MONGODB_URI` and `JWT_SECRET` environment variables on your Railway project dashboard.
- **Frontend (Vercel):** The `vercel.json` is provided to handle Single Page Application (SPA) routing. Add your production backend URL via `VITE_API_URL` environment variable on Vercel.

## API Routes

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user

### Projects
- `GET /api/projects` - Get all projects (Protected)
- `POST /api/projects` - Create a project (Admin only)

### Tasks
- `GET /api/tasks` - Get tasks (Protected, filtered by role)
- `POST /api/tasks` - Create a task (Admin only)
- `PUT /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete a task (Admin only)

## Screenshots
*(Add placeholder screenshots here)*
![Dashboard Layout](placeholder-url)
