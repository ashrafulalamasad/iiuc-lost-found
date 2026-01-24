# IIUC Lost & Found

IIUC Lost & Found is a full-stack platform for students and staff of
International Islamic University Chittagong to report found items, search
existing reports, submit claims, and arrange safe handovers.

## Features

- Google authentication with Firebase.
- Report found items with descriptions, locations, categories, and images.
- Browse and filter found-item reports.
- Submit, review, accept, reject, or cancel claims.
- Claim-based private messaging with real-time Socket.IO updates.
- User profiles with personal reports and claims.
- Solved-item tracking and community impact statistics.
- Responsive interface for mobile, tablet, and desktop.
- Terms of Service, Privacy Policy, About, and User Guide pages.

## How it works

1. Sign in with Google.
2. Search the existing reports if you lost an item.
3. Report an item if you found it.
4. Submit a claim when a report may belong to you.
5. Verify ownership and arrange a safe handover through the claim chat.
6. Mark the item as solved after it is returned.

## Technology

### Frontend

- React 19 and Vite
- React Router
- Tailwind CSS
- Firebase Authentication
- Framer Motion
- Lucide React
- Socket.IO client

### Backend

- Node.js and Express
- PostgreSQL with Prisma ORM
- Cloudinary image storage
- Socket.IO real-time messaging
- Zod request validation

## Project structure

```text
iiuc-lost-found/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Shared UI components
│       ├── context/        # Auth and socket state
│       ├── pages/          # Application pages
│       └── services/       # API and data helpers
├── server/                 # Express backend
│   ├── prisma/             # Schema and migrations
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── routes/         # API routes
│       └── socket/         # Real-time events
└── README.md
```

## Getting started

### Prerequisites

- Node.js and npm
- PostgreSQL
- Firebase project with Google sign-in enabled
- Cloudinary account

### Install dependencies

```bash
git clone https://github.com/ashrafulalamasad/iiuc-lost-found.git
cd iiuc-lost-found

cd server
npm install

cd ../client
npm install
```

### Configure environment variables

Create `client/.env` from `client/.env.example`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=
```

Create `server/.env` with:

```env
DATABASE_URL=
PORT=3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never commit `.env` files or private credentials.

### Prepare the database

Run from `server/`:

```bash
npx prisma generate
npx prisma migrate deploy
```

### Run the application

Start the backend from `server/`:

```bash
npm run dev
```

Start the frontend from `client/` in a second terminal:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on port
`3000` by default.

## Useful commands

### Client

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Server

```bash
npm start         # Start backend
npm run dev       # Start backend with Nodemon
npm run build     # Generate Prisma client and compile
npx prisma studio # Open Prisma Studio
```

## Main routes

| Route | Description |
| --- | --- |
| `/` | Home page and community statistics |
| `/login` | Google sign-in |
| `/find` | Browse and filter found items |
| `/item/:id` | View item details and claims |
| `/report` | Create a found-item report |
| `/profile` | Manage profile, reports, and claims |
| `/inbox` | View claim conversations |
| `/chat/:claimId` | Open a claim chat |
| `/about` | Project information |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/guides` | User guides |

## Contributing

Create a focused branch, reuse existing components and API helpers, and run
the relevant lint/build checks before opening a pull request. For bug reports,
include reproduction steps, expected behavior, and actual behavior.
