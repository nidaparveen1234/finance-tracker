# 🌿 Finance Tracker

A personal expense tracking web application built with the MERN stack. I built this to track my own daily expenses — and I actually use it now.

## 🔗 Live Demo
[finance-tracker-frontend.onrender.com](https://finance-tracker-fys8.onrender.com)

## ✨ Features
- 🔐 Register and login with JWT authentication
- ➕ Add expenses with category, date and note
- 🗂️ Filter expenses by category instantly
- ✏️ Edit or delete any expense
- 📊 Monthly summary with bar chart breakdown
- 📱 Mobile friendly layout

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router DOM
- Axios
- Recharts

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## 🏗️ Architecture
MVC pattern throughout the backend:
- **Models** → MongoDB schemas
- **Controllers** → all business logic
- **Routes** → just the doorways

## 📁 Project Structure
finance-tracker/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/

## 🚀 Run Locally

**Backend:**
```bash
cd backend
npm install
# create .env with MONGO_URI and JWT_SECRET
node server.js

cd frontend
npm install
npm start
