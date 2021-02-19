const express = require('express');
const path = require('path');

const messenger = require('socket.io')();

const app = express();

app.use(express.static("public"));

const port = process.env.PORT || 5050;

app.get("/", (req,res) => {
    console.log('you have now hit the home route');
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/chat", (req,res) => {
    console.log('you have now hit the chat.html');
    res.sendFile(path.join(__dirname, "chat.html"));
});

const server = app.listen(port, ()=>{
    console.log(`app is running on ${port}`);
});
var i = 0;
//messenger is the connection mananger - like a switchboard prerator
messenger.attach(server);

//stock is the individual connection - the caller
messenger.on('connection', (socket) => {
    /* 进入房间人数+1 */
    i = i + 1;
    // send the user their assigned ID
    // 客户端发送自定义事件给服务器端
    socket.emit('connected', {sID: `${socket.id}`});
    // socket.broadcast.emit('number', { number: i,sID: `${socket.id}`,});
    socket.emit('number', { number: i});
    /* 服务器端响应自定义事件 */
    socket.on('chat_message', function(msg) {
        console.log(msg);
        console.log('发送数据给客户端方法：message');
        socket.broadcast.emit('message', { id: `${socket.id}`,username: `${msg.username}`, name: `${msg.name}`, message: `${msg.message}`, time: `${msg.time}` });
        socket.emit('message', { id: `${msg.id}`,username: `${msg.username}`, name: `${msg.name}`, message: `${msg.message}`, time: `${msg.time}` });
    });
    // 退出房间提示
    socket.on('disconnect',() => {
        i = i - 1; 
        socket.broadcast.emit('number', { number: i});
        socket.emit('number', { number: i});
    })

    

});