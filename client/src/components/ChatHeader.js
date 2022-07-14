import React from 'react'
import {Link} from "@reach/router"
const ChatHeader = ({header_content}) => {
  return (
    <header className='chat-header'>
    <Link to={"/"}>
      <h1 className='chat-h'>{header_content}</h1>
      </Link>
      <div className='chat-header-background'></div>
      </header>
  )
}

export default ChatHeader