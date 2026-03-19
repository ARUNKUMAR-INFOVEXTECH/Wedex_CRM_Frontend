# HallFlow Frontend

A clean, minimal Next.js 14 frontend for the HallFlow marriage hall management system.

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Auto-redirects based on role |
| `/landing` | Public | Marketing landing page |
| `/login` | Public | Login for all roles |
| `/admin` | Super Admin | Dashboard with stats |
| `/admin/halls` | Super Admin | Create, manage, suspend halls |
| `/admin/packages` | Super Admin | Manage subscription plans |
| `/admin/subscriptions` | Super Admin | Renew & change packages |
| `/owner` | Hall Owner | Dashboard + staff overview |
| `/owner/staff` | Hall Owner | Add/edit/remove staff |
| `/owner/subscription` | Hall Owner | View subscription details |
| `/staff` | Staff/Manager | Profile dashboard |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
```

### 3. Run locally
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Deploy to Vercel (Free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
4. Click **Deploy** — done in ~2 minutes

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Axios** (API calls with auto token refresh)
- **react-hot-toast** (notifications)
- **Custom CSS variables** (no UI library needed)

## Authentication Flow

1. User logs in → JWT + refresh token stored in `localStorage`
2. Every API request auto-attaches the Bearer token
3. On 401 → auto-refreshes using `refresh_token`
4. On refresh failure → clears storage and redirects to `/login`
5. Role-based routing: `super_admin` → `/admin`, `owner` → `/owner`, others → `/staff`
