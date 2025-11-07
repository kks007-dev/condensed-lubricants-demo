import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "http://127.0.0.1:5173",
      "https://lubricants-voice-demo-v2.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active demo sessions
const activeSessions = new Map();

// Demo step definitions matching your frontend
const DEMO_STEPS = {
  'initial': {
    id: 1,
    name: "Initial View",
    status: "Pending",
    strikePallets: false,
    capacity: { percent: 70, note: "70% of safe threshold" },
    bannerKey: "info",
    message: "Order accessed and reviewing details."
  },
  'freight-setup': {
    id: 2,
    name: "Freight Forwarder Setup",
    status: "Ready for Scheduling",
    strikePallets: false,
    capacity: { percent: 84, note: "84% of safe threshold" },
    bannerKey: "info",
    message: "Confirm Pickup\nFreight Forwarder: BlueBridge Freight\nPickup Date: 10 Oct 2025"
  },
  'confirmation': {
    id: 3,
  name: "Confirmation Received",
  status: "Scheduled for Pickup",
    strikePallets: false,
    capacity: { percent: 84, note: "84% of safe threshold" },
    bannerKey: "success",
    message: "\u2705 Shipment Confirmed\nFreight Forwarder: BlueBridge Freight\nPickup Date: 10 Oct 2025"
  },
  'contingency': {
    id: 4,
  name: "Contingency Preferences",
  status: "Scheduled for Pickup",
    strikePallets: false,
    capacity: { percent: 84, note: "84% of safe threshold" },
    bannerKey: "info",
    message: "Product Substitution Preferences\n\u2022 If Premium Hydraulic Oil ISO VG 32 unavailable \u2192 use Synthetic 32\n\u2022 If FleetGuard 15W-40 unavailable \u2192 omit pallet"
  },
  'final-confirmation': {
    id: 5,
  name: "Final Confirmation",
  status: "Scheduled for Pickup",
    strikePallets: false,
    capacity: { percent: 84, note: "84% of safe threshold" },
    bannerKey: "success",
    message: "\u2705 All updates verified"
  }
};

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  // Create a new demo session
  const sessionId = uuidv4();
  activeSessions.set(sessionId, {
    socketId: socket.id,
    currentStep: 'initial',
    connectedAt: new Date(),
    history: [
      {
        step: 'initial',
        timestamp: new Date().toISOString()
      }
    ]
  });
  socket.emit('session-created', { sessionId });
  socket.emit('demo-step', { ...DEMO_STEPS['initial'], timestamp: new Date().toISOString() });
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    // Clean up session
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.socketId === socket.id) {
        activeSessions.delete(sessionId);
        break;
      }
    }
  });
});

// Webhook endpoints for voice agent
app.post('/webhook/demo-step', (req, res) => {
  const { step, sessionId, message } = req.body;
  
  console.log(`Received demo step request: ${step} for session: ${sessionId}`);
  
  if (!step || !DEMO_STEPS[step]) {
    return res.status(400).json({ error: 'Invalid step specified' });
  }
  
  // If sessionId provided, send to specific session
  if (sessionId) {
    const session = activeSessions.get(sessionId);
    if (session) {
      const socket = io.sockets.sockets.get(session.socketId);
      if (socket) {
        const stepData = { ...DEMO_STEPS[step], timestamp: new Date().toISOString() };
        if (message) {
          stepData.message = message;
        }
        socket.emit('demo-step', stepData);
        session.currentStep = step;
        session.history.push({ step, timestamp: stepData.timestamp });
        return res.json({ success: true, message: 'Step sent to specific session' });
      }
    }
    return res.status(404).json({ error: 'Session not found' });
  }
  
  // Broadcast to all connected clients
  const stepData = { ...DEMO_STEPS[step], timestamp: new Date().toISOString() };
  if (message) {
    stepData.message = message;
  }
  io.emit('demo-step', stepData);
  // Update history for all sessions
  for (const session of activeSessions.values()) {
    session.currentStep = step;
    session.history.push({ step, timestamp: stepData.timestamp });
  }
  res.json({ success: true, message: 'Step broadcast to all sessions' });
});

// Specific webhook endpoints for each tool from your workflow
// Removed unfillable/suggestions/update webhook endpoints for condensed demo

app.post('/webhook/call-freighter', (req, res) => {
  console.log('Call freighter webhook triggered');
  io.emit('demo-step', DEMO_STEPS['freight-setup']);
  res.json({ success: true, step: 'freight-setup' });
});

app.post('/webhook/confirm-pickup', (req, res) => {
  console.log('Confirm pickup webhook triggered');
  io.emit('demo-step', DEMO_STEPS['confirmation']);
  res.json({ success: true, step: 'confirmation' });
});

app.post('/webhook/set-backups', (req, res) => {
  console.log('Set backups webhook triggered');
  io.emit('demo-step', DEMO_STEPS['contingency']);
  res.json({ success: true, step: 'contingency' });
});

app.post('/webhook/send-email', (req, res) => {
  console.log('Send email webhook triggered');
  io.emit('demo-step', DEMO_STEPS['final-confirmation']);
  res.json({ success: true, step: 'final-confirmation' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    activeSessions: activeSessions.size,
    timestamp: new Date().toISOString()
  });
});

// Get active sessions (for debugging)
app.get('/sessions', (req, res) => {
  const sessions = Array.from(activeSessions.entries()).map(([id, session]) => ({
    sessionId: id,
    socketId: session.socketId,
    currentStep: session.currentStep,
    connectedAt: session.connectedAt
  }));
  res.json({ sessions });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  console.log(`🔗 WebSocket endpoint: ws://localhost:${PORT}`);
});
