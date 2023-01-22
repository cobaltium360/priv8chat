const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const user = require("./controllers/user")
const adduser = user.Adduser;
const getuser = user.GetUser;
const sendMes = user.sendMes;
const connect = user.connect;
const deconnect = user.deconnect;
app.use(cors());

const io = new Server(server, {
    path : "/ws",
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection" , (socket) => {
    connect(io)
    socket.on('disconnect', () => {
        deconnect(socket, io)
    });
    socket.on("send_pseudo", (data) => {
        adduser(data.pseudo, socket.id, io, socket)
    })
    socket.on("send_getpseudo", (data) => {
        getuser(data.pseudo, socket.id, io)
    })

    socket.on("send_message", (data) => {
        sendMes(data.pseudo, socket.id, data.message, io)
    })
})

server.listen(3001, () => {
  console.log('listening on : 3001');
});
