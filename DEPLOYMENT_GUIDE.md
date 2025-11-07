# 🚀 Deployment Guide - Voice Agent Demo

This guide shows you how to deploy your voice agent demo to the web so you have a shareable link.

## 🎯 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Frontend + Backend on Vercel (Free)**

1. **Deploy Backend:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy backend
   cd backend
   vercel --prod
   ```

2. **Deploy Frontend:**
   ```bash
   # Go back to project root
   cd ..
   
   # Update the backend URL in your deployment configs
   # Replace "your-backend-url.herokuapp.com" with your actual Vercel backend URL
   
   # Deploy frontend
   vercel --prod
   ```

3. **Update Environment Variables:**
   - In Vercel dashboard, go to your frontend project
   - Add environment variable: `VITE_WEBSOCKET_URL` = your backend URL

### Option 2: Netlify + Heroku (Popular)

**Frontend on Netlify + Backend on Heroku**

1. **Deploy Backend to Heroku:**
   ```bash
   # Install Heroku CLI
   # https://devcenter.heroku.com/articles/heroku-cli
   
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   cd backend
   heroku create your-app-name-backend
   
   # Deploy
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

2. **Deploy Frontend to Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Build the project
   npm run build
   
   # Deploy
   cd ..
   netlify deploy --prod --dir=dist
   ```

3. **Update Configuration:**
   - Update `netlify.toml` with your actual Heroku backend URL
   - Add environment variable in Netlify dashboard: `VITE_WEBSOCKET_URL`

### Option 3: Railway (All-in-One)

**Both Frontend and Backend on Railway**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Deploy Frontend:**
   ```bash
   cd ..
   railway login
   railway init
   railway up
   ```

## 📋 Step-by-Step Deployment (Vercel Example)

### Step 1: Prepare Your Code

1. **Make sure everything works locally:**
   ```bash
   # Test backend
   cd backend
   npm install
   npm start
   
   # Test frontend (in another terminal)
   cd ..
   npm run dev
   ```

2. **Test the real-time functionality:**
   ```bash
   cd backend
   node test-webhooks.js
   ```

### Step 2: Deploy Backend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy backend:**
   ```bash
   cd backend
   vercel --prod
   ```

3. **Note your backend URL** (e.g., `https://your-app-backend.vercel.app`)

### Step 3: Deploy Frontend to Vercel

1. **Update configuration:**
   - Edit `vercel.json` and replace `your-backend-url.herokuapp.com` with your actual backend URL

2. **Deploy frontend:**
   ```bash
   cd ..
   vercel --prod
   ```

3. **Set environment variable:**
   - Go to Vercel dashboard → Your frontend project → Settings → Environment Variables
   - Add: `VITE_WEBSOCKET_URL` = your backend URL

### Step 4: Test Your Deployment

1. **Visit your frontend URL** (e.g., `https://your-app-frontend.vercel.app`)
2. **Enable real-time mode** in the interface
3. **Test with the backend URL:**
   ```bash
   # Update test script with your deployed backend URL
   cd backend
   # Edit test-webhooks.js and change BASE_URL to your deployed backend
   node test-webhooks.js
   ```

## 🔧 Environment Variables

### Frontend Environment Variables

Create `.env` file in project root:
```env
VITE_WEBSOCKET_URL=https://your-backend-url.vercel.app
```

### Backend Environment Variables

Create `backend/.env`:
```env
PORT=3001
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

## 🌐 Domain Configuration

### Custom Domain (Optional)

1. **Buy a domain** (e.g., from Namecheap, GoDaddy)
2. **Configure DNS:**
   - Point your domain to your hosting provider
   - Update environment variables with your custom domain

### Subdomain Setup

- **Frontend:** `demo.yourdomain.com`
- **Backend:** `api.yourdomain.com`

## 📱 Sharing Your Demo

Once deployed, you'll have:
- **Frontend URL:** `https://your-app-frontend.vercel.app`
- **Backend URL:** `https://your-app-backend.vercel.app`

### For Voice Agent Integration

Your voice agent can now use the deployed backend URL:

```python
# Update your voice agent code
WEBHOOK_BASE_URL = "https://your-app-backend.vercel.app"

def trigger_demo_step(tool_name):
    response = requests.post(f"{WEBHOOK_BASE_URL}/webhook/{tool_name}")
    return response.json()
```

## 🚨 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed:**
   - Check that backend is deployed and running
   - Verify `VITE_WEBSOCKET_URL` environment variable
   - Check browser console for CORS errors

2. **Build Failures:**
   - Ensure all dependencies are in `package.json`
   - Check build logs for specific errors
   - Test build locally: `npm run build`

3. **CORS Issues:**
   - Update backend `FRONTEND_URL` environment variable
   - Redeploy backend after changes

### Debug Steps

1. **Check deployment logs:**
   ```bash
   vercel logs
   ```

2. **Test endpoints manually:**
   ```bash
   curl https://your-backend-url.vercel.app/health
   ```

3. **Browser developer tools:**
   - Check Network tab for failed requests
   - Check Console for JavaScript errors

## 💰 Cost Considerations

### Free Tier Limits

- **Vercel:** 100GB bandwidth/month, 100 serverless functions
- **Netlify:** 100GB bandwidth/month, 300 build minutes
- **Heroku:** 550-1000 dyno hours/month (sleeps after inactivity)
- **Railway:** $5/month after free credits

### Recommendations

- **Development/Testing:** Vercel (free tier)
- **Production:** Vercel Pro or Railway for better uptime
- **High Traffic:** Consider AWS, Google Cloud, or Azure

## 🔄 Updating Your Deployment

### Automatic Deployments

Connect your GitHub repository to your hosting provider for automatic deployments on push.

### Manual Updates

```bash
# Update and redeploy
git add .
git commit -m "Update demo"
git push

# Or redeploy manually
vercel --prod
```

## 📊 Monitoring

### Health Checks

Your backend includes a health endpoint:
- `GET /health` - Returns server status
- `GET /sessions` - Returns active WebSocket connections

### Analytics

- **Vercel Analytics:** Built-in performance monitoring
- **Google Analytics:** Add tracking code to frontend
- **Custom Logging:** Add logging to backend for webhook calls

## 🎉 You're Done!

Once deployed, you'll have:
- ✅ A shareable web link for your demo
- ✅ Real-time WebSocket functionality
- ✅ Voice agent webhook endpoints
- ✅ Professional deployment

Share your demo link with anyone and they can see the real-time voice agent interface in action!
