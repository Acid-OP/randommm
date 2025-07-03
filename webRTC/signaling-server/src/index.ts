import { WebSocketServer, WebSocket } from "ws";

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });
console.log(`📡 WebSocket signaling server running at ws://localhost:${PORT}`);

type Message =
  | { type: "join"; room: string }
  | { type: "offer" | "answer" | "candidate"; room: string; payload: any };

type ClientMeta = { room: string };
const clients = new Map<WebSocket, ClientMeta>();

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const msg: Message = JSON.parse(data.toString());

    if (msg.type === "join") {
      clients.set(ws, { room: msg.room });

      // If someone is already in the room, notify the new joiner
      const others = [...clients.entries()].filter(
        ([client, meta]) => client !== ws && meta.room === msg.room
      );
      if (others.length > 0) {
        ws.send(JSON.stringify({ type: "ready" }));
      }
      return;
    }

    // Relay signaling data to other peers in the room
    const peers = [...clients.entries()].filter(
      ([client, meta]) => client !== ws && meta.room === msg.room
    );
    for (const [peer] of peers) {
      peer.send(JSON.stringify(msg));
    }
  });

  ws.on("close", () => {
    const meta = clients.get(ws);
    clients.delete(ws);

    if (!meta) return;

    // Notify remaining peer in the same room
    const peers = [...clients.entries()].filter(
      ([, m]) => m.room === meta.room
    );
    for (const [peer] of peers) {
      peer.send(JSON.stringify({ type: "peer-left" }));
    }
  });
});
