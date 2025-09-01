class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event, ...args) {
        const listeners = this.events[event];
        if (typeof listeners === 'object') {
            listeners.forEach(listener => listener.apply(this, args));
        }
    }

    off(event, listener) {
        const listeners = this.events[event];
        if (typeof listeners === 'object') {
            const idx = listeners.indexOf(listener);
            if (idx > -1) {
                listeners.splice(idx, 1);
            }
        }
    }
}

class WebSocketService {
    constructor() {
        this.socket = null;
        this.emitter = new EventEmitter();
    }

    connect(url = "ws://localhost:8000/ws") {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            console.log("WebSocket is already connected or connecting.");
            return;
        }

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WebSocket connected");
            this.emitter.emit('open');
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log("Received message:", message);
                if (message.type) {
                    this.emitter.emit(message.type, message.payload);
                }
            } catch (error) {
                console.error("Error parsing message:", event.data, error);
            }
        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected");
            this.emitter.emit('close');
            this.socket = null; // Ensure we can reconnect
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            this.emitter.emit('error', error);
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    send(type, payload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type, payload });
            this.socket.send(message);
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    on(event, listener) {
        this.emitter.on(event, listener);
    }

    off(event, listener) {
        this.emitter.off(event, listener);
    }
}

// Export a singleton instance
const websocketService = new WebSocketService();
export default websocketService;
