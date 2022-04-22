const {Server} = require('socket.io');
const {pack, unpack, generateKeys} = require('./myCrypt.js');

const socketServer = (server) => {

    const serverKeys = generateKeys()
    let rooms = {}
    let users = {}

    const io = new Server(server,{
        cors:{
            origin: '*',
            methods:['GET',"POST"]
        }
    });

    io.on('connection', (socket)=>{

        socket.on('join',(user)=>{
            const room = user.room;
            socket.join(room);
            users[socket.id] = {...user};
            delete user.room;       
            rooms[room] = !rooms[room]? 
                        {[socket.id]:user}:
                        {...rooms[room], [socket.id]:user};
            socket.emit('key',serverKeys.public);
            
            const roomUsers = rooms[room];            
            for(let user in roomUsers){
                io.to(user).emit('users',roomUsers);
            }

            
        });
        socket.on('message', ({data,aesKey})=>{
            const room = users[socket.id].room;
            const roomUsers = rooms[room];
            aesKey = unpack(aesKey, serverKeys.private)
            
            for(let user in roomUsers){
                let userKey = users[user].key
                io.to(user).emit('message',{data, 'aesKey':pack(aesKey,userKey)})
            }
        });
        socket.on('disconnect',()=>{
            const room = users[socket.id]?.room;
            delete users[socket.id];
            delete rooms[room][socket.id];
            const roomUsers = rooms[room];            
            for(let user in roomUsers){
                io.to(user).emit('users',roomUsers);
            }
        }) 

        socket.on('logout',()=>{
            socket.disconnect();
        }) 
        
    });
}

module.exports = socketServer