import io from 'socket.io-client';

class SocketManager {
  socket = null;
  serverUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  connect(forceNew = false) {
    const token = localStorage.getItem('token');
    const tokenChanged = this.socket && this.socket.auth?.token !== token;

    if (this.socket && !forceNew && !tokenChanged) {
      if (this.socket.disconnected) {
        this.socket.connect();
      }
      return this.socket;
    }

    if (this.socket) {
      console.log('Socket token changed or forceNew requested - reconnecting...');
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(this.serverUrl, {
      auth: { token },
      transports: ['polling', 'websocket'],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.log('Socket connection error:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

const socketManager = new SocketManager();
export default socketManager;
