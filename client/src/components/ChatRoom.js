import React, { useContext, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "../styles/ChatRoom.css";
import { AppContext } from "../App";

const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export default function ChatRoom() {
  const {
    name,
    room,
    message,
    setMessage,
    messages,
    setSigned,
    socket,
    usersKeys,
    pack,
    usersList,
  } = useContext(AppContext);

  const [expand, setExpand] = useState(false);

  const handleLeave = () => {
    setSigned(false);
    socket.emit("logout");
  };
  const handleExpand = (e) => {
    e.preventDefault();
    setExpand(!expand);
  };
  const sendHandler = (e) => {
    e.preventDefault();
    const plaintext = {
      name,
      time: formatAMPM(new Date()),
      message,
    };
    socket.emit("message", pack(plaintext, usersKeys));
    setMessage("");
  };

  return (
    <div className="chat-room">
      <div className="chat-room-container">
        <div className="room-number">
          ROOM {room}
          {expand ? (
            <i className="material-icons expand" onClick={handleExpand}>
              keyboard_arrow_up
            </i>
          ) : (
            <i className="material-icons expand" onClick={handleExpand}>
              keyboard_arrow_down
            </i>
          )}
        </div>
        <div className="chat-container">
          <div className="chat-room-controls">
            <div className="room-members">
              <div className="members-header">Members list</div>
              {usersList.map((user) => (
                <div key={user} className="room-member">
                  {user}
                </div>
              ))}
            </div>
            <div className="leave-room" onClick={handleLeave}>
              <span>Logout</span>
              <i className="material-icons">logout</i>
            </div>
          </div>

          <div className="chat-room-messages">
            <ScrollToBottom className="messages-area">
              {messages.map(({ m, t, n, e, k }) => (
                <div
                  key={Math.random()}
                  className={n === name ? "message sender" : "message"}
                >
                  <div className="message-meta">
                    <span className="message-sender">{n}</span>
                    <span className="message-time">{t}</span>
                  </div>
                  <div className="message-text">{m}</div>
                  {expand && (
                    <div className="enc-data">
                      <div>
                        <span>
                          Encrypted message: <br />
                        </span>
                        {e.data}
                      </div>
                      {/* <div><span>AES key: <br /></span>{e.aesKey}</div>
                                    <div><span>Private RSA key: <br /></span>{k.replace('-----BEGIN RSA PRIVATE KEY-----', '').replace('-----END RSA PRIVATE KEY-----', '')}</div> */}
                    </div>
                  )}
                </div>
              ))}
            </ScrollToBottom>
            <div className="send-message-area">
              <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  e.key === "Enter" && sendHandler(e);
                }}
              ></input>
              <button onClick={sendHandler}>
                <span>Send</span>
                <i className="material-icons">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
