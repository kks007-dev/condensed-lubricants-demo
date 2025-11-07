import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketState {
  isConnected: boolean;
  sessionId: string | null;
  error: string | null;
}

interface DemoStep {
  id: number;
  name: string;
  status: string;
  strikePallets: boolean;
  capacity: {
    percent: number;
    note: string;
  };
  bannerKey: string;
  message: string;
}

export function useWebSocket(serverUrl: string = (import.meta as any).env?.VITE_WEBSOCKET_URL || 'http://localhost:3001') {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    sessionId: null,
    error: null
  });
  
  const [currentStep, setCurrentStep] = useState<DemoStep | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    console.log('Attempting to connect to WebSocket server:', serverUrl);
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setState(prev => ({
        ...prev,
        isConnected: true,
        error: null
      }));
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: reason === 'io server disconnect' ? 'Server disconnected' : 'Connection lost'
      }));
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: 'Failed to connect to server'
      }));
    });

    // Demo-specific event handlers
    socket.on('session-created', (data: { sessionId: string }) => {
      console.log('Session created:', data.sessionId);
      setState(prev => ({
        ...prev,
        sessionId: data.sessionId
      }));
    });

    socket.on('demo-step', (stepData: DemoStep) => {
      console.log('Received demo step:', stepData);
      setCurrentStep(stepData);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl]);

  const reconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
  };

  const sendMessage = (event: string, data: any) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    ...state,
    currentStep,
    reconnect,
    sendMessage,
    socket: socketRef.current
  };
}
