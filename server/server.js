const express = require('express')
const app = express()
const cors = require("cors")
const socket = require("socket.io")
const {getListOfUsersByRoomId,
   getListOfRooms, createRoom, getRoomById, 
   removeRoomById, removePlayerFromRoom
  } = require("./utils");

app.use(express.json()); // This is new
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


app.post('/get-room', async (req, res) => {
  const roomExists = await getRoomById(req.body['room'])
  console.log(roomExists);
  // res.send('Hello World!')
  if(!roomExists){
    
    return res.status(500).send("room does not exist!")
  }
  res.send('Hello World!')

})


app.use(cors())
app.use(express.json())
const server = app.listen("8000", () => {
  console.log(`Example app listening at http://localhost:8000`)
})


//initiating the socket with Cors
const io = socket(server,{
  cors:{
    origin:true,
    credentials:true
  }
});

io.on("connection", (socket) => {
  /**
   * the socket starts to listen on the event connection to happen from the client side
   * when connected it takes socket object from the client
   */
  socket.on("join_room", (data, callback) => {
    socket.username = data.username;
    socket.roomId = data.room;
    socket.join(data.room);
    console.log("room size: ",data.room_size)
    const newUser = {id:data.id, username:data.username, room:data.room}
    const newRoom = createRoom(data.room, data.id, true, newUser, parseInt(data.room_size));
    const getRoomId = getRoomById(socket.roomId)
    if(getRoomId.players.length-1 >= getRoomId.roomSize){
      callback({
        status: "ROOM_FULL",
        room:getRoomById(socket.roomId)
      });
      return;
    }
    
    socket.to(socket.roomId).emit("welcome_message", getListOfUsersByRoomId(socket.roomId));
    callback({
      status: "ok",
      room:getRoomById(socket.roomId),
      users: getListOfUsersByRoomId(socket.roomId),
    });
    socket.to(data.room).emit("receive_message", {
      room: data.room,
      content: {
        author: "Server",
        message:`${data.username}: joined the Room room`
      }
  });
    
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("close_room",(data)=>{
    if (!getRoomById(data.room)) return
    if(data.id == getRoomById(data.room).host){
      removeRoomById(data.room);
      socket.to(data.room).emit("host_closed_room", {
          room: data.room,
          content: {
            author: "Server",
            message:`${data.username}: Host closed the room`
          }
      });
    }
    

  })

  socket.on("remove_player",(data)=>{
    console.log("player closed the window")
    removePlayerFromRoom(data.id, data.username, data.room);
    socket.to(data.room).emit("welcome_message", getListOfUsersByRoomId(data.room));// send back the new list after removing a user
    getListOfUsersByRoomId(data.room) 
    && getListOfUsersByRoomId(data.room).length <2 
    && socket.to(data.room).emit("receive_message", {
        room: data.room,
        content: {
          author: "Server",
          message:`${data.username}: has been disconnected from room`
        }
    });
  })
  socket.on("disconnect", () => {// if a client disconnected then remove the handshake from the sockets arrray
    socket.disconnect()
    console.log("USER DISCONNECTED");
  });
});