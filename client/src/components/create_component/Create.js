import React,{useState} from 'react'
import ChatHeader from '../ChatHeader'
const Create = ({createRoom}) => {
    const [room, setRoom] = useState("");
    const [userName, setUserName] = useState("");
    const [roomSize, setRoomSize] = useState(null);

  return (
    <section className='chat-section'>
        <ChatHeader header_content={"Create Room"}/>
        <div className="create-content">
            <div className="col">
                <div className="create-text-rounds">
                    <input type="text" name="username" className="create-room-id" placeholder="User Name" onChange={(e) => {
                        setUserName(e.target.value);
                    }}/>
                    <div className="create-glass-shadow shadow-width"></div>
                </div>
                <div className="create-text-rounds">
                    <input type="text" name="create-room-id" className="create-room-id" placeholder="Room ID" onChange={(e) => {
                        setRoom(e.target.value);
                    }}/>
                    <div className="create-glass-shadow"></div>
                </div>
                <div className="create-text-rounds">
                    <input type="number" name="room-size" className="create-room-id" placeholder="2" onChange={(e) => {
                        setRoomSize(e.target.value);
                    }}/>
                    <div className="create-glass-shadow shadow-width"></div>
                </div>
            </div>
            <div className="create-button-rounds">
                <div className="create-button create" onClick={(e)=>{
                    return (e.preventDefault, 
                        createRoom(room, userName, roomSize)
                    )}}>
                    Create Room
                </div>
                <div className="create-shadow"></div>

            </div>
        </div>
    </section>
  )
}

export default Create