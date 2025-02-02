import { useRef, useState } from 'react'
import './App.css'

function App() {
 const [isConnected , setisConnected] = useState<boolean>(false);
 const [messages, setMessages] = useState<any>([]);
 const [roomId , setroomId] = useState<string>("");
 const wsRef = useRef<WebSocket | null>(null);
 const inputRef = useRef<HTMLInputElement | null>(null);


 function connectToRoom() {
  const ws = new WebSocket('ws://localhost:8080');
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "join",
        payload: {
          roomId: roomId,
        },
      })
    );
    setisConnected(true);
  };

  ws.onmessage = (event) => {
    setMessages((prevMessages:any) => [...prevMessages , event.data]);
  };

  wsRef.current = ws
 }
 
 function sendMessage() {
  const message = inputRef.current?.value;
  if (message && wsRef.current) {


    wsRef.current.send(
      JSON.stringify({
        type: 'chat',
        payload: {
          message: message,
        },
      })
    );
  if (inputRef.current) {
    inputRef.current.value = '';
    }
 }
}

 return (

   <div className=''>
    {!isConnected ? (
      <div className="h-screen bg-black flex justify-center items-center ">
        <input type="text" placeholder="Enter room id" value={roomId} onChange={(e)=> setroomId(e.target.value)} className= "p-4 m-4 bg-amber-50 "></input>
        <button
            onClick={connectToRoom}
            className="bg-purple-600 text-white p-4"
          >
            Join Room
          </button>
      </div>
    ): 
    <div className="bg-black h-screen">
      <br /><br /><br />
      <div className="h-[85vh]">
     
      {messages.map((message:string , index:string) => (
              <div key={index} className="m-8">
                <span className="bg-white text-black rounded p-4">
                  {message}
                </span>
              </div>
            ))}
      </div>
      <div className="w-full bg-white flex">
            <input
              type="text"
              ref={inputRef}
              id="message"
              className="flex-1 p-4"
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white p-4"
            >
              Send Message
            </button>
          </div>
    </div>}
    </div>

    )}
  


export default App

