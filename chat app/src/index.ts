import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 8080});

let UserCount = 0;
let allsockets = [];
wss.on("connection" , (socket) => {
    allsockets.push(socket);
    UserCount = UserCount +1;
    console.log("user connected #"+ UserCount);

    socket.on("message" , (message) => {
        console.log("message recieved" + message.toString());
        for( let i = 0 ;  i<allsockets.length ; i++){
            const s = allsockets[i];
            s.send(message.toString() + " : sent from the server ");
        }
    })
})