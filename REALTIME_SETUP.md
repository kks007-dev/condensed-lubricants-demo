# Real-Time Voice Agent Demo Setup

This guide explains how to set up and use the real-time voice agent demo system.

## Overview

The system consists of:
- **React Frontend**: Your existing demo interface with WebSocket support
- **WebSocket Backend**: Node.js server that receives webhook calls and pushes updates
- **Voice Agent Integration**: Your AI agent sends HTTP requests to trigger demo steps

## Quick Start

### 1. Start the Backend Server

```bash
# Install backend dependencies
cd backend
npm install

# Start the WebSocket server
npm start
```

The server will run on `http://localhost:3001` and provide WebSocket connectivity.

### 2. Start the Frontend

```bash
# In the project root
npm run dev
```

The frontend will run on `http://localhost:5173`.

### 3. Enable Real-Time Mode

1. Open the demo interface in your browser
2. Toggle "Real-time Mode" in the top-right corner
3. You should see a green "Connected" indicator

### 4. Test the System

```bash
# Run the test script to simulate voice agent calls
cd backend
node test-webhooks.js
```

You should see the demo interface update in real-time as the test script sends webhook requests.

## Voice Agent Integration

### Webhook Endpoints

Your voice agent can trigger demo steps by making HTTP POST requests to these endpoints:

| Voice Agent Tool | Webhook Endpoint | Demo Step |
|------------------|------------------|-----------|
| `unfillable_status` | `/webhook/unfillable-status` | Capacity Warning |
| `send_suggestions` | `/webhook/send-suggestions` | AI Suggestions |
| `update_order` | `/webhook/update-order` | Order Updated |
| `call_freighter` | `/webhook/call-freighter` | Freight Setup |
| `confirm_pickup` | `/webhook/confirm-pickup` | Confirmation |
| `set_backups` | `/webhook/set-backups` | Contingency |
| `send_email` | `/webhook/send-email` | Final Confirmation |

### Example Integration

Here's how to integrate with your voice agent workflow:

```python
# Example Python code for your voice agent
import requests

def trigger_demo_step(tool_name):
    webhook_url = "http://localhost:3001"
    
    # Map tool names to webhook endpoints
    tool_endpoints = {
        "unfillable_status": "/webhook/unfillable-status",
        "send_suggestions": "/webhook/send-suggestions", 
        "update_order": "/webhook/update-order",
        "call_freighter": "/webhook/call-freighter",
        "confirm_pickup": "/webhook/confirm-pickup",
        "set_backups": "/webhook/set-backups",
        "send_email": "/webhook/send-email"
    }
    
    if tool_name in tool_endpoints:
        response = requests.post(
            f"{webhook_url}{tool_endpoints[tool_name]}",
            json={}
        )
        return response.json()
    else:
        print(f"Unknown tool: {tool_name}")

# Usage in your voice agent
trigger_demo_step("unfillable_status")
```

### Generic Endpoint

For more flexibility, use the generic endpoint:

```python
def trigger_demo_step_generic(step_name, custom_message=None):
    webhook_url = "http://localhost:3001/webhook/demo-step"
    
    payload = {"step": step_name}
    if custom_message:
        payload["message"] = custom_message
    
    response = requests.post(webhook_url, json=payload)
    return response.json()

# Usage
trigger_demo_step_generic("capacity-warning", "Custom message from voice agent")
```

## Demo Flow

The complete demo flow with voice agent integration:

1. **Initial View** - User starts the demo
2. **Capacity Warning** - Voice agent calls `unfillable_status` tool
3. **AI Suggestions** - Voice agent calls `send_suggestions` tool
4. **Order Updated** - Voice agent calls `update_order` tool
5. **Freight Setup** - Voice agent calls `call_freighter` tool
6. **Confirmation** - Voice agent calls `confirm_pickup` tool
7. **Contingency** - Voice agent calls `set_backups` tool
8. **Final Confirmation** - Voice agent calls `send_email` tool

## Configuration

### Backend Configuration

Create `backend/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

The frontend automatically connects to `http://localhost:3001`. To change this, update the `useWebSocket` hook in `src/hooks/useWebSocket.ts`.

## Troubleshooting

### Connection Issues

1. **"Disconnected" status in frontend:**
   - Check that backend server is running
   - Verify port 3001 is not blocked
   - Check browser console for errors

2. **Webhook calls not working:**
   - Ensure frontend is in "Real-time Mode"
   - Check backend logs for incoming requests
   - Verify webhook URLs are correct

3. **CORS errors:**
   - Update `FRONTEND_URL` in backend `.env`
   - Restart backend server

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=socket.io:* npm start

# Frontend - check browser console
```

## Production Deployment

### Backend Deployment

1. **Environment Variables:**
   ```env
   PORT=3001
   FRONTEND_URL=https://your-domain.com
   NODE_ENV=production
   ```

2. **Process Management:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "voice-demo-backend"
   ```

3. **Reverse Proxy (nginx):**
   ```nginx
   location /socket.io/ {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
   }
   ```

### Frontend Deployment

Build and deploy the frontend as usual:

```bash
npm run build
# Deploy dist/ folder to your hosting service
```

## Security Considerations

- Add authentication to webhook endpoints
- Implement rate limiting
- Use HTTPS in production
- Validate webhook payloads
- Consider IP whitelisting

## Next Steps

1. Integrate webhook calls into your voice agent workflow
2. Customize demo steps and messages
3. Add authentication and security measures
4. Deploy to production environment
5. Monitor and optimize performance
