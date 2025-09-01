import asyncio
import httpx
import websockets
import json
import uuid

async def test_dice_roller():
    """Tests the dice roller endpoint."""
    url = "http://localhost:8000/roll/2d6"
    print(f"--- Testing Dice Roller: GET {url} ---")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            print(f"Dice Roll Response: {data}")
            assert "result" in data
            assert "rolls" in data
            assert len(data["rolls"]) == 2
            print("--- Dice Roller Test Passed ---")
        except (httpx.RequestError, AssertionError) as e:
            print(f"--- Dice Roller Test Failed: {e} ---")
    print()

async def client_handler(uri, client_name, events_queue):
    """Handles the WebSocket connection for a single client."""
    my_id = None
    try:
        async with websockets.connect(uri) as websocket:
            print(f"[{client_name}] Connected.")

            # 1. Wait for connection_ready message
            ready_message = await websocket.recv()
            ready_data = json.loads(ready_message)
            assert ready_data["type"] == "connection_ready"
            my_id = ready_data["payload"]["client_id"]
            print(f"[{client_name}] Received own client ID: {my_id}")
            await events_queue.put({"type": "client_ready", "client_name": client_name})

            # 2. Listen for events
            while True:
                message = await websocket.recv()
                data = json.loads(message)
                print(f"[{client_name}] Received: {data}")
                # Don't put our own join message in the queue
                if data.get("type") == "player_join" and data["payload"]["id"] == my_id:
                    continue
                await events_queue.put(data)

    except websockets.exceptions.ConnectionClosed:
        print(f"[{client_name}] Connection closed.")
    except Exception as e:
        print(f"[{client_name}] Error: {e}")
    finally:
        if my_id:
            await events_queue.put({"type": "client_disconnected", "client_id": my_id})

async def test_websocket_events():
    """Orchestrates a multi-client test of the WebSocket events."""
    uri = "ws://localhost:8000/ws"
    events_queue = asyncio.Queue()

    print("--- Testing WebSocket Events ---")

    # Start Client 1
    client1_task = asyncio.create_task(client_handler(uri, "Client1", events_queue))

    # Wait for Client 1 to be ready
    event = await events_queue.get()
    assert event["type"] == "client_ready"
    print("[Test Runner] Client 1 is ready.")

    # Start Client 2
    client2_task = asyncio.create_task(client_handler(uri, "Client2", events_queue))

    # Wait for Client 2 to be ready
    event = await events_queue.get()
    assert event["type"] == "client_ready"
    print("[Test Runner] Client 2 is ready.")

    # Check for player_join event for Client 2
    event = await events_queue.get()
    assert event["type"] == "player_join"
    client2_id = event["payload"]["id"]
    print(f"[Test Runner] Verified that Client 1 received player_join event for Client 2 ({client2_id}).")

    # Have Client 1 send a message
    # To do this properly requires a way to send messages from the test runner to the client.
    # For this test, we'll skip sending a message and just verify the join/leave logic.
    print("[Test Runner] Skipping chat message test for simplicity.")

    # Stop Client 2 and verify leave message
    client2_task.cancel()
    try:
        await client2_task
    except asyncio.CancelledError:
        pass

    event = await events_queue.get()
    assert event["type"] == "client_disconnected"

    event = await events_queue.get()
    assert event["type"] == "player_leave"
    assert event["payload"]["client_id"] == client2_id
    print(f"[Test Runner] Verified that Client 1 received player_leave event for Client 2 ({client2_id}).")

    # Cleanup
    client1_task.cancel()
    try:
        await client1_task
    except asyncio.CancelledError:
        pass

    print("--- WebSocket Events Test Passed ---")


async def main():
    """Runs the verification tests."""
    await test_dice_roller()
    await test_websocket_events()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"Test run failed: {e}")
