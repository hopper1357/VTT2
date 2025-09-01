import random
import uuid
import json
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
from backend.module_loader import discover_modules

app = FastAPI()

# CORS Middleware
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Discover and load modules on startup
available_modules = discover_modules()

# Mount static directories for each module
for module in available_modules:
    module_id = module.get("id")
    if module_id:
        module_path = os.path.join("modules", module_id)
        if os.path.isdir(module_path):
            app.mount(f"/modules/{module_id}", StaticFiles(directory=module_path), name=module_id)
            print(f"Mounted module '{module_id}' at /modules/{module_id}")


html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

class GameState:
    """Manages the overall state of the game session."""
    def __init__(self):
        self.players: Dict[str, Dict] = {}

    def add_player(self, client_id: str):
        if client_id not in self.players:
            self.players[client_id] = {"id": client_id}
            print(f"Player {client_id} added to game state.")

    def remove_player(self, client_id: str):
        if client_id in self.players:
            del self.players[client_id]
            print(f"Player {client_id} removed from game state.")

class ConnectionManager:
    """Manages active WebSocket connections."""
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def send_personal_message(self, payload: Dict, client_id: str):
        message = json.dumps(payload)
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)

    async def broadcast(self, payload: Dict):
        message = json.dumps(payload)
        for connection in self.active_connections.values():
            await connection.send_text(message)

# Create single instances of the managers
manager = ConnectionManager()
game_state = GameState()

@app.get("/")
async def get():
    return HTMLResponse(html)


@app.get("/api/modules", response_model=List[Dict])
async def get_modules():
    """Returns a list of available modules."""
    return available_modules


@app.get("/roll/{dice_string}")
async def roll_dice(dice_string: str):
    try:
        num_dice, die_type = map(int, dice_string.lower().split('d'))
        rolls = [random.randint(1, die_type) for _ in range(num_dice)]
        return {"result": sum(rolls), "rolls": rolls}
    except ValueError:
        return {"error": "Invalid dice string format. Use 'NdN', e.g., '2d6'."}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    client_id = str(uuid.uuid4())
    await manager.connect(websocket, client_id)
    game_state.add_player(client_id)

    # Send the new client their ID and the current game state
    await manager.send_personal_message(
        {"type": "connection_ready", "payload": {"client_id": client_id, "game_state": game_state.players}},
        client_id
    )

    # Broadcast the new player's arrival to everyone else
    await manager.broadcast(
        {"type": "player_join", "payload": game_state.players[client_id]}
    )

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            # For now, we only handle chat messages
            if message.get("type") == "chat_message":
                await manager.broadcast({
                    "type": "chat_message",
                    "payload": {"from": client_id, "text": message["payload"]["text"]}
                })

    except WebSocketDisconnect:
        manager.disconnect(client_id)
        game_state.remove_player(client_id)
        await manager.broadcast(
            {"type": "player_leave", "payload": {"client_id": client_id}}
        )
