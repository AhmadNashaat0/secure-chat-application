import './styles/App.css';
import React, {useState, useEffect, createContext} from 'react';
import Start from './components/Start.js';
import ChatRoom from './components/ChatRoom.js';
import io from 'socket.io-client';
import {pack, unpack, generateKeys} from './assets/crypt.js';

const myKeys = generateKeys();


export const AppContext = createContext(null);
let socket = io.connect('http://127.0.0.1:5000',{transports: ['websocket']});

function App() {

  

  const [encMessages, setEncMessages] = useState([]);
  const [signed, setSigned] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [serverKey, setServerKey] = useState('');

  useEffect(() => {
    const msgListner = (data) => {
      // setEncMessages((encMessages) => [...encMessages, {data: data.data, aes: data.aesKey}]);
      const {name,time,message} = unpack(data, myKeys.private)
      setMessages((messages)=>[...messages, {m:message,t:time,n:name,e:data,k:myKeys.private}]);
    };





    const usersListner = (users) => {
      let temp = [];
      for(let user in users){
        temp.push(users[user].name)
      }
      setUsersList(temp)
      
    };

    

    const keyListner = (key) =>  setServerKey(key);

    socket.on("message", msgListner)
    socket.on('key', keyListner)
    socket.on('users', usersListner)

    return ()=>{
      socket.off("message", msgListner)
      socket.off('key', keyListner)
    }
  }, [socket])

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  const signHandler = (e)=> {
    e.preventDefault();
    setSigned(true);
    
    if(socket){
      socket = io.connect('http://127.0.0.1:5000',{transports: ['websocket']});
      setMessages([]);
    }

    socket.emit('join',{
      name,
      room,
      key:myKeys.public,
    })

    
  }

  const sendHandler = (e)=> {
    e.preventDefault();
    const plaintext = {
      name,
      'time': formatAMPM(new Date()),
      message
    }
    socket.emit('message',pack(plaintext, serverKey));
    setMessage('');
    
  }



  return (
    <AppContext.Provider value={{ socket, setSigned, name, setName, room, setRoom, messages, setMessages, message, setMessage, serverKey, setServerKey, usersList, setSigned, setUsersList, encMessages }}>
      {!signed ? <Start setSigned = {setSigned} signHandler={signHandler} /> : <ChatRoom sendHandler={sendHandler}/>}
    </AppContext.Provider>

    // <div className="App">
    //  { !signed ? <div>
    //   <input placeholder='name' value={name} onChange={(e)=>setName(e.target.value)} />
    //   <input placeholder='room' value={room} onChange={(e)=>setRoom(e.target.value)} />
    //   <button onClick={signHandler}>Sign in</button> 
    //   </div>
    //   :
    //   <div>
    //   <input placeholder='type ur message' value={message} onChange={(e)=>setMessage(e.target.value)} />
    //   <button onClick={sendHandler}>Send</button>
    //   {messages.map((({m,t})=><p key={t}>{m}</p>))}
    //   </div>}
    // </div>
  );
}

export default App;
