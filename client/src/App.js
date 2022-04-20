import './App.css';
import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import {pack, unpack, generateKeys} from './assets/crypt.js';


function App() {

  const myKeys = generateKeys();
  const [keys, setKeys] = useState([]);

  const socket = io.connect('http://127.0.0.1:5000',{transports: ['websocket']});
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    socket.on("message",(msg) => {
      setMessages((messages)=>[...messages, msg]);
    })
    socket.on("keys",(kys) => {
      setKeys(kys);
    })
  }
  ,[socket])

  const signHandler = (e)=> {
    e.preventDefault();
    setSigned(true)
    socket.emit('join',{
      name,
      room,
      id: socket.id,
      key:keys.public
    })
  }

  const sendHandler = (e)=> {
    e.preventDefault();
    const plaintext = {
      name,
      message,
      room,
      id: socket.id,
    }
    socket.emit('message',plaintext);
    setMessage('');
  }
  
  return (
    <div className="App">
     { !signed ? <div>
      <input placeholder='name' value={name} onChange={(e)=>setName(e.target.value)} />
      <input placeholder='room' value={room} onChange={(e)=>setRoom(e.target.value)} />
      <button onClick={signHandler}>Sign in</button> 
      </div>
      :
      <div>
      <input placeholder='type ur message' value={message} onChange={(e)=>setMessage(e.target.value)} />
      <button onClick={sendHandler}>Send</button>
      {messages.map((message=><p key={message}>{message}</p>))}
      </div>}
    </div>
  );
}

export default App;
