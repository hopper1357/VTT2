# Universal Virtual Tabletop (UVTT)

## 📖 Project Description

Universal Virtual Tabletop (UVTT) is a cross-platform, multiplayer-capable virtual tabletop application designed to be highly modular and customizable. It features a Python backend engine and a JavaScript-based module system, allowing users to define game-specific logic and user interfaces for various tabletop RPGs.

The core technologies are:
- **Backend:** Python with FastAPI and WebSockets for the core game logic and multiplayer synchronization.
- **Frontend:** React with CSS Grid, Portals, and `react-dnd` for a flexible and interactive UI.
- **Modules:** A JavaScript-based system to allow for community-created game systems.

## ⚙️ Requirements & Setup

### Requirements
- Python 3.8+
- `pip`

### Running the Backend Server
1.  **Install dependencies:**
    ```bash
    pip install -r backend/requirements.txt
    ```
2.  **Start the server:**
    ```bash
    uvicorn backend.main:app --host 0.0.0.0 --port 8000
    ```
3.  The server will be running at `http://localhost:8000`. You can access the simple chat interface by navigating to this URL in your browser.

4.  **Run the verification script (optional):**
    To test the backend endpoints without a browser, you can run the test client.
    ```bash
    python backend/test_client.py
    ```

## ✅ Completed Tasks

### Backend
- **Core Engine:** Initialized a FastAPI application to serve as the core engine.
- **Stateful Multiplayer Sync:** Implemented a WebSocket endpoint (`/ws`) that manages player state (join/leave events) and broadcasts structured JSON messages.
- **Dice Rolling:** Created an HTTP endpoint (`/roll/{dice_string}`) to handle simple dice notation (e.g., `2d6`, `1d20`).
- **Verification:** Added a `test_client.py` script to verify backend functionality.

### Frontend
- **Application Scaffolding:** Set up a React application in the `frontend` directory using Create React App.
- **Core UI Layout:** Implemented the main UI structure with CSS Grid and placeholder components as defined in the design document.
- **State Management:** Created a global state provider using React Context to manage shared application state.
- **Backend Integration:** Established a WebSocket connection from the frontend to the backend to receive and display real-time game state (e.g., the list of online players).

## 📝 To-Do List (Project Roadmap)

This project will be developed in phases, as outlined in the design document. The next major steps are:

- **Phase 4: Module Runtime Loader:** Build the system for dynamically loading game-specific modules (character sheets, rules, etc.).
- **Phase 5: GUI Module Creator (MVP):** Create a basic tool to assist users in building their own modules.
- **Phase 6: UI Enhancements:** Add portals, modals, and pop-out windows for character sheets and other UI elements.
- **Phase 7: Advanced Game Mechanics:** Implement features for combat, initiative tracking, and status effects.
- **Phase 8: Polish & Documentation:** Community testing, bug fixing, and comprehensive documentation.
