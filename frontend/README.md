# KP Fresh Dairy — Frontend (React + Vite)

A role-based dairy subscription web app frontend. Customers subscribe to products for a chosen number of months and view them in Profile; Admins manage products and subscriptions. Branding: KP Fresh Dairy.

## Features
- Role-protected routes (Customer, Admin, Staff)
- Subscriptions with months and total price
- Customer Profile shows subscriptions and totals
- Admin panel: subscriptions list and daily run processor
- Product images loaded from public folder (Paneer, Cow Milk, Buffalo milk, Ghee)
- JWT auth with interceptors and guarded routes

## Tech Stack
- React 19 + Vite 7
- React Router DOM 7
- Tailwind CSS
- Axios

## Prerequisites
- Node.js 18+ and npm
- Backend API running at http://127.0.0.1:8000/ (Django)

## Quick Start
```bash
# from frontend/
npm install
npm run dev
# Open the printed Local URL (default http://localhost:5173/)
```

## Build & Preview
```bash
npm run build
npm run preview
```

## Configuration
- API base URL configured here: [src/api/axios.js](file:///d:/Dudhvala/frontend/src/api/axios.js)
- Default: http://127.0.0.1:8000/api/
- Tokens stored in localStorage; unauthorized responses clear tokens and redirect to /login

## Routes
- Public: `/`, `/products`, `/login`, `/signup`
- Customer: `/subscriptions`, `/profile`
- Admin: `/admin/dashboard`, `/admin/products`, `/admin/subscriptions`, `/admin/staff`
- Staff: `/staff/profile`
- Deprecated cart/orders paths redirect to subscriptions

## Product Images
Place images in `frontend/public` with these filenames:
- Paneer: `/paneer.jpg`
- Cow Milk: `/cowimage.jpg`
- Buffalo milk: `/Buffalomilk.jpg`
- Ghee: `/Ghee.jpg`

The mapping logic lives in [ProductImage.jsx](file:///d:/Dudhvala/frontend/src/components/ProductImage.jsx). If a product image is missing, a fallback illustration is shown.

## Key Files
- App routes: [App.jsx](file:///d:/Dudhvala/frontend/src/App.jsx)
- Navbar branding: [Navbar.jsx](file:///d:/Dudhvala/frontend/src/layout/Navbar.jsx)
- Admin sidebar branding: [Sidebar.jsx](file:///d:/Dudhvala/frontend/src/layout/Sidebar.jsx)
- Auth context and login/logout: [AuthContext.jsx](file:///d:/Dudhvala/frontend/src/context/AuthContext.jsx)
- Protected guard: [ProtectedRoute.jsx](file:///d:/Dudhvala/frontend/src/components/ProtectedRoute.jsx)
- Customer subscriptions UI: [Subscriptions.jsx](file:///d:/Dudhvala/frontend/src/pages/customer/Subscriptions.jsx)
- Customer profile view: [Profile.jsx](file:///d:/Dudhvala/frontend/src/pages/customer/Profile.jsx)
- Admin subscriptions: [Admin Subscriptions](file:///d:/Dudhvala/frontend/src/pages/admin/Subscriptions.jsx)
- Product card: [ProductCard.jsx](file:///d:/Dudhvala/frontend/src/components/ProductCard.jsx)

## Development Notes
- Branding uses “KP Fresh Dairy” across Navbar and Admin Sidebar
- Guard checks token exp from JWT; falls back to `/auth/me/` for role if missing
- Subscriptions serializer returns `months` and `total_price`
- Images use simple filename matching; can be extended to per-product image_url

## Troubleshooting
- If images don’t show, verify filenames are exactly as above and placed in `frontend/public`
- If API requests fail, ensure backend is running and `src/api/axios.js` baseURL matches your server
- If guarded routes redirect to login unexpectedly, refresh your token by logging in again

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
