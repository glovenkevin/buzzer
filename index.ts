let app  = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req:any, res:any){
    res.sendFile(__dirname + '/index.html');
});

app.get('/logo', function(req:any, res:any){
    res.sendFile(__dirname + '/image/doge.jpeg');
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
        console.log(msg);
        io.emit('chat message', msg);
    });

    let leaderboard:any = []
    socket.on('admin command', function(msg:any){
        console.log(msg);
        io.emit('admin command', msg);

        if (msg == 'not-release') {
            leaderboard = []
        }
        socket.emit('leaderboard', leaderboard);
    });

    socket.on('leaderboard', function(msg:any){
        leaderboard.push(msg)
        console.log(leaderboard)
        io.emit('leaderboard', leaderboard);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
