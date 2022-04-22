import React, {useContext} from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import '../styles/ChatRoom.css';
import { AppContext } from "../App";




export default function ChatRoom({sendHandler}) {

    const {name, room, message, setMessage, messages, usersList, setSigned, socket} = useContext(AppContext);

    const handleLeave = () => {
        setSigned(false);
        socket.emit('logout');
    }

    return (
        <div className="chat-room-container">
            <div className="chat-room-controls">
                <div className="room-number">ROOM {room}</div>
                <div className="room-members">
                    {usersList.map((user)=>
                        <div key={user} className="room-member">{user}</div>
                    )}
                </div>
                <div className="leave-room" onClick={handleLeave}>
                    Logout
                    <i className="material-icons">logout</i>
                </div>
            </div>

            <div className="chat-room-messages"> 
                <ScrollToBottom className="messages-area">
                
                {messages.map(({m,t,n})=>
                    <div key={Math.random()} className={n===name? "message sender" : "message"}>
                        <div className="message-meta">
                            <span className="message-sender">{n}</span>
                            <span className="message-time">{t}</span>
                        </div>
                        <div className="message-text">{m}</div>
                    </div>
                )}
                </ScrollToBottom>
                <div className="send-message-area">
                    <input
                        type="text"
                        placeholder="Type your message"
                        value={message}
                        onChange={
                            (e)=> setMessage(e.target.value)
                        }
                        onKeyPress={e=>{
                            e.key === "Enter" && sendHandler(e);
                        }}
                        
                    ></input>
                    <button onClick={sendHandler} >Send</button>
                </div>
            </div>
        </div>
    );
  }