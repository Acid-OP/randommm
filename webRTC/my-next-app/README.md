# 🎥 WebRTC Frontend – Next.js

This is the frontend for a simple 1‑to‑1 video calling app using [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) and a WebSocket signaling server.  
Built with [Next.js](https://nextjs.org) using the App Router, Tailwind CSS, and TypeScript.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in **two different tabs or browsers**, enter the same room name, and click **"Join Room"** to test video calling.

> 📌 Make sure the **signaling server** is also running (usually at `ws://localhost:3001`).

---

## 🧠 Features

* 🔁 WebSocket-based signaling (offer/answer/candidates)
* 📹 WebRTC peer-to-peer connection
* 🧪 Uses `getUserMedia` and `RTCPeerConnection`
* 🎨 Styled with Tailwind CSS

---

## 🧩 File Structure

```
my-next-app/
├── app/
│   └── page.tsx       # main UI & logic for video calling
├── public/
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔗 Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [WebRTC MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
* [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

## 📦 Deployment

The frontend can be deployed using:

* [Vercel](https://vercel.com)
* [Netlify](https://netlify.com)
* Or your own server

To deploy, make sure the signaling server is also deployed and accessible via a WebSocket URL (e.g. `wss://your-domain.com/ws`).

---

## 🛠 TODO

* [ ] Add "Leave Room" button
* [ ] Handle camera/mic permissions errors
* [ ] Improve UI with participant names or status
* [ ] Add TURN server support for strict NATs
