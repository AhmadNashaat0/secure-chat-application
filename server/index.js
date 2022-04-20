const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const {Server} = require('socket.io'); 

port = process.env.PORT || 5000 ;

app.use(cors());
const io = new Server(server,{
    cors:{
        origin: '*',
        methods:['GET',"POST"]
    }
});

rooms = {}
users = {}
io.on('connection', (socket)=>{
    socket.on('join',(user)=>{
        const room = user.room, name = user.name, keys = [];
        socket.join(room);
        users[name]=user;
        delete user.room;
        rooms[room] = !rooms[room]? {[name]:user}:{...rooms[room], [name]:user};

        for(let i in rooms[room]) keys.push(rooms[room][i].key);
        socket.to(room).emit('key',keys);
    });
    socket.on('message', (data)=>{
        socket.to(data.room).emit('message',data.message);
    });
    // socket.on('disconnect',()=>{
    //     console.log(`user disconnected: ${socket.id}` );
    //  })
    
});



server.listen(port, ()=> console.log(`server listen on ${port}`));