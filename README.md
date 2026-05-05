# Krithiha Sathish — Portfolio

Full-stack portfolio website with a Node.js/Express backend, PostgreSQL database, and a static HTML/CSS/JS frontend.

```
portfolio/
├── backend/          ← Node.js + Express API (deploy to Render)
│   ├── server.js     ← main server file
│   ├── db.js         ← PostgreSQL connection + table setup
│   ├── package.json
│   ├── .env.example  ← copy to .env and fill in your values
│   └── .gitignore
└── frontend/
    ├── index.html    ← your entire portfolio (deploy to Vercel)
    ├── imgg.png      ← your profile picture (add this!)
    └── vercel.json
```

---

## Step 1 — Free PostgreSQL Database (Neon)

1. Go to **https://neon.tech** → Sign Up (free)
2. Create a new project → name it `portfolio`
3. Copy the **Connection String** — it looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Keep this — you'll need it in Steps 2 and 3.

---

## Step 2 — Deploy Backend to Render

1. Push your code to GitHub (create a repo if needed):
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. Go to **https://render.com** → Sign Up → **New → Web Service**

3. Connect your GitHub repo → select it

4. Fill in the settings:
   | Field | Value |
   |-------|-------|
   | **Name** | `portfolio-backend` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |

5. Add **Environment Variables** (click "Advanced"):
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | *(paste your Neon connection string)* |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | *(leave blank for now, fill after Step 3)* |

6. Click **Create Web Service** — wait ~2 minutes

7. Copy your Render URL: `https://portfolio-backend-xxxx.onrender.com`

---

## Step 3 — Update Frontend API URL

Open `frontend/index.html` and find this line near the bottom:

```js
const API_URL = 'http://localhost:5000';
```

Replace it with your Render URL:

```js
const API_URL = 'https://portfolio-backend-xxxx.onrender.com';
```

---

## Step 4 — Deploy Frontend to Vercel

1. Go to **https://vercel.com** → Sign Up with GitHub

2. Click **Add New → Project** → Import your GitHub repo

3. Set **Root Directory** to `frontend`

4. Click **Deploy** — done in ~30 seconds!

5. Copy your Vercel URL: `https://your-portfolio.vercel.app`

---

## Step 5 — Final CORS fix on Render

1. Go back to Render → your backend service → **Environment**
2. Set `FRONTEND_URL` = `https://your-portfolio.vercel.app`
3. Click **Save Changes** — Render auto-redeploys

---

## Local Development

```bash
# 1. Start the backend
cd backend
cp .env.example .env       # fill in your DATABASE_URL
npm install
npm run dev                # runs on http://localhost:5000

# 2. Open the frontend
# Just open frontend/index.html in your browser
# (or use VS Code Live Server — port 5500 is already whitelisted)
```

---

## Viewing Contact Messages

Visit `https://your-render-url.onrender.com/api/messages` in your browser to see all submitted messages as JSON.

Suggestion : In a future version you can add a simple password check to protect this endpoint.
