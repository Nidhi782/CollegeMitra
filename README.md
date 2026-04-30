# CollegeMitra

College discovery platform with:
- College listing + search + filters + pagination
- College detail page
- Compare up to 3 colleges side-by-side

## Tech
- Frontend: Next.js 14 + Tailwind + TypeScript
- Backend: Express + TypeScript
- DB: PostgreSQL + Prisma

## Run locally

### Backend
Create `backend/.env` from `backend/.env.example`, then:

```bash
cd backend
npm install
npx prisma db push
npm run db:seed
npm run dev
```

### Frontend
Create `frontend/.env.local` from `frontend/.env.local.example`, then:

```bash
cd frontend
npm install
npm run dev
```

