import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 8080});
interface User{
    socket: WebSocket;
    room:string
}

let allsockets = [];
wss.on("connection" , (socket) => {
    socket.on("message" , (message) => {
        // @ts-ignore 
        const parsedMessage = JSON.parse(message);    
        
        if(parsedMessage.type === "join"){
            allsockets.push({
                socket,
                room : parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type === "chat"){
            let currentUserRoom = null;
            for(let i=0; i<allsockets.length; i++){
                if(allsockets[i].socket === socket){
                    currentUserRoom = allsockets[i].room
                }
            }

            for(let i=0 ; i<allsockets.length;i++){
                if(allsockets[i].room === currentUserRoom){
                    allsockets[i].socket.send(parsedMessage.payload.message)
                }
            }
        }
})
})