import './App.css';
import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import {pack, unpack, generateKeys} from './assets/crypt.js';
const myKeys = generateKeys();

const socket = io.connect('http://127.0.0.1:5000',{transports: ['websocket']});


function App() {

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [signed, setSigned] = useState(false);
  const [serverKey, setServerKey] = useState('');

  useEffect(() => {
    const msgListner = (data) => {
      const {message,time} = unpack(data, myKeys.private)
      setMessages((messages)=>[...messages, {m:message,t:time}]);
    }
    const keyListner = (key) =>  setServerKey(key);

    socket.on("message", msgListner)
    socket.on('key', keyListner)
    return ()=>{
      socket.off("message", msgListner)
      socket.off('key', keyListner)
    }
  }, [socket])

  const signHandler = (e)=> {
    e.preventDefault();
    setSigned(true)
    socket.emit('join',{
      name,
      room,
      key:myKeys.public,
    })
  }

  const sendHandler = (e)=> {
    e.preventDefault();
    const plaintext = {
      message,
      'time': Date.now()
    }
    socket.emit('message',pack(plaintext, serverKey));
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
      {messages.map((({m,t})=><p key={t}>{m}</p>))}
      </div>}
    </div>
  );
}

export default App;
