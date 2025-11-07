# Lubricants Voice Demo - Backend

Real-time WebSocket backend for the voice agent demo interface.

## Overview

This backend provides WebSocket connectivity and webhook endpoints that allow your voice agent to trigger real-time updates in the React frontend. When your AI agent calls specific tools during a conversation, it can send HTTP requests to these webhooks, which then push updates to all connected clients via WebSocket.

## Architecture

```
Voice Agent → Webhook POST → Backend Server → WebSocket → React Frontend
```

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

3. **Test the connection:**
   ```bash
   node test-webhooks.js
   ```

## Webhook Endpoints

The backend provides specific webhook endpoints that correspond to your voice agent workflow tools:

### Individual Tool Endpoints

- `POST /webhook/unfillable-status` - Triggers capacity warning step
- `POST /webhook/send-suggestions` - Triggers AI suggestions step  
- `POST /webhook/update-order` - Triggers order update step
- `POST /webhook/call-freighter` - Triggers freight setup step
- `POST /webhook/confirm-pickup` - Triggers pickup confirmation step
- `POST /webhook/set-backups` - Triggers contingency planning step
- `POST /webhook/send-email` - Triggers final confirmation step

### Generic Demo Step Endpoint

- `POST /webhook/demo-step` - Generic endpoint for any demo step

**Request Body:**
```json
{
  "step": "capacity-warning",
  "sessionId": "optional-session-id",
  "message": "Custom message override"
}
```

**Available Steps:**
- `initial`
- `capacity-warning`
- `ai-suggestions`
- `order-updated`
- `freight-setup`
- `confirmation`
- `contingency`
- `final-confirmation`

## Integration with Voice Agent

### Option 1: Direct Webhook Calls

Configure your voice agent to make HTTP POST requests to these endpoints when specific tools are triggered:

```javascript
// Example: When unfillable_status tool is called
fetch('http://localhost:3001/webhook/unfillable-status', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
});
```

### Option 2: Using the Generic Endpoint

For more flexibility, use the generic `/webhook/demo-step` endpoint:

```javascript
// Example: When any tool is called
fetch('http://localhost:3001/webhook/demo-step', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    step: 'capacity-warning',
    message: 'Custom message from voice agent'
  })
});
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## API Reference

### Health Check
- `GET /health` - Returns server status and active session count

### Session Management
- `GET /sessions` - Returns list of active WebSocket sessions

## Testing

Use the included test script to simulate voice agent calls:

```bash
# Run full demo sequence
node test-webhooks.js demo

# Test individual endpoints
node test-webhooks.js individual

# Test generic endpoint
node test-webhooks.js generic
```

## Deployment

### Local Development
1. Start the backend: `npm start`
2. Start the frontend: `npm run dev` (in project root)
3. Enable "Real-time Mode" in the frontend interface

### Production Deployment

For production deployment, consider:

1. **Environment Variables:**
   ```env
   PORT=3001
   FRONTEND_URL=https://your-frontend-domain.com
   NODE_ENV=production
   ```

2. **Process Management:**
   Use PM2 or similar process manager:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "voice-demo-backend"
   ```

3. **Reverse Proxy:**
   Configure nginx or similar to proxy WebSocket connections:
   ```nginx
   location /socket.io/ {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
   }
   ```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed:**
   - Check that the backend server is running
   - Verify CORS settings match your frontend URL
   - Check firewall settings

2. **Webhook Not Triggering Updates:**
   - Ensure the frontend is in "Real-time Mode"
   - Check browser console for WebSocket errors
   - Verify webhook endpoint URLs are correct

3. **CORS Errors:**
   - Update `FRONTEND_URL` environment variable
   - Check that the frontend URL matches exactly

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=socket.io:*
```

## Security Considerations

- Add authentication/authorization for webhook endpoints
- Implement rate limiting for webhook calls
- Use HTTPS in production
- Validate webhook payloads
- Consider IP whitelisting for webhook endpoints
# Backend deployment fix
