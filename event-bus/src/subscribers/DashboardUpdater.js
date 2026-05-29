// PATTERN: Observer
// RATIONALE: Dashboard receives push updates when incidents change state or new alerts arrive

class DashboardUpdater {
    constructor(websocketManager) {
        this.websocketManager = websocketManager;
        this.clients = new Set();
    }

    update(event) {
        const message = JSON.stringify({
            type: event.type,
            data: event.data,
            timestamp: event.timestamp
        });

        // Broadcast to all connected WebSocket clients
        if (this.websocketManager) {
            this.websocketManager.broadcast(message);
        }
        
        console.log(`[DashboardUpdater] Pushed ${event.type} to dashboard`);
    }

    addClient(client) {
        this.clients.add(client);
    }

    removeClient(client) {
        this.clients.delete(client);
    }
}

module.exports = DashboardUpdater;