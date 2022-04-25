const {Server} = require('socket.io');

const socketServer = (server) => {

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
            
            const roomUsers = rooms[room];            
            for(let user in roomUsers){
                io.to(user).emit('users',roomUsers);
            }
        });

        socket.on('message', ({data,aesKey})=>{
            for(let userId in aesKey) io.to(userId).emit('message',{data, 'aesKey':aesKey[userId]})
        });

        socket.on('disconnect',()=>{
            const room = users[socket.id]?.room;
            delete users[socket.id];
            delete rooms[room]?.[socket.id];
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