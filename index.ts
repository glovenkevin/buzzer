let app  = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req:any, res:any){
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket:any){
    console.log('a user connected');
    socket.on('joined', function(data:any) {
        console.log(data);
        socket.emit('acknowledge', 'Acknowledged');
    });
    socket.on('chat message', function(msg:any){
        io.emit('chat message', msg);
        //socket.broadcast.emit('response message', msg + '  from server');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
