# Railway Deployment Setup

## Prerequisites
- Railway account (free at railway.app)
- GitHub account with your repository
- PostgreSQL database

## Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `Ondo_Lassa_Live_Dashboard` repository
5. Authorize GitHub access

## Step 2: Add PostgreSQL Database

1. In Railway dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance

## Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** and add:

```env
# Node Environment
NODE_ENV=production
PORT=5000

# Database (Railway auto-generates this)
DATABASE_URL=postgresql://user:password@host:5432/railway

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://your-vercel-frontend.vercel.app

# WebSocket
WS_PORT=5000
```

### Get DATABASE_URL from Railway

1. Click on PostgreSQL service
2. Go to "Connect" tab
3. Copy the "Postgres Connection URL"
4. Paste as `DATABASE_URL`

## Step 4: Configure Build & Deploy

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

### Root Directory
```
backend
```

## Step 5: Deploy

Railway will automatically deploy when you push to main branch.

## Step 6: Get Your Backend URL

After deployment, Railway provides a URL like:
```
https://lassa-backend-production.railway.app
```

Use this URL for:
- Frontend `VITE_API_URL`
- Frontend `VITE_WS_URL` (with `wss://` protocol)

## Database Initialization

### First Deployment

1. Connect to Railway shell
2. Run database initialization:

```bash
npm run build
node dist/db/init.js
npm run seed
```

## Monitoring

### View Logs
```bash
railway logs
```

### Health Check
```bash
curl https://your-railway-url.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Environment Variable Updates

After changing environment variables:
1. Save changes in Railway dashboard
2. Redeploy (automatic or manual)
3. Verify deployment with health check

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check database is running in Railway dashboard
- Ensure `NODE_ENV=production`

### Port Already in Use
Railway automatically manages ports, but ensure `PORT=5000` in variables.

### WebSocket Connection Fails
- Use `wss://` protocol (secure WebSocket)
- Verify CORS_ORIGIN matches your frontend URL
- Check backend logs for errors

### Build Failures
```bash
# Check build logs in Railway dashboard
# Common issues:
# 1. Missing dependencies - npm ci instead of npm install
# 2. TypeScript errors - npm run typecheck locally first
# 3. Missing env variables - add to Railway variables
```

## Production Best Practices

1. **Backup Database**: Use Railway's backup feature
2. **Monitor Logs**: Check logs regularly for errors
3. **Set Alert**: Configure uptime monitoring
4. **Rotate Secrets**: Change JWT_SECRET periodically
5. **Update Dependencies**: Keep npm packages updated

## Connect Frontend & Backend

1. Deploy frontend to Vercel (see VERCEL_SETUP.md)
2. Get Railway backend URL
3. Update Vercel environment variables:
   - `VITE_API_URL=https://your-railway-url.railway.app`
   - `VITE_WS_URL=wss://your-railway-url.railway.app`
4. Redeploy on Vercel
