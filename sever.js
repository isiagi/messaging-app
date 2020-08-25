const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser} = require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

const admin = "Admin ";

//Run when client connects
io.on('connection', socket => {
    // console.log(`New ws connection...`);

    socket.on('joinRoom', ({username, room})=> {
        const user = userJoin( socket.id,username, room)

        socket.join(user.room);

        //Welcome message
        socket.emit('message',formatMessage(admin , 'welcome to the chat'))

        //broadcast when the user connects
        socket.broadcast.to(user.room).emit('message',formatMessage(admin, `${user.username} has joined`))
    })

    //listen for chat message
    socket.on('ChatMessage', (msg)=>{
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message',formatMessage(user.username, msg))
    } )

     //when a user disconnects
     socket.on('disconnect', ()=> {
        io.emit('message',formatMessage(admin, 'A user has left the chat'))
    })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, ()=> {
    console.log(`we are listening at port ${PORT}`);
})