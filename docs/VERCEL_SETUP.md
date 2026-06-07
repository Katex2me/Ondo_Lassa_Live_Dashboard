# Vercel Deployment Setup

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub account with your repository

## Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select your `Ondo_Lassa_Live_Dashboard` repository

## Step 2: Configure Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```env
VITE_API_URL=https://your-railway-backend.railway.app
VITE_WS_URL=wss://your-railway-backend.railway.app
```

## Step 3: Configure Build Settings

**Framework**: Vite
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`
**Root Directory**: `frontend`

## Step 4: Deploy

Click "Deploy" and wait for the deployment to complete.

## Step 5: Get Your Frontend URL

After deployment, Vercel will provide a URL like:
```
https://ondo-lassa-live-dashboard.vercel.app
```

Save this URL for Railway backend configuration.

## Automatic Deployments

Every push to `main` branch will automatically trigger a deployment.

## Preview Deployments

Pull requests automatically get preview deployments at:
```
https://ondo-lassa-live-dashboard-<pr-number>.vercel.app
```

## Troubleshooting

### Build fails with module not found
```bash
cd frontend
npm install --legacy-peer-deps
```

### Environment variables not loading
- Ensure variables are set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

### WebSocket connection fails
- Verify `VITE_WS_URL` is correct
- Ensure backend is running and accessible
- Check CORS settings in backend

## Monitoring Vercel Deployment

- **Logs**: Vercel Dashboard → Deployments → Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Performance**: Vercel Dashboard → Speed Insights
