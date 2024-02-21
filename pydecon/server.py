import asyncio
import websockets
import json
import base64

async def process_media(websocket, path):
    async for message in websocket:
        data = json.loads(message)

        if data['action'] == 'process':
            print(f"Processing {data['type']} media...")

            # Decode Base64 content and save it to a file
            if 'content' in data and 'filename' in data:
                media_content = base64.b64decode(data['content'])
                filename = data['filename']
                
                with open(filename, 'wb') as f:
                    f.write(media_content)
                    
                print(f"{filename} saved successfully.")

                # Assuming processing is done here (you can replace this with actual processing logic)
                await asyncio.sleep(1)  # Simulate some processing time

                completion_message = json.dumps({"status": "completed", "message": f"{filename} processed and saved successfully."})
                await websocket.send(completion_message)
            else:
                error_message = json.dumps({"status": "error", "message": "Invalid data received. Missing 'content' or 'filename'."})
                await websocket.send(error_message)

# Start the WebSocket server
start_server = websockets.serve(process_media, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()