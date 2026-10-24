<div align="center">

<img src="https://img.shields.io/badge/TRU%20FITNESS-Gym%20Management-dc1e1e?style=for-the-badge&logo=django&logoColor=white" alt="TRU FITNESS"/>

# 🏋️ TRU FITNESS — Gym Management System

**A full-stack gym management web application built with Django REST Framework + React**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-tru--fitness.vercel.app-dc1e1e?style=flat-square)](https://tru-fitness.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend%20API-onrender.com-222222?style=flat-square)](https://tru-fitness-1.onrender.com/api/)
[![Django Admin](https://img.shields.io/badge/🔧%20Django%20Admin-Admin%20Panel-3b82f6?style=flat-square)](https://tru-fitness-1.onrender.com/admin/)

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.1-092E20?style=flat-square&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)

</div>

---

## 📌 About the Project

**TRU FITNESS** is a modern, cloud-deployed gym management system that replaces manual registers and spreadsheets with a professional web dashboard.

Gym staff can manage members, plans, payments, and attendance — while members get a self-service portal to check their subscription status and check in using just their name and phone number.

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| 🖥️ **Frontend** | [https://tru-fitness.vercel.app](https://tru-fitness.vercel.app) |
| ⚙️ **Backend API** | [https://tru-fitness-1.onrender.com/api/](https://tru-fitness-1.onrender.com/api/) |
| 🔧 **Django Admin** | [https://tru-fitness-1.onrender.com/admin/](https://tru-fitness-1.onrender.com/admin/) |

> ⚠️ Backend runs on Render free tier — first load after idle may take 30–60 seconds to wake up.

---

## ✨ Features

### 👨‍💼 Staff / Admin
- 🔐 **Secure Login** — JWT-based authentication with role-based access
- 📊 **Dashboard** — Active members, expiry alerts (7-day window), today's check-ins, monthly income
- 👥 **Member Management** — Add, edit, delete, search, filter members
- 📋 **Membership Plans** — Create and manage Monthly / Quarterly / Yearly plans
- 💳 **Payments** — Track cash, UPI, card payments with CSV export
- 📅 **Check-In** — Search member by name/phone and record attendance
- 📈 **Member Detail** — Full profile with subscriptions, payments, attendance history tabs

### 🏃 Members (Self-Service Portal)
- 🔑 **Login with Name + Phone** — No password needed
- 📊 **View Own Plan** — See subscription details and days remaining
- 🖐️ **Self Check-In** — One-click fingerprint-style check-in button

### 🔒 Role-Based Access
| Feature | Admin | Staff | Member |
|---------|-------|-------|--------|
| Dashboard | ✅ Full | ✅ No income | ❌ |
| Manage Members | ✅ | ✅ | ❌ |
| View Income | ✅ | ❌ Hidden | ❌ |
| Delete Members | ✅ | ❌ | ❌ |
| Check-In Members | ✅ | ✅ | Self only |
| Django Admin | ✅ | ❌ | ❌ |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Python 3.11** | Programming language |
| **Django 5.1** | Web framework |
| **Django REST Framework** | REST API toolkit |
| **SimpleJWT** | JWT authentication |
| **PostgreSQL** | Production database |
| **Gunicorn** | Production WSGI server |
| **WhiteNoise** | Static file serving |
| **django-cors-headers** | CORS handling |
| **dj-database-url** | Database URL parsing |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library |
| **Vite** | Build tool |
| **Material UI (MUI)** | Component library |
| **React Router v6** | Page navigation |
| **Axios** | HTTP client |
| **JWT Decode** | Token decoding |
| **Day.js** | Date formatting |

### Deployment
| Platform | Used For |
|---------|---------|
| **Vercel** | Frontend hosting (CDN, auto-deploy) |
| **Render** | Backend + PostgreSQL hosting |
| **GitHub** | Code repository + CI/CD trigger |

---

## 🗄️ Database Schema

```
users_user          ← Admin, Staff, Trainer accounts (role-based)
members_member      ← Gym member profiles
plans_membershipplan ← Monthly / Quarterly / Yearly plans
subscriptions_subscription ← Member-plan enrollments with auto end-date
payments_payment    ← Cash / UPI / Card payment records
attendance_attendance ← Daily check-in timestamps
token_blacklist_*   ← JWT token blacklist (auto-managed)
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/kishore2204-git/tru-fitness.git
cd tru-fitness
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed demo data
python manage.py seed_demo_data

# Start server
python manage.py runserver
```
Backend runs at: `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🔐 Demo Credentials

### Staff / Admin Login
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Staff | `staff` | `staff123` |
| Trainer | `trainer` | `trainer123` |

### Member Portal Login
| Name | Phone |
|------|-------|
| Rahul Sharma | `9876543210` |
| Priya Patel | `9876543211` |
| Amit Kumar | `9876543212` |

> ⚠️ Change all passwords after deployment via [Django Admin](https://tru-fitness-1.onrender.com/admin/)

---

## 📁 Project Structure

```
tru-fitness/
├── backend/
│   ├── config/          ← Django settings, URLs, WSGI
│   ├── users/           ← Custom user model, JWT login, permissions
│   ├── members/         ← Member profiles + seed_demo_data command
│   ├── plans/           ← Membership plan management
│   ├── subscriptions/   ← Plan enrollment, auto end-date calculation
│   ├── payments/        ← Payment recording and tracking
│   ├── attendance/      ← Check-in records
│   ├── dashboard/       ← Aggregated stats API
│   ├── portal/          ← Member self-service (name+phone auth)
│   ├── build.sh         ← Render build script
│   ├── requirements.txt ← Python dependencies
│   ├── runtime.txt      ← Python version (3.11.9)
│   └── manage.py
│
└── frontend/
    └── src/
        ├── pages/       ← Login, Dashboard, Members, Plans, CheckIn, Payments, Portal
        ├── components/  ← Sidebar, Layout, Forms, ProtectedRoute
        ├── api/         ← Axios config + API functions
        ├── context/     ← AuthContext (global user state)
        └── theme.js     ← MUI dark red/black theme
```

---

## 🔌 API Endpoints

```
POST   /api/login/                 ← Staff/Admin login
POST   /api/token/refresh/         ← Refresh JWT token
GET    /api/dashboard/             ← Dashboard stats
GET    /api/members/               ← List members
POST   /api/members/               ← Add member
GET    /api/members/{id}/          ← Get member detail
PUT    /api/members/{id}/          ← Update member
DELETE /api/members/{id}/          ← Delete member
GET    /api/plans/                 ← List plans
POST   /api/plans/                 ← Create plan
GET    /api/subscriptions/         ← List subscriptions
POST   /api/subscriptions/         ← Create subscription
GET    /api/payments/              ← List payments
POST   /api/payments/              ← Record payment
GET    /api/attendance/            ← List attendance
POST   /api/attendance/checkin/    ← Staff check-in
POST   /api/portal/login/          ← Member portal login
GET    /api/portal/me/             ← Member own profile
POST   /api/portal/checkin/        ← Member self check-in
```

---

## ☁️ Deployment

### Backend (Render)
1. Connect GitHub repo to Render
2. Set **Build Command**: `chmod +x build.sh && ./build.sh`
3. Set **Start Command**: `gunicorn config.wsgi:application`
4. Set environment variables:
   - `DATABASE_URL` — PostgreSQL URL (auto-provided by Render)
   - `SECRET_KEY` — Django secret key
   - `DEBUG` — `False`
   - `ALLOWED_HOSTS` — `tru-fitness-1.onrender.com`

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set **Root Directory**: `frontend`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Set environment variable:
   - `VITE_API_URL` — `https://tru-fitness-1.onrender.com/api`

---

## 🔮 Future Scope

- [ ] WhatsApp / SMS reminders before membership expiry
- [ ] Online payment integration (Razorpay)
- [ ] QR code check-in at gym entrance
- [ ] Monthly income analytics charts
- [ ] Member profile photo upload
- [ ] Mobile app (React Native)

---

## 📄 License

This project is for educational purposes.

---

<div align="center">

**Built with ❤️ using Django + React**

[🌐 Live Demo](https://tru-fitness.vercel.app) &nbsp;·&nbsp; [⚙️ API](https://tru-fitness-1.onrender.com/api/) &nbsp;·&nbsp; [🔧 Admin](https://tru-fitness-1.onrender.com/admin/)

</div>
