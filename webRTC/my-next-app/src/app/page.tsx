"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [room, setRoom] = useState("test-room");
  const [joined, setJoined] = useState(false);

  const signalingServerURL = "ws://localhost:3001";

  const config: RTCConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const handleJoin = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideo.current) {
      localVideo.current.srcObject = localStream;
    }

    socketRef.current = new WebSocket(signalingServerURL);

    socketRef.current.onopen = () => {
      socketRef.current?.send(JSON.stringify({ type: "join", room }));
    };

    socketRef.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "ready") {
        createPeer(true, localStream);
      } else if (message.type === "offer") {
        createPeer(false, localStream);
        await peerRef.current?.setRemoteDescription(message.payload);
        const answer = await peerRef.current?.createAnswer();
        await peerRef.current?.setLocalDescription(answer!);
        socketRef.current?.send(
          JSON.stringify({ type: "answer", room, payload: answer })
        );
      } else if (message.type === "answer") {
        await peerRef.current?.setRemoteDescription(message.payload);
      } else if (message.type === "candidate") {
        await peerRef.current?.addIceCandidate(message.payload);
      } else if (message.type === "peer-left") {
        if (remoteVideo.current) remoteVideo.current.srcObject = null;
        peerRef.current?.close();
        peerRef.current = null;
        alert("Peer disconnected");
      }
    };

    setJoined(true);
  };

  const createPeer = (initiator: boolean, stream: MediaStream) => {
    peerRef.current = new RTCPeerConnection(config);

    peerRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.send(
          JSON.stringify({ type: "candidate", room, payload: e.candidate })
        );
      }
    };

    peerRef.current.ontrack = (e) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = e.streams[0];
      }
    };

    stream.getTracks().forEach((track) =>
      peerRef.current?.addTrack(track, stream)
    );

    if (initiator) {
      peerRef.current
        .createOffer()
        .then((offer) => peerRef.current?.setLocalDescription(offer))
        .then(() =>
          socketRef.current?.send(
            JSON.stringify({
              type: "offer",
              room,
              payload: peerRef.current?.localDescription,
            })
          )
        );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">WebRTC Video Call</h1>

      {!joined && (
        <>
          <input
            className="text-black px-3 py-1 rounded"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            onClick={handleJoin}
          >
            Join Room
          </button>
        </>
      )}

      <div className="flex gap-4">
        <div>
          <p className="text-center text-sm">You</p>
          <video ref={localVideo} autoPlay muted playsInline className="rounded-lg border" />
        </div>
        <div>
          <p className="text-center text-sm">Peer</p>
          <video ref={remoteVideo} autoPlay playsInline className="rounded-lg border" />
        </div>
      </div>
    </main>
  );
}
