import asyncio
import httpx
import websockets

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


async def run_websocket_client(client_id: int, message_to_send: str):
    """Simulates a single WebSocket client."""
    uri = "ws://localhost:8000/ws"
    try:
        async with websockets.connect(uri) as websocket:
            print(f"[Client {client_id}] Connected to {uri}")

            # The first client sends a message, the second one just listens
            if client_id == 1:
                await asyncio.sleep(1) # wait for client 2 to connect
                print(f"[Client {client_id}] Sending: '{message_to_send}'")
                await websocket.send(message_to_send)

            # Both clients will try to receive messages
            # We'll set a timeout to prevent waiting forever
            try:
                # First message is connection confirmation or other client's message
                message = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                print(f"[Client {client_id}] Received: {message}")
                # Second message (for client 1, it's its own broadcasted message)
                message = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                print(f"[Client {client_id}] Received: {message}")
            except asyncio.TimeoutError:
                print(f"[Client {client_id}] Stopped listening due to timeout.")

    except (websockets.exceptions.ConnectionClosedError, ConnectionRefusedError) as e:
        print(f"[Client {client_id}] Connection failed: {e}")


async def main():
    """Runs the verification tests."""
    # Test the HTTP endpoint first
    await test_dice_roller()

    # Now test the WebSocket broadcasting
    print("--- Testing WebSocket Broadcast ---")
    message = "hello from client 1"

    # Create two client tasks
    client1_task = asyncio.create_task(run_websocket_client(client_id=1, message_to_send=message))
    client2_task = asyncio.create_task(run_websocket_client(client_id=2, message_to_send=""))

    # Run them concurrently
    await asyncio.gather(client1_task, client2_task)
    print("--- WebSocket Test Finished ---")


if __name__ == "__main__":
    asyncio.run(main())
