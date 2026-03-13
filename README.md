# KP Fresh Dairy

KP Fresh Dairy is a full-stack dairy delivery and subscription web application built with a Django REST backend and a React + Vite frontend.

The application supports three user roles:

- `CUSTOMER` can browse products, manage cart, place orders, create subscriptions, and update profile details
- `ADMIN` can manage products, staff, subscriptions, and order status from the admin dashboard
- `STAFF` can log in and access the staff profile area

## Project Structure

```text
Dudhvala/
|- backend/   Django REST API
|- frontend/  React + Vite client
```

## Features

- JWT-based authentication
- Role-based access control
- Product catalog with media/image support
- Cart and checkout flow
- Order management
- Subscription management
- Admin dashboard for staff, products, subscriptions, and orders
- Custom user model with role support

## Tech Stack

### Backend

- Django
- Django REST Framework
- Simple JWT
- SQLite
- django-cors-headers

### Frontend

- React 19
- Vite 7
- React Router DOM 7
- Axios
- Tailwind CSS

## API Base URL

```text
http://127.0.0.1:8000/api/
```

## Main Backend Routes

- `POST /api/auth/login/`
- `POST /api/auth/token/refresh/`
- `POST /api/auth/register/`
- `GET /api/auth/me/`
- `GET/POST /api/products/`
- `GET/POST /api/categories/`
- `GET/POST /api/orders/`
- `PATCH /api/orders/<id>/update_status/`
- `GET /api/orders/dashboard/`
- `GET/POST/PATCH/DELETE /api/cart/...`
- `GET/POST /api/subscriptions/`
- `POST /api/subscriptions/run_daily/`
- `GET/POST/PUT/DELETE /api/auth/staff/`

## Frontend Routes

### Public

- `/`
- `/products`
- `/login`
- `/signup`

### Customer

- `/cart`
- `/checkout`
- `/orders`
- `/subscriptions`
- `/profile`

### Admin

- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`
- `/admin/subscriptions`
- `/admin/staff`

### Staff

- `/staff/profile`

## Setup

### Backend

```powershell
cd d:\Dudhvala\backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Backend runs on:

```text
http://127.0.0.1:8000
```

### Frontend

```powershell
cd d:\Dudhvala\frontend
npm install
npm.cmd run dev
```

Frontend runs on:

```text
http://127.0.0.1:5173
```

## Default Local Admin Login

If your local database already contains the seeded admin user:

- Email: `admin123@gmail.com`
- Password: `admin`

If needed, create a new admin with:

```powershell
cd d:\Dudhvala\backend
python manage.py createsuperuser
```

## Validation Commands

### Backend

```powershell
cd d:\Dudhvala\backend
python manage.py check
python manage.py test
```

### Frontend

```powershell
cd d:\Dudhvala\frontend
npm.cmd run lint
npm.cmd run build
```

## Notes

- The frontend expects the backend at `http://127.0.0.1:8000/api/`
- Tokens are stored in `localStorage`
- Product images can come from Django media or frontend public assets
- Admin login uses role-aware JWT claims for correct redirects

## Important Files

- `backend/config/settings.py`
- `backend/config/urls.py`
- `backend/apps/users/`
- `backend/apps/products/`
- `backend/apps/orders/`
- `backend/apps/subscriptions/`
- `frontend/src/App.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/admin/`
CI/CD test deployment
