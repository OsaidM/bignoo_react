import React from 'react'
import ChatHeader from '../ChatHeader'

const Index = ({pick_choice}) => {

    

  return (
    <section className='chat-section'>
        <ChatHeader header_content={"Welcome To Chat App"}/>
        <div className="index-content">
            <div className="index-button-rounds">
                <button className="index-button" onClick={(e)=>{
                    return (e.preventDefault, 
                    pick_choice("CREATE")
                    )}}>Create Room
                </button>   
                <div className="index-button-glass-shadow"></div>
            </div>
            <div className="index-button-rounds">
                <button className="index-button" onClick={(e)=>{
                    return (e.preventDefault, 
                    pick_choice("JOIN")
                    )}}>Join Room
                </button>   
                <div className="index-button-glass-shadow"></div>
            </div>
        </div>
    </section>
  )
}

export default Index