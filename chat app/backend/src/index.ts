import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 8080});
interface User{
    socket: WebSocket;
    room:string
}

let rooms:{ [roomId: string]: WebSocket[] } = {};

wss.on("connection",(socket:WebSocket) => {
    socket.on("message",(message:string) => {
        const data = JSON.parse(message);
        const {type , payload} = data;

        if(type === "join"){
            const{roomId} = payload;
            if(!rooms[roomId]){
                rooms[roomId] = [];
            }
            rooms[roomId].push(socket);
            (socket as any).roomId = roomId;
            
        }

        if(type === "chat"){
            const{message:ChatMessage} = payload;
            const room = rooms[(socket as any).roomId];
            if(room){
                room.forEach((user) => {
                    user.send(ChatMessage);
                })
            }
}})
})