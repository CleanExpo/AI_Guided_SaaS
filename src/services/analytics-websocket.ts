import { EventEmitter } from 'events';
import { io, Socket } from 'socket.io-client';

export interface RealtimeMetric {
  name: string;
  value: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface RealtimeEvent {
  type: 'metric' | 'event' | 'alert' | 'status';
  data: any;
  timestamp: Date;
}

export class AnalyticsWebSocket extends EventEmitter {
  private socket: Socket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;
  private metrics: Map<string, RealtimeMetric> = new Map();
  
  constructor(
    private url: string = process.env.NEXT_PUBLIC_ANALYTICS_WS_URL || 'ws://localhost:3001'
  ) {
    super();
  }
  
  connect(): void {
    if (this.socket?.connected) return;
    
    this.socket = io(this.url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });
    
    this.setupEventHandlers();
  }
  
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.emit('disconnected');
  }
  
  subscribe(channels: string[]): void {
    if (!this.socket || !this.isConnected) {
      console.warn('WebSocket not connected');
      return;
    }
    
    this.socket.emit('subscribe', channels);
  }
  
  unsubscribe(channels: string[]): void {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('unsubscribe', channels);
  }
  
  sendMetric(metric: RealtimeMetric): void {
    if (!this.socket || !this.isConnected) {
      console.warn('WebSocket not connected, queueing metric');
      return;
    }
    
    this.socket.emit('metric', metric);
  }
  
  getMetric(name: string): RealtimeMetric | undefined {
    return this.metrics.get(name);
  }
  
  getAllMetrics(): RealtimeMetric[] {
    return Array.from(this.metrics.values());
  }
  
  private setupEventHandlers(): void {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.emit('connected');
      console.log('Analytics WebSocket connected');
      
      // Subscribe to default channels
      this.subscribe(['metrics', 'alerts', 'events']);
    });
    
    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.emit('disconnected', reason);
      console.log('Analytics WebSocket disconnected:', reason);
      
      // Attempt reconnection for certain disconnect reasons
      if (reason === 'io server disconnect' || reason === 'transport close') {
        this.scheduleReconnect();
      }
    });
    
    this.socket.on('error', (error) => {
      console.error('Analytics WebSocket error:', error);
      this.emit('error', error);
    });
    
    // Handle incoming metrics
    this.socket.on('metric', (data: RealtimeMetric) => {
      this.metrics.set(data.name, {
        ...data,
        timestamp: new Date(data.timestamp)
      });
      this.emit('metric', data);
    });
    
    // Handle batch metrics update
    this.socket.on('metrics_batch', (metrics: RealtimeMetric[]) => {
      metrics.forEach(metric => {
        this.metrics.set(metric.name, {
          ...metric,
          timestamp: new Date(metric.timestamp)
        });
      });
      this.emit('metrics_batch', metrics);
    });
    
    // Handle real-time events
    this.socket.on('event', (event: RealtimeEvent) => {
      this.emit('event', {
        ...event,
        timestamp: new Date(event.timestamp)
      });
    });
    
    // Handle alerts
    this.socket.on('alert', (alert: any) => {
      this.emit('alert', alert);
    });
    
    // Handle status updates
    this.socket.on('status', (status: any) => {
      this.emit('status', status);
    });
  }
  
  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      console.log('Attempting to reconnect Analytics WebSocket...');
      this.connect();
    }, 5000);
  }
}

// Singleton instance
let wsInstance: AnalyticsWebSocket | null = null;

export function getAnalyticsWebSocket(): AnalyticsWebSocket {
  if (!wsInstance) {
    wsInstance = new AnalyticsWebSocket();
  }
  return wsInstance;
}

// React Hook for WebSocket
export function useAnalyticsWebSocket() {
  const [connected, setConnected] = React.useState(false);
  const [metrics, setMetrics] = React.useState<Map<string, RealtimeMetric>>(new Map());
  const ws = React.useRef<AnalyticsWebSocket | null>(null);
  
  React.useEffect(() => {
    ws.current = getAnalyticsWebSocket();
    
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleMetric = (metric: RealtimeMetric) => {
      setMetrics(prev => new Map(prev).set(metric.name, metric));
    };
    const handleMetricsBatch = (batch: RealtimeMetric[]) => {
      setMetrics(prev => {
        const updated = new Map(prev);
        batch.forEach(metric => updated.set(metric.name, metric));
        return updated;
      });
    };
    
    ws.current.on('connected', handleConnect);
    ws.current.on('disconnected', handleDisconnect);
    ws.current.on('metric', handleMetric);
    ws.current.on('metrics_batch', handleMetricsBatch);
    
    ws.current.connect();
    
    return () => {
      ws.current?.off('connected', handleConnect);
      ws.current?.off('disconnected', handleDisconnect);
      ws.current?.off('metric', handleMetric);
      ws.current?.off('metrics_batch', handleMetricsBatch);
    };
  }, []);
  
  const subscribe = React.useCallback((channels: string[]) => {
    ws.current?.subscribe(channels);
  }, []);
  
  const unsubscribe = React.useCallback((channels: string[]) => {
    ws.current?.unsubscribe(channels);
  }, []);
  
  const sendMetric = React.useCallback((metric: RealtimeMetric) => {
    ws.current?.sendMetric(metric);
  }, []);
  
  return {
    connected,
    metrics,
    subscribe,
    unsubscribe,
    sendMetric,
    ws: ws.current
  };
}

// Import React only when needed
const React = typeof window !== 'undefined' ? require('react') : null;