let app  = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req:any, res:any){
    res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function(req:any, res:any){
    res.sendFile(__dirname + '/admin.html');
});

io.use((socket:any, next:any) => {
    // const sessionID = socket.handshake.auth.sessionID;
    // if (sessionID) {
    //     const session = sess.findSession(sessionID);
    //     if (session) {
    //         socket.sessionID = sessionID
    //         socket.userID = session.userID
    //         socket.username = session.username
    //         return next()
    //     }
    // }

    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('Invalid username'))
    }

    socket.username = username
    // socket.sessionID = randomUUID()
    // socket.userID = randomUUID()
    next()
})

io.on('connection', function(socket:any){
    console.log('a user connected');

    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
        users.push({
            userID: id, 
            username: socket.username,
        })
    }
    console.log('users', users)

    // socket.emit('session', {
    //     sessionID: socket.sessionID,
    //     userID: socket.userID,
    // })

    socket.on('joined', function(data:any) {
        console.log(data);
        socket.emit('acknowledge', 'Acknowledged');
    });

    socket.on('chat message', function(msg:any){
        console.log(msg);
        io.emit('chat message', msg);
        //socket.broadcast.emit('response message', msg + '  from server');
    });

    socket.on('admin command', function(msg:any){
        console.log(msg);
        io.emit('admin command', msg);
    });

    
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
