/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

var static = require('serve-static');
var less = require('less-middleware');
var path = require('path');
var port = process.env.PORT || 3000;

var oneDay = 86400000;

app.use(less(path.join(__dirname, 'public')));
app.use('/img', static(__dirname + '/public/img', { maxAge: oneDay }));
app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use('/js/jquery.min.map', static(__dirname + '/bower_components/jquery/dist/jquery.min.map'));
app.use(static(path.join(__dirname, '/public')));

var players = [
        {name:"", points:0, position:{x:0.0, y:0.0} },
        {name:"", points:0, position:{x:0.0, y:0.0} },
        {name:"", points:0, position:{x:0.0, y:0.0} },
        {name:"", points:0, position:{x:0.0, y:0.0} },
    ];

var roomNumber = 0;
var actualPlayerNumber = 0;

io.sockets.on("connection", function (socket) {

     socket.on("error", function (err) {
        console.dir(err);
    });
    socket.on('disconnect', function (err) {
    
        console.dir(err);
    });
    
    socket.on('SearchRandom', function (data) {
        /*var i;
        for (i = 0; i < names.length; i++) {
            if (names[i] === data) {
                socket.emit("err", "nick jest zajęty");
                return;
            }
        }    */    
    if(actualPlayerNumber < 4){
        socket.join(roomNumber);
        actualPlayerNumber++;
        socket.emit("joinRoom", [roomNumber, actualPlayerNumber]);
    }
    else{
        roomNumber++;
        actualPlayerNumber = 0
        
        socket.join(roomNumber);
        actualPlayerNumber++;
        socket.emit("joinRoom", [roomNumber, actualPlayerNumber]);
    }
    
    socket.emit("loginOK", data);
    });
    
    socket.on('game', function (roomId, playerID, msg) {
        socket.broadcast.to(socket.).emit('game', [roomId, playerID, msg]);
        //io.to(roomId).emit('game', [roomId, playerID, msg]);
        console.log('game');
    });
    
   
});

httpServer.listen(port, function () {
    console.log('Serwer HTTP działa na porcie ' + port);
});
