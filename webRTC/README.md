# 📞 WebRTC Video Call App

A simple 1-to-1 peer-to-peer video calling application using **WebRTC** for media connection, **WebSocket** for signaling, and **Next.js** as the frontend framework.

---

## 🧱 Tech Stack

| Part       | Stack                         |
|------------|-------------------------------|
| Frontend   | [Next.js](https://nextjs.org) (App Router, Tailwind CSS, TypeScript) |
| Signaling  | Node.js, WebSocket (`ws`)     |
| WebRTC     | Native Web APIs (`RTCPeerConnection`, `getUserMedia`) |
| Style      | Tailwind CSS                  |

---

## 📁 Project Structure

```
webRTC/
├── my-next-app/           # Frontend (Next.js)
│   └── app/page.tsx       # Video call UI and logic
├── signaling-server/      # Backend signaling server
│   └── src/index.ts       # WebSocket signaling logic
├── package.json           # Root package (if using monorepo style)
└── README.md              # ← you are here
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/webrtc.git
cd webrtc
```

### 2. Install dependencies

Install both frontend and backend dependencies:

```bash
# for root (if workspaces set up)
npm install

# or manually
cd signaling-server && npm install
cd ../my-next-app && npm install
```

### 3. Start the signaling server

```bash
cd signaling-server
npm run dev
# WebSocket runs on ws://localhost:3001
```

### 4. Start the frontend

```bash
cd ../my-next-app
npm run dev
# App runs on http://localhost:3000
```

---

## 🧪 How to Test

1. Open [http://localhost:3000](http://localhost:3000) in **two tabs or devices**.
2. Enter the same room name (e.g. `demo`) in both.
3. Click **"Join Room"** on both.
4. Allow camera/mic access when prompted.
5. You should see live local and remote video.

> 📌 Make sure both the signaling server and frontend are running locally.

---

## 🛠 TODOs

* [ ] Add "Leave Room" feature
* [ ] Show connection status (connected/disconnected)
* [ ] Handle permission or device errors
* [ ] Support TURN server fallback (for strict NATs)
* [ ] Add support for chat/messages

---

## 📦 Deployment

You can deploy the frontend using:
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)

And the signaling server to:
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Fly.io](https://fly.io)

> You’ll need to update the WebSocket URL (`ws://localhost:3001`) in the frontend to your deployed server’s address (e.g. `wss://your-signaling-server.com/ws`).

---

## 📚 Learn More

- [WebRTC Overview – MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebSocket MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🪪 License

MIT — free to use, modify, and share.

---

Made with ❤️ for learning purposes.
