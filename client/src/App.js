import React, { useState } from "react";
import "./App.css";
import {Router, navigate} from "@reach/router"
// import Chat from "./components/Chat"
import Chat from "./components/chat_component/Chat";
import Index from "./components/index_component/Index";
import Create from "./components/create_component/Create";
import Join from "./components/join_component/Join";

function App() {
  const [roomSize,setRoomSize] =useState();
  const createRoom = (room,username, roomsize) => {
    setRoomSize(roomsize);
    roomsize === null ?
    navigate(`/create/room`)
    :
    navigate(`/chat/${room}/${username}`)
  };
  
  const joinRoom = (room,username) => {

    navigate(`/chat/${room}/${username}`)

  };


  const pick_a_choice = (choice)=>
  {return(
    choice && choice === "CREATE"?
    navigate(`/create/room`)
    :
    choice === "JOIN"?
    navigate(`/join/room`):
    ""
  )}
  return (
    <div className="App">
      <main>
        <Router style={{width:'inherit', height:'inherit'}}>
          <Index path="/" pick_choice={pick_a_choice}/>
          <Create path="/create/room" createRoom={createRoom}/>
          <Join path="/join/room" joinRoom={joinRoom}/> 
          <Chat path="/chat/:room/:name" room_size = {roomSize}/>
        </Router>
      </main>
    </div>
  );
}

export default App;
