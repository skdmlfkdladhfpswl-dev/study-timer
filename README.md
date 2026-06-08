# Study Timer Deployment Guide

## 1. Database Setup (NeonDB)
1. Go to [Neon.tech](https://neon.tech/) and create a new project.
2. Get your **Connection String**.
3. It should look like: `postgresql://user:password@hostname/dbname?sslmode=require`

## 2. Environment Variables
Create a `.env` file in the `backend` directory:
```
DATABASE_URL=your_connection_string_here
PORT=3001
```

## 3. Deployment on Render
### Backend
1. Create a new **Web Service**.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Add Environment Variable: `DATABASE_URL`

### Frontend
1. Create a new **Static Site**.
2. Build Command: `npm install && npm run build`
3. Publish Directory: `dist`
4. Add Environment Variable: `VITE_API_URL` (optional if you update code to use it)

## 4. Local Running
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`
