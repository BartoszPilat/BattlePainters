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

var players = [];
var player = {name:"", model:500, color:"white"};

io.sockets.on("connection", function (socket) {

     socket.on("error", function (err) {
        console.dir(err);
    });
    socket.on('disconnect', function (err) {
        console.dir(err);
    });
    
    socket.on('login', function (data) {
        var i;
        for (i = 0; i < names.length; i++) {
            if (names[i] === data) {
                socket.emit("err", "nick jest zajęty");
                return;
            }
        }
        
        socket.emit("loginOK", data);
    });
    
   
});

httpServer.listen(port, function () {
    console.log('Serwer HTTP działa na porcie ' + port);
});
