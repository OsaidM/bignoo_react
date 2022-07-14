import React, { useState, useEffect } from "react";
import { 
   addToArr,
   isInside,
   keepAddingUntillFilled,
   drawThatMatrix,
   changeToMinus,
   countRow,
   countColumn,
   countCross,
   openCongratsPage1,
   winCondition,
   startFromRNDMSart,
   addTdListners,

 } from '../GameUtils.js';
import "./style_game.css"
import {Link, navigate} from "@reach/router"
import io from "socket.io-client";
import ChatHeader from "../ChatHeader";

let arrColor=['#ffe0b2','#ffecb3','#ffe082','#ffcc80','#ffb74d',
'#ffd180', '#ffab40','#ffd740','#ffe57f','#ffc400',
'#f0f4c3','#f4ff81','#9e9e9e','#ef9a9a','#ff8a80',
'#fbe9e7','#ffccbc','#ffab91','#ff8a65','#ff9e80',
'#eceff1','#cfd8dc','#b0bec5','#bcaaa4','#a1887f']


const Chat = (props) => {

    const {room, name, room_size} = props;
    const [socket] = useState(()=> io(":8000"));
    // After Login
    const [bingo, setBingo] = useState(['B','I','N','G','O']);
    const [boxesList, setBoxesList] = useState([[],[],[],[],[]]);
    const [users, setUsers] = useState([]);
    const [getCurrentUser, setCurrentUser] = useState({id:socket.id, username:name, room});
    const [turnStatus, setTurnStatus] = useState(0);
    const [boxesCount, setBoxesCount] = useState(0);
    const [rndmStart, setRndmStart] =  useState(Math.round(Math.random() * 1));
    const [lastPickedValue, setLastPickedValue] = useState(0);

  useEffect(()=>{
    setBoxesList(keepAddingUntillFilled(boxesList))
    console.log(boxesList)
    drawThatMatrix(boxesList, arrColor)
    addTdListners(boxesList,
      setBoxesList,
      lastPickedValue, 
      setLastPickedValue,
      boxesCount, 
      setBoxesCount,
      bingo,
      turnStatus,
      setTurnStatus)
    
  },[setBoxesList])

    useEffect(() => {
        socket.on("connect", () => {
          console.log({id:socket.id, username:name, room});
          socket.emit("join_room", {id:socket.id, username:name, room, room_size},  (res) => {
            if(res.status === "ROOM_FULL"){
              return navigate("/")
            }
            setUsers(res.users);
            setCurrentUser({id:socket.id, username:name, room, host:res.room.host === socket.id?true:false})
          })
        });
  
  
        socket.on("welcome_message", (data) => {
          console.log(data);
          setUsers(data);
        });

        socket.on("host_closed_room", (data) => {
          navigate(`/`)
        });

        return () => {
          socket.emit("remove_player", {id:socket.id, username:name, room});
          socket.disconnect()
        };
      },[ socket, name, room]);
      
      
      socket.on("receive_message", (data) => {
        setBoxesList([...boxesList, data]);
      });
      
      window.addEventListener("beforeunload", e=>{
        socket.emit("remove_player", {id:socket.id, username:name, room});
        socket.disconnect()
        e.returnValue = `Are you Sure you want to leave?`;
        navigate(`/`)
      });
      const sendMessage = async (e) => {
        e.preventDefault();
        let messageContent = {
          room: room,
          content: {
            author: name,
            message: e.target.value,
          },
        };
        await socket.emit("send_message", messageContent);
        setBoxesList([...boxesList, messageContent]);
  
      };
      
      const closeRoom = async()=>{
        await socket.emit("close_room", getCurrentUser);
  
        navigate("/")
    }
  return (
    <section className="chat-section">
      <ChatHeader header_content={"Welcome " + name}/>
      <div className="chat-content">
        <div className="left">
          <div className="left-header">
            <div className="chat-button logout" onClick={()=>closeRoom()}>
                {getCurrentUser.host?"Close Room":"Logout"}
            </div>
            <div className="chat-button-rounds logout-shadow"></div>
          </div>
          <div className="left-body">
            <div className="header">
              <div className="panel-header-text">
                  {room}
              </div>
            </div>
                
            <ul>
                {users&& users.map((val, key)=>{
                return (
                    <li key={key}>
                    - {val.username}
                    </li>
                )
                })}
            </ul>
          </div>
        </div>
        <div className="right">
          <section className="game">
            <div className="game-col">
              <div className="lastPicked lastPickedVal">
                  <p className="lastPickedText">
                      Last 
                      Picked
                  </p>
              </div>
              <div className="lastPickedVal">
                  <p className="lastPickedNumber">0</p>
              </div>
            </div>
            <div className="tb">
                
                <table className="centered" cellSpacing="2">
                    <thead>
                        <tr>
                            <th colSpan="5" className="player player-1">Player 1</th>
                        </tr>
                        <tr>
                            <th colSpan="5" id="bingo">B,I,N,G,O</th>
                        </tr>
                    </thead>
                </table>
            </div>
          </section>
          <table className="player-boxes">
            <tbody id="player1">
                
            </tbody>
          </table>
        </div>
      </div>
    </section>
    )
}

export default Chat