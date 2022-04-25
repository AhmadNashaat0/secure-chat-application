import './styles/App.css';
import React, {useState, useEffect, createContext} from 'react';
import Start from './components/Start.js';
import ChatRoom from './components/ChatRoom.js';
import io from 'socket.io-client';
import {pack, unpack, generateKeys} from './services/crypt.js';

const myKeys = generateKeys();
let socket = io.connect('http://127.0.0.1:5000',{transports: ['websocket']});
export const AppContext = createContext(null);

function App() {

  const [signed, setSigned] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [usersKeys, setUsersKeys] = useState({});

  useEffect(() => {
    const msgListner = (data) => {
      const {name,time,message} = unpack(data, myKeys.private)
      setMessages((messages)=>[...messages, {m:message,t:time,n:name,e:data,k:myKeys.private}]);
    };
    const usersListner = (users) => {
      let temp = [];
      let keys = {}
      for(let user in users){
        temp.push(users[user].name)
        keys[user] = users[user].key
      }
      setUsersList(temp);
      setUsersKeys(keys);
    };

    socket.on("message", msgListner)
    socket.on('users', usersListner)

    return ()=>{
      socket.off("message", msgListner)
    }

  }, [socket])

  const signHandler = (e)=> {
    e.preventDefault();
    if(!name || !room) return;
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

  const value = { socket, setSigned, name, setName, room, setRoom, io,
                messages, setMessages, message, setMessage, usersKeys,
                usersList, setUsersList, pack, myKeys
                }

  return (
    <AppContext.Provider value={value}>
      {!signed ? <Start signHandler={signHandler}/>  :  <ChatRoom/> }
    </AppContext.Provider>
  );
}

export default App;
