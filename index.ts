let express = require('express');
let app  = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var favicon = require('serve-favicon');

import path from "path";
import {InMemoryLeaderboardStore} from "./messageStore";
import {InMemoryStateStore} from "./stateStore";

const leaderboardStore = new InMemoryLeaderboardStore();
const waitingStateStore = new InMemoryStateStore();
const releasestateStore = new InMemoryStateStore();

app.use(express.static(path.join(__dirname,'/static')));


app.get('/', function(req:any, res:any){
    res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function(req:any, res:any){
    res.sendFile(__dirname + '/admin.html');
});

io.use((socket:any, next:any) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('Invalid username'))
    }

    socket.username = username
    next()
})

io.on('connection', function(socket:any){
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
        users.push({
            userID: id, 
            username: socket.username,
        })
    }
    console.log('users', users)

    socket.on('joined', function(data:any) {
        console.log(data);
        socket.emit('acknowledge', 'Acknowledged');
    });

    socket.on('chat message', function(msg:any){
        // io.emit('chat message', msg);
        console.log(msg);
        waitingStateStore.saveState(msg)
        broadcastWaitState();
    });

    socket.on('admin command', function(msg:any){
        // console.log(msg);
        releasestateStore.saveState(msg);
        broadcastReleaseState();

        if (msg == 'not-release') {
            leaderboardStore.clear();
        }
        if(msg == 'release'){
            waitingStateStore.clear();
        }
        broadcastLeaderboard();
    });

    socket.on('leaderboard', function(msg:any){
        leaderboardStore.saveLeaderboard(msg);
        broadcastLeaderboard();
    });

    broadcastLeaderboard();
    broadcastReleaseState();
    
    socket.on('update content', function(msg:any){
        io.emit('update content', msg);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});


function broadcastLeaderboard(){
    io.emit('leaderboard', leaderboardStore.getAllLeaderboard());
}

function broadcastWaitState(){
    io.emit('chat message',  waitingStateStore.getAllState());
}

function broadcastReleaseState(){
    io.emit('admin command',  releasestateStore.getAllState());
}