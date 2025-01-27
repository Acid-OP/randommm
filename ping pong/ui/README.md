# WebSocket Ping-Pong (React)

This is the **React frontend** for a real-time singleplayer Ping-Pong game, where players can interact via WebSocket for seamless communication with the server. The game features a simple setup  real-time updates with an alert. It communicates with a WebSocket server for syncing the game state between players.

## Features

- **WebSocket Connectivity:** Establishes a WebSocket connection to the backend to synchronize game state between players.
- **Send Messages via WebSocket:** Allows sending messages to the server through a text input field.
- **Real-Time Feedback:** Alerts the user when messages are received from the server.

## Tech Stack

- **Frontend:** React.js
- **WebSocket:** For real-time communication with the server

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/websocket-pingpong.git
cd websocket-pingpong
```

Frontend Setup
Navigate to the project directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the React application:
```bash
npm start
```
The React app will be available at http://localhost:3000

WebSocket Connection
The app connects to the WebSocket server at ws://localhost:8080. Once connected, the client can send and receive game data such as player positions, scores, and game events. This communication happens in real-time through WebSocket messages.

How It Works
WebSocket Connection: The app connects to the WebSocket server as soon as the component mounts (useEffect).
```javascript
const ws = new WebSocket("ws://localhost:8080");
setSocket(ws);
```
Sending Messages: Users can type a message in the input field and click "Send" to send the message to the WebSocket server. The message is transmitted using:

```javascript
socket.send(message);
Receiving Messages: Whenever the WebSocket server sends a message (such as game state updates), the app receives it through the onmessage event handler and displays it via an alert:
```
```javascript
ws.onmessage = (ev) => {
  alert(ev.data);
};
```
React State & Refs: The app uses useState to manage the WebSocket connection and useRef to reference the input field.

License
This project is licensed under the MIT License.

